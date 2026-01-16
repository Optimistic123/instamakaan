from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.inquiries.schemas import InquiryCreate, InquiryUpdate


async def create_inquiry(data: InquiryCreate):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    inquiry = data.model_dump()
    inquiry.update({
        "id": inquiry.get("id"),
        "stage": "NEW",
        "assigned_agent_id": None,
        "assigned_agent_name": None,
        "notes": [],
        "conversation_logs": [],
        "created_at": now,
        "updated_at": now,
    })

    await db.inquiries.insert_one(inquiry)
    return inquiry


async def list_inquiries(filters: dict, limit: int = 100):
    db = get_db()
    return await db.inquiries.find(filters, {"_id": 0}).sort("created_at", -1).to_list(limit)


async def get_inquiry_by_id(inquiry_id: str):
    db = get_db()
    inquiry = await db.inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


async def update_inquiry(inquiry_id: str, data: InquiryUpdate):
    db = get_db()

    inquiry = await get_inquiry_by_id(inquiry_id)

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": update_data}
    )

    return await get_inquiry_by_id(inquiry_id)


async def assign_agent(inquiry_id: str, agent_id: str, agent_name: str):
    db = get_db()

    log = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "message": f"Assigned to {agent_name}",
        "status_change": "ASSIGNED",
    }

    await db.inquiries.update_one(
        {"id": inquiry_id},
        {
            "$set": {
                "assigned_agent_id": agent_id,
                "assigned_agent_name": agent_name,
                "stage": "ASSIGNED",
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            "$push": {"conversation_logs": log}
        }
    )
