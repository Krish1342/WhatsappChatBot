import logging

from twilio.rest import Client

from app.core.config import settings

logger = logging.getLogger(__name__)


class WhatsAppClient:
    def __init__(self) -> None:
        self._client = None
        if settings.twilio_account_sid and settings.twilio_auth_token:
            self._client = Client(
                settings.twilio_account_sid, settings.twilio_auth_token
            )
        else:
            logger.warning("Twilio credentials missing; WhatsApp client disabled")

    def send_message(self, to_number: str, body: str) -> str | None:
        if not self._client:
            return None
        message = self._client.messages.create(
            to=to_number,
            from_=settings.twilio_whatsapp_number,
            body=body,
        )
        return message.sid
