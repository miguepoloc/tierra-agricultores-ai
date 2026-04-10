# CLAUDE.md — Reglas del proyecto Tierra de Agricultores

Este archivo contiene las reglas que Claude Code debe seguir al desarrollar en este proyecto. Fue creado según el curso **"Herramientas para el desarrollo de aplicaciones con IA"** de la Universidad del Magdalena.

---

## 1. ARQUITECTURA — Hexagonal simplificada

### Separación de capas obligatoria
- `src/domain/` — Modelos, schemas, enums. Sin dependencias de framework.
- `src/services/` — Lógica de negocio. Sin FastAPI, sin Gemini directo.
- `src/infrastructure/` — Adaptadores, factory, context loader. Aquí va el acoplamiento a Gemini/LangChain.

### Regla de oro: nunca importar hacia arriba
```python
# ✓ CORRECTO
domain → services → infrastructure

# ✗ PROHIBIDO
infrastructure → services → domain
domain ← services ← infrastructure
```

Si `domain/` sabe de FastAPI, Gemini o LangChain, **estás violando esta regla**.

---

## 2. PYTHON — Estándares de código

### Type hints obligatorios
Toda función, toda variable de ciclo, todo parámetro **DEBE** tener type hint.

```python
# ✓ CORRECTO
def responder(pregunta: str, provider: str) -> str:
    return ""

# ✗ INCORRECTO
def responder(pregunta, provider):  # Faltan type hints
    return ""
```

### Pydantic v2 para schemas de entrada/salida
```python
from pydantic import BaseModel

class ChatRequest(BaseModel):
    pregunta: str
    provider: str  # gemini | openai | claude | deepseek | langchain
    historial: list[dict] = []

class ChatResponse(BaseModel):
    respuesta: str
    tokens_usados: int | None = None
```

### Try/except explícito — nunca except: pass
```python
# ✓ CORRECTO
try:
    response = model.generate_content(prompt)
except ValueError as e:
    logger.error(f"Error en modelo: {e}")
    return "Hubo un error procesando tu pregunta"

# ✗ INCORRECTO
try:
    response = model.generate_content(prompt)
except:
    pass  # Esto oculta errores críticos
```

---

## 3. MODELOS DE IA — Desacoplamiento total

### Factory Pattern obligatorio
NUNCA instancies un modelo directamente en services o domain.

```python
# ✗ PROHIBIDO (en services)
from infrastructure.gemini_adapter import GeminiAdapter
adapter = GeminiAdapter()  # Acoplamiento directo

# ✓ CORRECTO (en services)
from infrastructure.model_factory import AIModelFactory, AIProvider
adapter = AIModelFactory.create(AIProvider.GEMINI)  # Desacoplado
```

### Enum para providers
```python
class AIProvider(str, Enum):
    GEMINI = "gemini"
    OPENAI = "openai"
    CLAUDE = "claude"
    DEEPSEEK = "deepseek"
    LANGCHAIN = "langchain"
```

### System prompt SIEMPRE desde skills/*.md
NUNCA hardcodees instrucciones en el código.

```python
# ✗ PROHIBIDO
system_prompt = "Eres un asistente de Tierra de Agricultores..."

# ✓ CORRECTO
from infrastructure.context_loader import ContextLoader
loader = ContextLoader()
system_prompt = loader.load_skill()  # Lee desde skills/asistente-tienda.md
```

### Knowledge SIEMPRE desde knowledge/*.md
```python
# ✓ CORRECTO
knowledge = loader.load_knowledge()  # Lee knowledge/*.md en runtime
full_context = loader.load_full_context()  # Combina skill + knowledge
```

### max_tokens ajustado al tipo de respuesta
```python
# Respuesta corta → menos tokens
config = types.GenerationConfig(max_output_tokens=150)

# Respuesta larga → más tokens
config = types.GenerationConfig(max_output_tokens=2000)
```

---

## 4. SEGURIDAD — Sin excepciones

### NUNCA hardcodear API keys
```python
# ✗ PROHIBIDO
GOOGLE_API_KEY = "AIza..."

# ✓ CORRECTO
import os
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY no está configurada en .env")
```

### Rutas de archivos SIEMPRE relativas a la raíz
```python
# ✓ CORRECTO
path = Path("skills/asistente-tienda.md")
path = Path("knowledge/productos.md")

# ✗ INCORRECTO
path = Path("/home/user/proyecto/skills/...")  # Ruta absoluta
path = Path("../../../skills/...")  # Ruta confusa
```

### .env SIEMPRE en .gitignore
Nunca subas secrets al repositorio.

```bash
# En .gitignore
.env
.env.local
*.key
```

---

## 5. DESPLIEGUE — Vercel

### Entrypoint: main.py con `app` expuesta
```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.post("/chat")
async def chat(...):
    pass

# No uses if __name__ == "__main__" en main.py
# Vercel busca la variable `app` directamente
```

### requirements.txt siempre actualizado
```bash
pip freeze > requirements.txt
# Revisa que las versiones sean explícitas:
fastapi==0.104.1
pydantic==2.5.0
google-genai==0.3.0
```

### vercel.json configurado
```json
{
  "buildCommand": "pip install -r requirements.txt",
  "outputDirectory": ".",
  "env": {
    "GOOGLE_API_KEY": "@google_api_key"
  }
}
```

---

## 6. ESTRUCTURA DE CARPETAS — Respetarla

```
tierra-agricultores-ai/
├── .agent/skills/backend-fastapi/
│   ├── SKILL.md                    ← Instrucciones para agente editor
│   ├── references/REFERENCE.md
│   └── examples/main_example.py
├── knowledge/
│   ├── plataforma.md
│   ├── productos.md
│   ├── asociados.md
│   └── compradores.md
├── skills/
│   └── asistente-tienda.md         ← System prompt del chatbot
├── src/
│   ├── domain/
│   │   └── schemas.py              ← AIProvider enum, ChatRequest, ChatResponse
│   ├── services/
│   │   └── chat_service.py         ← Lógica de negocio
│   └── infrastructure/
│       ├── model_factory.py        ← Factory + IModelAdapter
│       ├── gemini_adapter.py
│       ├── openai_adapter.py
│       ├── claude_adapter.py
│       ├── deepseek_adapter.py
│       ├── langchain_adapter.py    ← Con LangChain + LCEL
│       └── context_loader.py       ← Lee .md en runtime
├── main.py
├── requirements.txt
├── vercel.json
├── .env.example
└── .gitignore
```

No modifiques esta estructura. Si necesitas nuevas carpetas, propón antes de crear.

---

## 7. PATRONES PEDAGOGICOS — Del curso

### Factory Pattern
Cambiar de proveedor = cambiar 1 línea en el enum. El resto del código no se toca.

```python
# En domain/schemas.py
class AIProvider(str, Enum):
    GEMINI = "gemini"
    LANGCHAIN = "langchain"

# En services/chat_service.py
adapter = AIModelFactory.create(AIProvider.GEMINI)

# Para cambiar a LangChain:
adapter = AIModelFactory.create(AIProvider.LANGCHAIN)
# El ChatService.respond() nunca se enteró del cambio
```

### Progressive Disclosure
El agente no carga todo a la vez:
- Capa 1: Metadatos (name, description del SKILL.md) — siempre en memoria
- Capa 2: Instrucciones (cuerpo del SKILL.md) — al activarse
- Capa 3: Recursos (references/, examples/) — bajo demanda explícita

### RAG simplificado
```python
# No uses vector database costosa
# Usa ContextLoader para inyectar knowledge directo en cada petición

loader = ContextLoader()
context = loader.load_full_context()  # skill + knowledge combinados
respuesta = model.generate_content(context + pregunta_usuario)
```

### LangChain — Contraste pedagógico
LangChain formaliza lo que hiciste a mano:
- ChatPromptTemplate = array de mensajes
- MessagesPlaceholder = el loop de historial
- LCEL (pipe operator |) = composición declarativa

No lo uses en el proyecto si puedes hacerlo a mano. Lo vemos en clase como contraste pedagógico.

---

## 8. SKILLS DEL PROYECTO — Dos tipos

### .agent/skills/ — Para el EDITOR
Le dice al agente (Antigravity/Cursor/Claude Code) **cómo PROGRAMAR este proyecto**.

**Dónde:** `.agent/skills/backend-fastapi/SKILL.md`

**Quién lo lee:** El agente cuando pides "crea un endpoint", "refactoriza", etc.

**Qué le dice:**
- Usa Factory para adapters
- Separa domain/services/infrastructure
- Lee knowledge/*.md en runtime
- System prompt desde skills/*.md

### skills/ — Para el BACKEND
Le dice al modelo **cómo RESPONDER a usuarios**.

**Dónde:** `skills/asistente-tienda.md`

**Quién lo lee:** El modelo en cada petición POST /chat

**Qué le dice:**
- "Sé amable, responde en español"
- "No inventes datos"
- "Consulta la base de conocimiento"

---

## 9. CHECKLIST ANTES DE CADA COMMIT

- [ ] Type hints en TODAS las funciones
- [ ] Pydantic v2 para schemas
- [ ] Try/except explícito (sin except: pass)
- [ ] Factory para modelos de IA (sin imports directos)
- [ ] System prompt desde skills/*.md
- [ ] Knowledge desde knowledge/*.md
- [ ] Sin API keys hardcodeadas
- [ ] Rutas relativas (Path("skills/..."))
- [ ] .env en .gitignore
- [ ] requirements.txt actualizado
- [ ] Estructura de carpetas respetada

---

## 10. REFLEXION PARA EL LABORATORIO

Estas rules son las lecciones del curso en código:

1. **Rules ✓** — Este archivo. Estándares que SIEMPRE aplican.
2. **Skills ✓** — `.agent/skills/backend-fastapi/SKILL.md`. Instrucciones bajo demanda.
3. **RAG ✓** — `knowledge/*.md` + `ContextLoader`. Conocimiento del dominio.
4. **LangChain ✓** — `langchain_adapter.py`. Desacoplamiento total.

El proyecto ES el curso. Cada decisión que tomes refleja lo que aprendiste.

---

**Última actualización:** Curso Herramientas para el desarrollo de aplicaciones con IA — Universidad del Magdalena, 2025

<!-- autoskills:start -->

Summary generated by `autoskills`. Check the full files inside `.claude/skills`.

## Deploy to Vercel

Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".

- `.claude/skills/deploy-to-vercel/SKILL.md`

## FastAPI Python

Expert in FastAPI Python development with best practices for APIs and async operations

- `.claude/skills/fastapi-python/SKILL.md`

## FastAPI Project Templates

Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling. Use when building new FastAPI applications or setting up backend API projects.

- `.claude/skills/fastapi-templates/SKILL.md`

## Pydantic Validation Skill

Python data validation using type hints and runtime type checking with Pydantic v2's Rust-powered core for high-performance validation in FastAPI, Django, and configuration management.

- `.claude/skills/pydantic/SKILL.md`

## Python Code Executor

Execute Python code in a safe sandboxed environment via [inference.sh](https://inference.sh). Pre-installed: NumPy, Pandas, Matplotlib, requests, BeautifulSoup, Selenium, Playwright, MoviePy, Pillow, OpenCV, trimesh, and 100+ more libraries. Use for: data processing, web scraping, image manipulat...

- `.claude/skills/python-executor/SKILL.md`

## Python Testing Patterns

Implement comprehensive testing strategies with pytest, fixtures, mocking, and test-driven development. Use when writing Python tests, setting up test suites, or implementing testing best practices.

- `.claude/skills/python-testing-patterns/SKILL.md`
- `.claude/skills/python-testing-patterns/references/advanced-patterns.md`: Advanced testing patterns including async code, monkeypatching, temporary files, conftest setup, property-based testing, database testing, CI/CD integration, and configuration.

<!-- autoskills:end -->
