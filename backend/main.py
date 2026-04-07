"""
Tierra de Agricultores — Asistente IA
Backend FastAPI con RAG simplificado y Factory Pattern.

Proveedores disponibles: gemini | openai | claude | deepseek
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.domain.schemas import ChatRequest, ChatResponse
from src.services.chat_service import ChatService
from src.infrastructure.context_loader import ContextLoader

load_dotenv()

app = FastAPI(
    title="Asistente IA — Tierra de Agricultores",
    version="1.0.0",
    description=(
        "API que responde preguntas sobre la plataforma Tierra de Agricultores "
        "usando modelos de IA con RAG simplificado.\n\n"
        "**Proveedores disponibles:** gemini · openai · claude · deepseek"
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Inyección de dependencias ────────────────────────────────────────────────
# Único lugar donde se instancian las dependencias.
# El ContextLoader lee los archivos .md al arrancar cada request.
# En producción esto se podría cachear al inicio del servidor.

def get_chat_service() -> ChatService:
    """Crea el ChatService con el contexto completo cargado desde archivos."""
    context = ContextLoader().load_full_context()
    return ChatService(context=context)


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def health() -> dict:
    """Verifica que el servidor esté funcionando."""
    return {
        "status": "ok",
        "servicio": "Asistente IA — Tierra de Agricultores",
        "version": "1.0.0",
    }


@app.post(
    "/chat",
    response_model=ChatResponse,
    tags=["Chat"],
    summary="Pregunta simple sin historial",
    description=(
        "Envía una pregunta y recibe una respuesta del asistente. "
        "Cada petición es independiente — el modelo no recuerda preguntas anteriores."
    ),
)
async def chat(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    try:
        return service.respond(request)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post(
    "/chat/con-historial",
    response_model=ChatResponse,
    tags=["Chat"],
    summary="Pregunta con historial de conversación",
    description=(
        "Envía una pregunta junto con el historial previo de la conversación. "
        "El cliente debe mantener y enviar el historial en cada petición. "
        "Esto demuestra gestión de contexto manual (sin base de datos)."
    ),
)
async def chat_con_historial(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    try:
        return service.respond(request)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
