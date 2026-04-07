"""
Factory Pattern para los adaptadores de IA.

El Factory decide qué adaptador instanciar según el proveedor.
El ChatService solo conoce IModelAdapter — nunca los adaptadores concretos.
Esto es Dependency Inversion (D de SOLID).
"""
from abc import ABC, abstractmethod
from src.domain.schemas import AIProvider, Message


class IModelAdapter(ABC):
    """Puerto abstracto — contrato que todos los adaptadores deben cumplir."""

    @abstractmethod
    def complete(
        self,
        system_prompt: str,
        user_message: str,
        history: list[Message] | None = None,
    ) -> tuple[str, int | None]:
        """
        Envía un mensaje al modelo y devuelve la respuesta.

        Args:
            system_prompt: Instrucciones + conocimiento del sistema
            user_message:  Pregunta del usuario
            history:       Historial previo de la conversación (opcional)

        Returns:
            Tupla (texto_respuesta, tokens_usados_o_None)
        """
        ...


class AIModelFactory:
    """
    Crea el adaptador correcto según el proveedor solicitado.

    Uso:
        adapter = AIModelFactory.create(AIProvider.GEMINI)
        respuesta, tokens = adapter.complete(system, mensaje)

    Para agregar un nuevo proveedor:
        1. Crear el adaptador en infrastructure/
        2. Añadirlo al dict `adapters` aquí
        ← Solo cambia este archivo, nada más.
    """

    @staticmethod
    def create(provider: AIProvider) -> IModelAdapter:
        # Imports locales para evitar cargar todas las librerías al inicio
        from src.infrastructure.gemini_adapter import GeminiAdapter
        from src.infrastructure.openai_adapter import OpenAIAdapter
        from src.infrastructure.claude_adapter import ClaudeAdapter
        from src.infrastructure.deepseek_adapter import DeepSeekAdapter
        from src.infrastructure.langchain_adapter import LangChainGeminiAdapter

        adapters: dict[AIProvider, type[IModelAdapter]] = {
            AIProvider.GEMINI:     GeminiAdapter,
            AIProvider.OPENAI:     OpenAIAdapter,
            AIProvider.CLAUDE:     ClaudeAdapter,
            AIProvider.DEEPSEEK:   DeepSeekAdapter,
            AIProvider.LANGCHAIN:  LangChainGeminiAdapter,   # Gemini via LangChain
        }

        if provider not in adapters:
            raise ValueError(f"Proveedor no soportado: {provider}")

        return adapters[provider]()
