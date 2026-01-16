import uuid
import re
from datetime import datetime
from typing import Dict, List, Optional

from modules.whatsapp.service import (
    send_tenant_property_catalogue,
    send_owner_brochure_message
)
from modules.listings.service import get_listing_by_id

PHONE_REGEX = re.compile(r"^[6-9]\d{9}$")

# In-memory lead store
_leads: Dict[str, dict] = {}
_lead_notes: Dict[str, List[dict]] = {}

ALLOWED_STAGES = [
    "NEW",
    "CONTACTED",
    "VISIT_REQUESTED",
    "VISIT_SCHEDULED",
    "VISIT_DONE",
    "CLOSED_WON",
    "CLOSED_LOST",
]

def create_tenant_lead(
    listing_id: str,
    name: str,
    phone: str,
    whatsapp_opt_in: bool,
    action: str,
    source_page: str,
    utm: Optional[dict] = None,
):
    if not PHONE_REGEX.match(phone):
        return None, "Invalid phone number"

    listing = get_listing_by_id(listing_id)
    if not listing or listing.get("status") != "PUBLISHED":
        return None, "Invalid or unpublished listing"

    lead_id = str(uuid.uuid4())

    lead = {
        "id": lead_id,
        "type": "TENANT",
        "listing_id": listing_id,
        "name": name,
        "phone": phone,
        "action": action,
        "source_page": source_page,
        "utm": utm,
        "stage": "NEW",
        "whatsapp_opt_in": whatsapp_opt_in,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "next_followup_at": None,

        # WhatsApp tracking
        "whatsapp_consent_at": datetime.utcnow() if whatsapp_opt_in else None,
        "whatsapp_message_id": None,
        "whatsapp_status": None,
        "whatsapp_sent_at": None,
    }

    _leads[lead_id] = lead

    # Auto-send WhatsApp catalogue
    if whatsapp_opt_in:
        message_id = send_tenant_property_catalogue(lead, listing)
        lead["whatsapp_message_id"] = message_id
        lead["whatsapp_status"] = "sent"
        lead["whatsapp_sent_at"] = datetime.utcnow()

    return lead

def create_owner_lead(
    name: str,
    phone: str,
    city: str,
    whatsapp_opt_in: bool,
    source_page: str,
):
    if not PHONE_REGEX.match(phone):
        return None, "Invalid phone number"

    lead_id = str(uuid.uuid4())

    lead = {
        "id": lead_id,
        "type": "OWNER",
        "name": name,
        "phone": phone,
        "city": city,
        "source_page": source_page,
        "stage": "NEW",
        "whatsapp_opt_in": whatsapp_opt_in,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "next_followup_at": None,

        # WhatsApp tracking
        "whatsapp_consent_at": datetime.utcnow() if whatsapp_opt_in else None,
        "whatsapp_message_id": None,
        "whatsapp_status": None,
        "whatsapp_sent_at": None,
    }

    _leads[lead_id] = lead

    if whatsapp_opt_in:
        message_id = send_owner_brochure_message(lead)
        lead["whatsapp_message_id"] = message_id
        lead["whatsapp_status"] = "sent"
        lead["whatsapp_sent_at"] = datetime.utcnow()

    return lead

def list_leads(
    lead_type: Optional[str] = None,
    stage: Optional[str] = None,
    listing_id: Optional[str] = None,
):
    results = list(_leads.values())

    if lead_type:
        results = [l for l in results if l["type"] == lead_type.upper()]

    if stage:
        results = [l for l in results if l["stage"] == stage]

    if listing_id:
        results = [l for l in results if l.get("listing_id") == listing_id]

    return results


def update_lead(
    lead_id: str,
    stage: Optional[str] = None,
    next_followup_at: Optional[datetime] = None,
):
    lead = _leads.get(lead_id)
    if not lead:
        return None

    if stage:
        if stage not in ALLOWED_STAGES:
            return None
        lead["stage"] = stage

    if next_followup_at:
        lead["next_followup_at"] = next_followup_at

    lead["updated_at"] = datetime.utcnow()
    return lead


def add_lead_note(lead_id: str, note: str):
    if lead_id not in _leads:
        return None

    _lead_notes.setdefault(lead_id, []).append({
        "note": note,
        "created_at": datetime.utcnow()
    })

    return True
