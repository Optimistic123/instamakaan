from fastapi import APIRouter, Request
from datetime import datetime

from modules.leads.service import _leads

router = APIRouter(
    prefix="/integrations/whatsapp",
    tags=["WhatsApp"]
)


@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    Receives WhatsApp delivery/read callbacks.
    Expected payload (example):
    {
        "message_id": "TENANT_xxx",
        "status": "delivered" | "read"
    }
    """

    payload = await request.json()

    message_id = payload.get("message_id")
    status = payload.get("status")

    if not message_id or not status:
        return {"ok": True}

    for lead in _leads.values():
        if lead.get("whatsapp_message_id") == message_id:
            lead["whatsapp_status"] = status
            lead["updated_at"] = datetime.utcnow()
            break

    return {"ok": True}
