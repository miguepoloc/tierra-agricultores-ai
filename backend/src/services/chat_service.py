"""
ChatService — Lógica de negocio del asistente.

Este servicio no sabe qué modelo de IA se usa.
Solo conoce el contrato IModelAdapter (Dependency Inversion).
El Factory decide qué adaptador instanciar.
"""
from src.domain.schemas import ChatRequest, ChatResponse
from src.infrastructure.model_factory import AIModelFactory


class ChatService:
    """
    Orquesta la respuesta del asistente:
    1. Crea el adaptador correcto via Factory
    2. Llama al modelo con el contexto cargado
    3. Devuelve la respuesta estructurada
    """

    def __init__(self, context: str) -> None:
        self._context = context

    def respond(self, request: ChatRequest) -> ChatResponse:
        """
        Genera una respuesta para la pregunta del usuario.

        Args:
            request: ChatRequest con pregunta, provider e historial opcional

        Returns:
            ChatResponse con la respuesta y metadatos

        Raises:
            RuntimeError: Si el modelo falla
        """
        adapter = AIModelFactory.create(request.provider)

        try:
            respuesta, tokens = adapter.complete(
                system_prompt=self._context,
                user_message=request.pregunta,
                history=request.historial,
            )
        except Exception as e:
            raise RuntimeError(
                f"Error al consultar {request.provider.value}: {e}"
            ) from e

        return ChatResponse(
            respuesta=respuesta,
            provider=request.provider,
            tokens_usados=tokens,
        )
