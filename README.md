# Tierra de Agricultores — Asistente IA

Backend FastAPI con RAG simplificado y Factory Pattern para múltiples modelos de IA.

Construido en el curso **Herramientas para el desarrollo de aplicaciones con IA**  
Universidad del Magdalena — Ingeniería de Sistemas

---

## Arquitectura

```
HTTP Request → FastAPI (main.py)
    → ChatService (lógica de negocio)
        → AIModelFactory (Factory Pattern)
            → GeminiAdapter / OpenAIAdapter / ClaudeAdapter / DeepSeekAdapter
                ← System Prompt = skills/asistente-tienda.md + knowledge/*.md
```

## Configuración rápida

```bash
# 1. Clonar y entrar al proyecto
git clone <url>
cd tierra-agricultores-ai

# 2. Entorno virtual
python -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar claves
cp .env.example .env
# Editar .env con tu GEMINI_API_KEY (gratuita)

# 5. Correr
uvicorn main:app --reload
```

Documentación interactiva: http://localhost:8000/docs

## Endpoints

| Método | Ruta                   | Descripción                              |
|--------|------------------------|------------------------------------------|
| GET    | `/`                    | Health check                             |
| POST   | `/chat`                | Pregunta simple sin historial            |
| POST   | `/chat/con-historial`  | Pregunta con historial de conversación   |

## Cambiar de proveedor de IA

El proveedor se selecciona en el body del request — sin cambiar código:

```json
{ "pregunta": "¿Qué frutas tienen?", "provider": "gemini" }
{ "pregunta": "¿Qué frutas tienen?", "provider": "openai" }
{ "pregunta": "¿Qué frutas tienen?", "provider": "claude" }
{ "pregunta": "¿Qué frutas tienen?", "provider": "deepseek" }
```

## Actualizar el conocimiento

Editar los archivos en `knowledge/` — sin reescribir código:

- `knowledge/plataforma.md` — información general
- `knowledge/productos.md` — catálogo y precios
- `knowledge/asociados.md` — cómo ser agricultor asociado
- `knowledge/compradores.md` — cómo comprar

## Despliegue en Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Agregar las variables de entorno en el dashboard de Vercel.
