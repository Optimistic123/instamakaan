import logging

logger = logging.getLogger(__name__)

# Placeholder config (real creds will be added later)
WHATSAPP_PROVIDER = "MOCK"  # AiSensy / Interakt later


def send_whatsapp_message(payload: dict) -> dict:
    """
    Generic WhatsApp send method.
    Currently mocked to avoid external dependency.
    """
    try:
        # Mock send (no external API call)
        logger.info("WhatsApp message sent successfully")
        logger.info("Payload: %s", payload)

        return {
            "success": True,
            "message_id": payload.get("message_id")
        }

    except Exception as e:
        logger.error("WhatsApp send failed: %s", str(e))
        return {
            "success": False,
            "error": str(e)
        }
