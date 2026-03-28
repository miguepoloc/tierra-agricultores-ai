"""Adaptador para Anthropic Claude."""
import os
import anthropic
from src.domain.schemas import Message
from src.infrastructure.model_factory import IModelAdapter


class ClaudeAdapter(IModelAdapter):
    """Adaptador para Claude (Anthropic)."""

    MODEL = "claude-3-haiku-20240307"

    def __init__(self) -> None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY no está configurada.")
        self._client = anthropic.Anthropic(api_key=api_key)

    def complete(
        self,
        system_prompt: str,
        user_message: str,
        history: list[Message] | None = None,
    ) -> tuple[str, int | None]:
        messages: list[dict] = []

        if history:
            for msg in history:
                messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": user_message})

        response = self._client.messages.create(
            model=self.MODEL,
            system=system_prompt,
            messages=messages,
            max_tokens=800,
        )
        tokens = response.usage.input_tokens + response.usage.output_tokens
        return response.content[0].text, tokens
