from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.properties.schemas import PropertyCreate, PropertyUpdate


async def create_property(data: PropertyCreate):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    prop = data.model_dump()
    prop.update({
        "id": prop.get("id"),
        "images": [],
        "created_at": now,
        "updated_at": now,
    })

    await db.properties.insert_one(prop)
    return prop


async def get_properties(filters: dict, limit: int = 100):
    db = get_db()
    return await db.properties.find(filters, {"_id": 0}).to_list(limit)


async def get_property_by_id(property_id: str):
    db = get_db()
    prop = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


async def update_property(property_id: str, data: PropertyUpdate):
    db = get_db()

    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.properties.update_one(
        {"id": property_id},
        {"$set": update_data}
    )

    return await get_property_by_id(property_id)


async def delete_property(property_id: str):
    db = get_db()
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
