import logging

from fastapi import HTTPException, Request
from twilio.request_validator import RequestValidator

from app.core.config import settings

logger = logging.getLogger(__name__)


def validate_twilio_request(request: Request, form_data: dict) -> None:
    if not settings.twilio_validate_webhook:
        return
    signature = request.headers.get("X-Twilio-Signature", "")
    validator = RequestValidator(settings.twilio_auth_token)
    url = str(request.url)
    if not validator.validate(url, form_data, signature):
        logger.warning("Invalid Twilio signature for webhook request")
        raise HTTPException(status_code=403, detail="Invalid webhook signature")
