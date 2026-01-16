from datetime import datetime, timezone
from fastapi import HTTPException
from core.database import get_db
from modules.owners.schemas import OwnerCreate, OwnerUpdate


async def create_owner(data: OwnerCreate):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    owner = data.model_dump()
    owner.update({
        "id": owner.get("id"),
        "status": "active",
        "created_at": now,
        "updated_at": now,
    })

    await db.owners.insert_one(owner)
    return owner


async def get_owners(filters: dict, limit: int = 100):
    db = get_db()
    return await db.owners.find(filters, {"_id": 0}).to_list(limit)


async def get_owner_by_id(owner_id: str):
    db = get_db()
    owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    return owner


async def update_owner(owner_id: str, data: OwnerUpdate):
    db = get_db()

    existing = await db.owners.find_one({"id": owner_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Owner not found")

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.owners.update_one(
        {"id": owner_id},
        {"$set": update_data}
    )

    return await get_owner_by_id(owner_id)


async def delete_owner(owner_id: str):
    db = get_db()
    result = await db.owners.delete_one({"id": owner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Owner not found")
