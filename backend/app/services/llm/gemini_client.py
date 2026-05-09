from __future__ import annotations

import logging
from dataclasses import dataclass

import google.generativeai as genai
from google.api_core.exceptions import NotFound

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class GeminiResponse:
    text: str


class GeminiClient:
    def __init__(self) -> None:
        self._configured = False
        self._model = None

    def generate(self, prompt: str) -> GeminiResponse:
        self._configure()
        if self._model is None:
            logger.warning("Gemini model unavailable; returning empty response")
            return GeminiResponse(text="")
        try:
            response = self._model.generate_content(prompt)
            text = response.text or ""
            return GeminiResponse(text=text.strip())
        except NotFound:
            for model_name in _fallback_models(settings.gemini_fallback_models):
                logger.warning("Gemini model not found; retrying with %s", model_name)
                model = genai.GenerativeModel(
                    model_name,
                    generation_config={
                        "temperature": settings.gemini_temperature,
                        "max_output_tokens": settings.gemini_max_output_tokens,
                    },
                )
                response = model.generate_content(prompt)
                text = response.text or ""
                if text.strip():
                    return GeminiResponse(text=text.strip())
            raise

    def _configure(self) -> None:
        if self._configured:
            return
        if not settings.gemini_api_key:
            logger.warning("GEMINI_API_KEY missing; Gemini client disabled")
            self._configured = True
            return
        genai.configure(api_key=settings.gemini_api_key)
        self._model = genai.GenerativeModel(
            settings.gemini_model,
            generation_config={
                "temperature": settings.gemini_temperature,
                "max_output_tokens": settings.gemini_max_output_tokens,
            },
        )
        self._configured = True


def _fallback_models(raw: str) -> list[str]:
    return [item.strip() for item in raw.split(",") if item.strip()]
