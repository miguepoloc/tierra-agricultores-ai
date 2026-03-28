"""Adaptador para Google Gemini — modelo gratuito del curso."""
import os
import time
from google import genai
from google.genai import types
from src.domain.schemas import Message
from src.infrastructure.model_factory import IModelAdapter


class GeminiAdapter(IModelAdapter):
    """Adaptador para Google Gemini (google-genai)."""

    MODEL = "models/gemini-2.5-flash"
    MAX_RETRIES = 3
    RETRY_DELAY = 30  # segundos

    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY no está configurada. "
                "Copia .env.example como .env y añade tu clave de aistudio.google.com"
            )
        self._client = genai.Client(api_key=api_key)

    def _should_retry(self, error: Exception) -> bool:
        """Determina si se debe reintentar basado en el tipo de error."""
        error_str = str(error)
        return "429" in error_str or "RESOURCE_EXHAUSTED" in error_str

    def complete(
        self,
        system_prompt: str,
        user_message: str,
        history: list[Message] | None = None,
    ) -> tuple[str, int | None]:
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            max_output_tokens=800,
            temperature=0.3,
        )

        contents = self._build_contents(history, user_message)

        for attempt in range(self.MAX_RETRIES):
            try:
                response = self._client.models.generate_content(
                    model=self.MODEL,
                    contents=contents,
                    config=config,
                )
                return response.text or "", None
            except Exception as e:
                if self._should_retry(e) and attempt < self.MAX_RETRIES - 1:
                    wait_time = self.RETRY_DELAY * (2 ** attempt)
                    print(f"⏳ Cuota excedida. Reintentando en {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    raise

        raise RuntimeError("Error desconocido en Gemini")

    def _build_contents(self, history: list[Message] | None, user_message: str) -> list[types.Content]:
        """Construye la lista de contenidos para la API."""
        contents: list[types.Content] = []

        if history:
            for msg in history:
                role = "user" if msg.role == "user" else "model"
                contents.append(types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg.content)],
                ))

        contents.append(types.Content(
            role="user",
            parts=[types.Part.from_text(text=user_message)],
        ))

        return contents
