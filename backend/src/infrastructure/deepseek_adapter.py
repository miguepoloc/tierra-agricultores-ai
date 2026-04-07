"""
Adaptador para DeepSeek.

Usa la misma librería de OpenAI — solo cambia base_url y api_key.
Este es el ejemplo perfecto de Dependency Inversion:
el código es idéntico a OpenAIAdapter excepto por 2 líneas.
"""
import os
from openai import OpenAI  # misma librería que OpenAI
from src.domain.schemas import Message
from src.infrastructure.model_factory import IModelAdapter


class DeepSeekAdapter(IModelAdapter):
    """Adaptador para DeepSeek — compatible con la API de OpenAI."""

    MODEL = "deepseek-chat"

    def __init__(self) -> None:
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY no está configurada.")
        self._client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com",  # ← única diferencia vs OpenAI
        )

    def complete(
        self,
        system_prompt: str,
        user_message: str,
        history: list[Message] | None = None,
    ) -> tuple[str, int | None]:
        messages: list[dict] = [{"role": "system", "content": system_prompt}]

        if history:
            for msg in history:
                messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": user_message})

        response = self._client.chat.completions.create(
            model=self.MODEL,
            messages=messages,
            max_tokens=800,
            temperature=0.3,
        )
        tokens = response.usage.total_tokens if response.usage else None
        return response.choices[0].message.content or "", tokens
