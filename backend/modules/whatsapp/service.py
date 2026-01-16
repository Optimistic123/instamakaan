import uuid
from datetime import datetime
from typing import Dict

# This file intentionally keeps provider logic abstract
# so AiSensy / Interakt can be plugged later

def _generate_message_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4()}"

def send_tenant_property_catalogue(lead: Dict, listing: Dict) -> str:
    """
    Sends WhatsApp property catalogue to tenant.
    Returns whatsapp_message_id.
    """

    message_payload = {
        "to": lead["phone"],
        "template": "tenant_property_catalogue",
        "data": {
            "title": listing.get("title"),
            "location": f"{listing.get('locality')}, {listing.get('city')}",
            "price": listing.get("rent_monthly") or listing.get("sale_price"),
            "listing_url": f"https://instamakaan.com/listings/{listing.get('id')}",
        }
    }

    # Call AiSensy / Interakt API here
    
    whatsapp_message_id = _generate_message_id("TENANT")

    # Log/debug only 
    print("WhatsApp sent (tenant):", message_payload)

    return whatsapp_message_id

def send_owner_brochure_message(lead: Dict) -> str:
    """
    Sends WhatsApp brochure message to owner.
    Returns whatsapp_message_id.
    """

    message_payload = {
        "to": lead["phone"],
        "template": "owner_brochure",
        "data": {
            "message": "Thanks for downloading the InstaMakaan owner brochure.",
            "brochure_url": "https://instamakaan.com/static/owner-brochure.pdf",
            "cta": "Reply with your property location & BHK",
        }
    }

    # 🔹 PLACEHOLDER: Call WhatsApp provider API

    whatsapp_message_id = _generate_message_id("OWNER")

    print("WhatsApp sent (owner):", message_payload)

    return whatsapp_message_id
