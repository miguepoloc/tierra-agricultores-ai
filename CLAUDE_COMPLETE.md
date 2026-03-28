# CLAUDE.md — Tierra de Agricultores AI

**Curso:** Herramientas para el desarrollo de aplicaciones con IA  
**Universidad:** Universidad del Magdalena — Ingeniería de Sistemas  
**Docente:** Miguel Angel Polo Castañeda  
**Proyecto:** Tierra de Agricultores — Backend FastAPI con RAG y Factory Pattern

---

## I. VISIÓN DEL PROYECTO

Este proyecto encarna las **4 capas del curso**:

1. **RULES** ← Este archivo (estándares siempre activos)
2. **SKILLS** ← `.agent/skills/backend-fastapi/SKILL.md` (instrucciones bajo demanda)
3. **RAG** ← `knowledge/*.md` + `ContextLoader` (conocimiento inyectado)
4. **LANGCHAIN** ← `langchain_adapter.py` (desacoplamiento total)

El objetivo: **construir un sistema que responde sobre un dominio específico sin entrenar nada, solo inyectando conocimiento en tiempo de ejecución.**

---

## II. ARQUITECTURA HEXAGONAL

### A. Estructura de capas

```
tierra-agricultores-ai/
├── src/
│   ├── domain/                          # La lógica pura, sin dependencias
│   │   ├── schemas.py                   # AIProvider enum, ChatRequest, ChatResponse
│   │   └── interfaces.py (opcional)     # IModelAdapter si lo necesitas
│   │
│   ├── services/                        # Orquestación, sin detalles técnicos
│   │   └── chat_service.py              # ChatService con lógica de negocio
│   │
│   └── infrastructure/                  # Detalles técnicos, integraciones
│       ├── model_factory.py             # Factory Pattern
│       ├── gemini_adapter.py            # Adaptador Gemini
│       ├── openai_adapter.py            # Adaptador OpenAI
│       ├── claude_adapter.py            # Adaptador Claude
│       ├── deepseek_adapter.py          # Adaptador DeepSeek
│       ├── langchain_adapter.py         # Adaptador LangChain (con LCEL)
│       └── context_loader.py            # Carga skills/*.md + knowledge/*.md
│
├── knowledge/                           # Base de datos de texto (sin embeddings)
│   ├── plataforma.md                    # Qué es Tierra de Agricultores
│   ├── productos.md                     # Catálogo y precios
│   ├── asociados.md                     # Cómo ser agricultor asociado
│   └── compradores.md                   # Cómo comprar y políticas
│
├── skills/                              # System prompt del chatbot
│   └── asistente-tienda.md              # Instrucciones al modelo para responder
│
├── .agent/skills/                       # Skills para el editor de código
│   └── backend-fastapi/
│       ├── SKILL.md                     # Instrucciones al agente para programar
│       ├── references/REFERENCE.md      # Patrones, ejemplos
│       └── examples/main_example.py     # Ejemplo de código
│
├── main.py                              # Entrypoint FastAPI
├── requirements.txt                     # Dependencias con versiones fijas
├── vercel.json                          # Configuración de despliegue
├── .env.example                         # Template de variables de entorno
└── .gitignore                           # Excluir .env, __pycache__, etc.
```

### B. Regla de oro: flujo descendente

```
domain/ (lógica pura, sin frameworks)
    ↓ importa desde
services/ (orquestación, sin detalles técnicos)
    ↓ importa desde
infrastructure/ (detalles, adaptadores, factory)

NUNCA invertir este flujo. Si domain/ sabe de FastAPI o Gemini, violaste la arquitectura.
```

---

## III. PYTHON — ESTÁNDARES DE CÓDIGO

### A. Type hints obligatorios en TODO

Toda función, variable de ciclo, parámetro, retorno **DEBE** tener type hint.

```python
# ✓ CORRECTO
def chat(
    pregunta: str,
    provider: str,
    historial: list[dict] | None = None
) -> dict[str, str]:
    """Procesa una pregunta y retorna la respuesta."""
    respuesta: str = ""
    tokens_usados: int = 0
    return {"respuesta": respuesta, "tokens": tokens_usados}

# ✗ INCORRECTO: faltan type hints
def chat(pregunta, provider, historial=None):
    respuesta = ""
    return {"respuesta": respuesta}
```

### B. Pydantic v2 para schemas

Toda entrada/salida de API **DEBE** ser un schema Pydantic.

```python
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    pregunta: str = Field(..., min_length=1, max_length=500)
    provider: str = Field(default="gemini", description="gemini|openai|claude|deepseek|langchain")
    historial: list[dict] = Field(default_factory=list)

class ChatResponse(BaseModel):
    respuesta: str
    tokens_usados: int | None = None
    proveedor_usado: str
```

### C. Try/except explícito — nunca `except: pass`

Siempre especifica la excepción y manejala explícitamente.

```python
# ✓ CORRECTO
try:
    response = model.generate_content(prompt, config=config)
except ValueError as e:
    logger.error(f"Error en modelo {provider}: {str(e)}")
    return ChatResponse(respuesta="Hubo un error procesando tu pregunta")
except Exception as e:
    logger.critical(f"Error inesperado: {str(e)}")
    raise

# ✗ INCORRECTO: oculta errores
try:
    response = model.generate_content(prompt)
except:
    pass
```

### D. Naming conventions

- **Constantes:** `GOOGLE_API_KEY`, `MAX_TOKENS`, `DEFAULT_PROVIDER`
- **Clases:** `ChatService`, `GeminiAdapter`, `ContextLoader`
- **Funciones:** `load_knowledge()`, `responder()`, `create_adapter()`
- **Variables privadas:** `_client`, `_model`, `_config`

### E. Imports organizados

```python
# 1. Estándar library
import os
import logging
from pathlib import Path
from enum import Enum

# 2. Terceros
from pydantic import BaseModel
import google.generativeai as genai

# 3. Local
from domain.schemas import AIProvider, ChatRequest
from infrastructure.context_loader import ContextLoader
```

---

## IV. MODELOS DE IA — FACTORY PATTERN

### A. NUNCA instanciar directamente

```python
# ✗ PROHIBIDO en services/ o domain/
from infrastructure.gemini_adapter import GeminiAdapter
adapter = GeminiAdapter()  # Acoplamiento directo

# ✓ CORRECTO siempre
from infrastructure.model_factory import AIModelFactory, AIProvider
adapter = AIModelFactory.create(AIProvider.GEMINI)
```

### B. El enum AIProvider es la fuente de verdad

```python
class AIProvider(str, Enum):
    """Proveedores soportados."""
    GEMINI = "gemini"
    OPENAI = "openai"
    CLAUDE = "claude"
    DEEPSEEK = "deepseek"
    LANGCHAIN = "langchain"
```

### C. Factory Pattern en infrastructure/

```python
class AIModelFactory:
    """Factory para crear adaptadores sin acoplamiento."""

    @staticmethod
    def create(provider: AIProvider) -> IModelAdapter:
        """Crea el adaptador correcto según el provider."""
        match provider:
            case AIProvider.GEMINI:
                return GeminiAdapter()
            case AIProvider.OPENAI:
                return OpenAIAdapter()
            case AIProvider.CLAUDE:
                return ClaudeAdapter()
            case AIProvider.DEEPSEEK:
                return DeepSeekAdapter()
            case AIProvider.LANGCHAIN:
                return LangChainGeminiAdapter()
            case _:
                raise ValueError(f"Provider desconocido: {provider}")
```

### D. Interface IModelAdapter (Dependency Inversion)

```python
from abc import ABC, abstractmethod

class IModelAdapter(ABC):
    """Interface que todos los adaptadores implementan."""

    @abstractmethod
    def complete(
        self,
        system: str,
        user: str,
        history: list[dict] | None = None
    ) -> tuple[str, int | None]:
        """
        Genera una respuesta.

        Args:
            system: System prompt (contexto + instrucciones)
            user: Pregunta del usuario
            history: Historial de conversación

        Returns:
            (respuesta, tokens_usados)
        """
        pass
```

---

## V. CONOCIMIENTO — RAG SIMPLIFICADO

### A. System prompt SIEMPRE desde `skills/asistente-tienda.md`

NUNCA hardcodees instrucciones en el código.

```python
# ✗ PROHIBIDO
system_prompt = """
Eres un asistente de Tierra de Agricultores.
Sé amable y responde en español.
"""

# ✓ CORRECTO
from infrastructure.context_loader import ContextLoader

loader = ContextLoader()
system_prompt = loader.load_skill()  # Lee skills/asistente-tienda.md
```

**Contenido de `skills/asistente-tienda.md`:**

```markdown
# Asistente de Tierra de Agricultores

Eres el asistente de ventas de la plataforma.

## Instrucciones

- Responde SIEMPRE en español
- Sé amable y profesional
- Si no sabes algo, di "No tengo esa información"
- NUNCA inventes datos de precios o disponibilidad
- Consulta la base de conocimiento (productos, precios, asociados)

## Restricciones

- No hagas promesas que no puedas cumplir
- No des consejos médicos
- No hables de política
```

### B. Knowledge SIEMPRE desde `knowledge/*.md`

```python
# ✓ CORRECTO: inyecta el knowledge en cada petición
knowledge = loader.load_knowledge()  # Combina todos los .md
full_context = loader.load_full_context()
```

**Contenido de `knowledge/productos.md`:**

```markdown
# Productos disponibles

## Frutas

- **Pomelo:** $2.000 por unidad
- **Guineo Manzano:** $1.200 por unidad
- **Cilantro:** $2.000 por atado

## Verduras

- **Tomate:** $1.500 por kg
- **Cebolla:** $1.200 por kg
```

### C. ContextLoader: la magia de RAG simplificado

```python
class ContextLoader:
    """Carga skills/*.md y knowledge/*.md en cada petición."""

    def load_skill(self) -> str:
        """Lee skills/asistente-tienda.md."""
        path = Path("skills/asistente-tienda.md")
        if not path.exists():
            return "Eres un asistente útil."
        return path.read_text(encoding='utf-8')

    def load_knowledge(self) -> str:
        """Lee todos los .md en knowledge/ en orden."""
        files = sorted(Path("knowledge").glob("*.md"))
        return "\n\n---\n\n".join(
            f.read_text(encoding='utf-8') for f in files
        )

    def load_full_context(self) -> str:
        """Combina skill + knowledge."""
        skill = self.load_skill()
        knowledge = self.load_knowledge()
        return f"{skill}\n\n## Base de conocimiento:\n\n{knowledge}"
```

### D. Inyectar en cada petición

```python
# En services/chat_service.py
loader = ContextLoader()
context = loader.load_full_context()

# El modelo recibe:
# [1] System role: context (skill + knowledge)
# [2] User role: pregunta_usuario
# [3] Historial (si existe)

respuesta = adapter.complete(
    system=context,
    user=pregunta_usuario,
    history=historial
)
```

**Por qué esto es RAG:**

- No entrenar el modelo (caro, lento)
- No usar vectorstore (complejo, costoso)
- Solo inyectar el contexto relevante en cada petición (simple, gratuito)

---

## VI. LANGCHAIN — DESACOPLAMIENTO TOTAL

### A. Cuándo usar LangChain vs. google-genai directo

En **este proyecto**, ambos son válidos:

1. **google-genai directo** (lo que ves en `gemini_adapter.py`)
    - Más rápido
    - Menos dependencias
    - Más control

2. **LangChain** (lo que ves en `langchain_adapter.py`)
    - Formaliza la estructura
    - Facilita cambiar de modelo
    - Reutilizable

### B. Estructura LangChain con LCEL

```python
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

class LangChainGeminiAdapter(IModelAdapter):
    def __init__(self):
        self._llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.3
        )

        # Template declarat: system + historial + user
        self._prompt = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"),
            MessagesPlaceholder(variable_name="historial"),
            ("human", "{pregunta}")
        ])

        # LCEL: pipeline declarativo
        self._chain = (
            self._prompt
            | self._llm
            | StrOutputParser()
        )

    def complete(self, system: str, user: str, history=None):
        return self._chain.invoke({
            "system_prompt": system,
            "historial": history or [],
            "pregunta": user
        }), None
```

**LCEL = composición con el operador pipe |**

- `prompt | llm` = pasa output de prompt al llm
- `llm | parser` = pasa output del llm al parser
- Extensible sin reescribir

---

## VII. SEGURIDAD — SIN EXCEPCIONES

### A. NUNCA hardcodear API keys

```python
# ✗ PROHIBIDO
GOOGLE_API_KEY = "AIza..."
openai_key = "sk-..."

# ✓ CORRECTO
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY no está configurada en .env")
```

### B. Rutas SIEMPRE relativas a la raíz del proyecto

```python
from pathlib import Path

# ✓ CORRECTO
skills_path = Path("skills/asistente-tienda.md")
knowledge_path = Path("knowledge/productos.md")

# ✗ INCORRECTO
skills_path = Path("/home/usuario/proyecto/skills/...")  # Absoluta
skills_path = Path("../../../skills/...")  # Confusa
```

### C. .env SIEMPRE en .gitignore

```bash
# .gitignore
.env
.env.local
*.key
*.pem
__pycache__/
*.pyc
.venv/
```

### D. Validación de entrada con Pydantic

```python
from pydantic import BaseModel, Field, validator

class ChatRequest(BaseModel):
    pregunta: str = Field(..., min_length=1, max_length=500)
    provider: str = Field(default="gemini")

    @validator('provider')
    def validate_provider(cls, v):
        valid = ["gemini", "openai", "claude", "deepseek", "langchain"]
        if v not in valid:
            raise ValueError(f"Provider inválido: {v}")
        return v
```

---

## VIII. DESPLIEGUE — VERCEL

### A. Entrypoint: main.py expone `app`

Vercel **NO** ejecuta `python main.py`. Busca la variable `app` directamente.

```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tierra de Agricultores AI")

# CORS para frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    pass

# ✗ NUNCA hagas esto:
# if __name__ == "__main__":
#     uvicorn.run(app)  # Vercel no lo ejecuta
```

### B. requirements.txt con versiones explícitas

```bash
# Usar: pip freeze > requirements.txt
fastapi==0.104.1
pydantic==2.5.0
pydantic-settings==2.1.0
google-genai==0.3.0
langchain-core==0.1.20
langchain-google-genai==0.0.10
python-dotenv==1.0.0
uvicorn==0.24.0
```

### C. vercel.json

```json
{
    "buildCommand": "pip install -r requirements.txt",
    "outputDirectory": ".",
    "env": {
        "GOOGLE_API_KEY": "@google_api_key"
    }
}
```

### D. Desplegar

```bash
npm i -g vercel
vercel login
vercel --prod

# Luego en Vercel dashboard:
# Settings → Environment Variables
# Añadir GOOGLE_API_KEY
```

---

## IX. PATRONES PEDAGÓGICOS DEL CURSO

### A. Factory Pattern = Flexibilidad

La ventaja **real**:

```python
# Para cambiar de Gemini a LangChain:
# Opción 1: Cambiar en el request
POST /chat
{ "pregunta": "...", "provider": "langchain" }

# Opción 2: En código
adapter = AIModelFactory.create(AIProvider.LANGCHAIN)

# El ChatService.respond() nunca se enteró del cambio
# Eso es Dependency Inversion (D de SOLID)
```

### B. Progressive Disclosure = Eficiencia de contexto

Las Skills no cargan todo:

1. **Capa 1 — Metadatos (~100 tokens):**
    - name: "backend-fastapi"
    - description: "Use this skill when..."
    - Siempre en memoria, el agente las escanea

2. **Capa 2 — Instrucciones (~5,000 tokens):**
    - Cuerpo completo del SKILL.md
    - Se cargan SOLO cuando la descripción coincide

3. **Capa 3 — Recursos (variable):**
    - references/REFERENCE.md
    - examples/main_example.py
    - Se cargan bajo demanda explícita

**Impacto económico:**

- Sin Progressive Disclosure: 20 Skills × 5,000 tokens = 100,000 tokens fijos
- Con Progressive Disclosure: 20 × 100 = 2,000 tokens base + solo lo usado

### C. RAG Simplificado = Sin complicaciones

NO uses:

- ❌ Pinecone (caro)
- ❌ Chroma (complejo)
- ❌ Vector databases (overhead)
- ❌ Embeddings (tokens extra)

USA:

- ✓ ContextLoader (lee .md)
- ✓ Inyecta en cada petición
- ✓ Gratuito
- ✓ Simple

---

## X. SKILLS DEL PROYECTO — DOS TIPOS

### A. `.agent/skills/backend-fastapi/SKILL.md`

**Para el EDITOR (Antigravity/Cursor/Claude Code)**

Le dice al agente de código **cómo PROGRAMAR este proyecto**.

```markdown
---
name: backend-fastapi
description: >
    Use this skill when creating, modifying or extending the FastAPI backend.
    Activates for: 'create endpoint', 'add service', 'refactor AI adapter', 
    'add provider'.
compatibility: Python 3.12+, FastAPI, Pydantic v2
---

# Objetivo

Construir el backend de IA con arquitectura hexagonal, Factory Pattern
e inyección de dependencias.

## Instrucciones

1. Separar en capas: domain / services / infrastructure
2. Factory para seleccionar el modelo de IA
3. Type hints en todas las funciones
4. Pydantic v2 para schemas

## Restricciones

- NUNCA hardcodear API keys
- NUNCA mezclar capas en un mismo archivo
- NUNCA instanciar adaptadores directo
```

### B. `skills/asistente-tienda.md`

**Para el BACKEND (el chatbot)**

Le dice al modelo **cómo RESPONDER a usuarios**.

```markdown
# Asistente de Tierra de Agricultores

Eres el asistente de ventas.

## Instrucciones

- Responde en español
- Sé amable y profesional
- Consulta la base de conocimiento

## Restricciones

- No inventes datos
- No hagas promesas
```

---

## XI. CHECKLIST ANTES DE CADA COMMIT

Antes de hacer `git commit`, verifica:

- [ ] **Type hints:** Toda función tiene type hints
- [ ] **Pydantic:** Schemas en BaseModel
- [ ] **Try/except:** Excepciones específicas, sin `except: pass`
- [ ] **Factory:** Modelos vía Factory, no imports directos
- [ ] **System prompt:** Desde `skills/*.md`, no hardcodeado
- [ ] **Knowledge:** Desde `knowledge/*.md`, inyectado en cada petición
- [ ] **Sin secrets:** No hay API keys en código
- [ ] **Rutas:** Todas relativas (`Path("...")`)
- [ ] **`.env`:** Está en `.gitignore`
- [ ] **`requirements.txt`:** Actualizado con `pip freeze`
- [ ] **Estructura:** Carpetas respetadas, no creadas nuevas sin consultar
- [ ] **main.py:** Expone `app`, no tiene `if __name__`
- [ ] **Tests:** Si modificas lógica crítica, prueba localmente

---

## XII. TROUBLESHOOTING

### "No puedo importar mi módulo"

```python
# ✗ Esto falla
from infrastructure.gemini_adapter import GeminiAdapter

# ✓ Asegúrate de tener __init__.py
src/__init__.py
src/domain/__init__.py
src/services/__init__.py
src/infrastructure/__init__.py
```

### "El ContextLoader no encuentra los archivos"

```python
# ✓ Corre desde la raíz
cd tierra-agricultores-ai
python main.py

# ✗ NO desde dentro de src/
cd tierra-agricultores-ai/src
python main.py  # Falla: no encuentra knowledge/
```

### "Vercel dice que no encuentra main.py"

```json
// vercel.json debe estar en la RAIZ, no en src/
{
    "buildCommand": "pip install -r requirements.txt",
    "outputDirectory": "."
}
```

---

## XIII. REFLEXIÓN FINAL

Estas Rules **SON el curso materializado**:

| Concepto         | Dónde                                    | Por qué                         |
| ---------------- | ---------------------------------------- | ------------------------------- |
| **Arquitectura** | `src/domain → services → infrastructure` | Separación de responsabilidades |
| **Factory**      | `infrastructure/model_factory.py`        | Desacoplamiento, flexibilidad   |
| **RAG**          | `knowledge/*.md` + `ContextLoader`       | Conocimiento sin entrenar       |
| **Skills**       | `.agent/skills/` y `skills/`             | Dos mundos: editor y backend    |
| **Pydantic**     | Toda entrada/salida                      | Validación automática           |
| **Type hints**   | Todo                                     | Claridad, debugging, IDE        |
| **Seguridad**    | `.env`, `os.getenv()`, `Path()`          | No exposición de secrets        |
| **Despliegue**   | Vercel, `main.py` expone `app`           | Producción lista                |

**Cada regla tiene un propósito pedagógico.**

Sigue estas Rules y:

- ✓ Tu código será profesional
- ✓ El agente aprenderá a programar como un senior
- ✓ Los estudiantes entenderán arquitectura real
- ✓ Podrás cambiar de proveedor en 1 línea
- ✓ Desplegarás en Vercel sin sorpresas

---

**Última actualización:** Curso IA UniMagdalena, Sábado Bloque 2-3-4  
**Vigencia:** 2025
