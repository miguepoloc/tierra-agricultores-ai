"""Adaptador para OpenAI GPT."""
import os
from openai import OpenAI
from src.domain.schemas import Message
from src.infrastructure.model_factory import IModelAdapter


class OpenAIAdapter(IModelAdapter):
    """Adaptador para OpenAI."""

    MODEL = "gpt-4o-mini"

    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY no está configurada.")
        self._client = OpenAI(api_key=api_key)

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
