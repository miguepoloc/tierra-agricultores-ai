"""Adaptador para Google Gemini — modelo gratuito del curso."""
import os
from google import genai
from google.genai import types
from src.domain.schemas import Message
from src.infrastructure.model_factory import IModelAdapter


class GeminiAdapter(IModelAdapter):
    """Adaptador para Google Gemini (google-genai)."""

    MODEL = "models/gemini-2.0-flash"

    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY no está configurada. "
                "Copia .env.example como .env y añade tu clave de aistudio.google.com"
            )
        self._client = genai.Client(api_key=api_key)

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

        response = self._client.models.generate_content(
            model=self.MODEL,
            contents=contents,
            config=config,
        )

        return response.text or "", None
