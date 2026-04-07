"""Modelos de datos del dominio — entrada y salida de la API."""
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional


class AIProvider(str, Enum):
    GEMINI = "gemini"
    OPENAI = "openai"
    CLAUDE = "claude"
    DEEPSEEK = "deepseek"
    LANGCHAIN = "langchain"   # Gemini via LangChain — para comparar


class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    pregunta: str = Field(..., min_length=1, max_length=2000,
                          description="Pregunta del usuario")
    provider: AIProvider = Field(
        default=AIProvider.GEMINI,
        description="Proveedor de IA a usar"
    )
    historial: Optional[list[Message]] = Field(
        default=None,
        description="Historial de mensajes previos para contexto"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "pregunta": "¿Qué frutas tienen disponibles?",
                    "provider": "gemini"
                },
                {
                    "pregunta": "¿Y cuánto cuesta el pomelo?",
                    "provider": "gemini",
                    "historial": [
                        {"role": "user", "content": "¿Qué frutas tienen?"},
                        {"role": "assistant", "content": "Tenemos pomelo a $2.000, guineo manzano a $1.200 y papaya de temporada."}
                    ]
                }
            ]
        }
    }


class ChatResponse(BaseModel):
    respuesta: str = Field(..., description="Respuesta del modelo de IA")
    provider: AIProvider = Field(..., description="Proveedor que respondió")
    tokens_usados: Optional[int] = Field(
        default=None,
        description="Tokens consumidos (disponible en OpenAI, Claude y DeepSeek)"
    )
