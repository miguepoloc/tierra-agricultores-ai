# Copilot Instructions — Tierra de Agricultores AI

Instrucciones para GitHub Copilot en el proyecto tierra-agricultores-ai.  
Curso: Herramientas para el desarrollo de aplicaciones con IA — Universidad del Magdalena

---

## ARQUITECTURA

**Hexagonal simplificada:**
- `src/domain/` — Schemas, enums. Sin frameworks.
- `src/services/` — Lógica de negocio. Sin Gemini directo.
- `src/infrastructure/` — Adaptadores, Factory, ContextLoader.

**Flujo:** domain ← services ← infrastructure  
**NUNCA al revés.**

---

## PYTHON — Estándares

### Type hints obligatorios
```python
def chat(pregunta: str, provider: str) -> dict:
    pass
```

### Pydantic v2
```python
from pydantic import BaseModel

class ChatRequest(BaseModel):
    pregunta: str
    provider: str
    historial: list[dict] = []
```

### Try/except explícito
```python
try:
    response = model.generate_content(prompt)
except ValueError as e:
    logger.error(f"Error: {e}")
```

---

## MODELOS DE IA — Factory Pattern

### NUNCA instanciar directo
```python
# ✓ Correcto
adapter = AIModelFactory.create(AIProvider.GEMINI)

# ✗ Incorrecto
adapter = GeminiAdapter()
```

### Enum AIProvider
```python
class AIProvider(str, Enum):
    GEMINI = "gemini"
    OPENAI = "openai"
    CLAUDE = "claude"
    DEEPSEEK = "deepseek"
    LANGCHAIN = "langchain"
```

---

## CONOCIMIENTO — Archivos .md

### System prompt desde skills/
```python
loader = ContextLoader()
system_prompt = loader.load_skill()  # skills/asistente-tienda.md
```

### Knowledge desde knowledge/
```python
knowledge = loader.load_knowledge()  # Todos los .md
full_context = loader.load_full_context()  # Combinado
```

---

## SEGURIDAD

### Sin API keys hardcodeadas
```python
import os
api_key = os.getenv("GOOGLE_API_KEY")
```

### Rutas relativas
```python
from pathlib import Path
path = Path("skills/asistente-tienda.md")
```

---

## DESPLIEGUE — Vercel

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.post("/chat")
async def chat(...):
    pass
```

---

## ESTRUCTURA

```
tierra-agricultores-ai/
├── .agent/skills/backend-fastapi/
├── knowledge/
├── skills/
├── src/
│   ├── domain/
│   ├── services/
│   └── infrastructure/
├── main.py
├── requirements.txt
└── .env
```

---

## CHECKLIST

- [ ] Type hints en todo
- [ ] Pydantic v2
- [ ] Try/except explícito
- [ ] Factory para IA
- [ ] System prompt desde .md
- [ ] Knowledge desde .md
- [ ] Sin hardcoded keys
- [ ] Rutas relativas
- [ ] .env en .gitignore
- [ ] requirements.txt actualizado