from __future__ import annotations

import logging
from dataclasses import dataclass

from groq import Groq

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class GroqResponse:
    text: str


class GroqClient:
    def __init__(self) -> None:
        self._client = None
        if settings.groq_api_key:
            self._client = Groq(api_key=settings.groq_api_key)
        else:
            logger.warning("GROQ_API_KEY missing; Groq client disabled")

    def generate(self, prompt: str) -> GroqResponse:
        if not self._client:
            return GroqResponse(text="")
        response = self._client.chat.completions.create(
            model=settings.groq_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=settings.groq_temperature,
            max_tokens=settings.groq_max_tokens,
        )
        text = response.choices[0].message.content or ""
        if text.strip():
            return GroqResponse(text=text.strip())

        for model_name in _fallback_models(settings.groq_fallback_models):
            logger.warning("Groq empty response; retrying with %s", model_name)
            response = self._client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=settings.groq_temperature,
                max_tokens=settings.groq_max_tokens,
            )
            text = response.choices[0].message.content or ""
            if text.strip():
                return GroqResponse(text=text.strip())

        return GroqResponse(text="")


def _fallback_models(raw: str) -> list[str]:
    return [item.strip() for item in raw.split(",") if item.strip()]
