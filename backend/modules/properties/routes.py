from fastapi import APIRouter, Depends
from typing import Optional, List
from datetime import datetime, timezone

from modules.properties.schemas import Property, PropertyCreate, PropertyUpdate
from modules.properties.service import (
    create_property,
    get_properties,
    get_property_by_id,
    update_property,
    delete_property,
)

try:
    # current working RBAC
    from core.security import require_role
except ImportError:
    try:
        # future RBAC 
        from core.rbac import require_role
    except ImportError:
        def require_role(roles):
            async def _noop():
                return None
            return _noop


router = APIRouter(
    prefix="/properties",
    tags=["Properties"]
)


@router.post("/", response_model=Property)
async def create(
    data: PropertyCreate,
    user=Depends(require_role(["admin"]))
):
    return await create_property(data)


@router.get("/", response_model=List[Property])
async def list_all(
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    owner_id: Optional[str] = None,
    limit: int = 100
):
    filters = {}
    if property_type:
        filters["property_type"] = property_type
    if status:
        filters["status"] = status
    if owner_id:
        filters["owner_id"] = owner_id

    return await get_properties(filters, limit)


@router.get("/{property_id}", response_model=Property)
async def get_one(property_id: str):
    return await get_property_by_id(property_id)


@router.put("/{property_id}", response_model=Property)
async def update(
    property_id: str,
    data: PropertyUpdate,
    user=Depends(require_role(["admin"]))
):
    return await update_property(property_id, data)


@router.delete("/{property_id}")
async def delete(
    property_id: str,
    user=Depends(require_role(["admin"]))
):
    await delete_property(property_id)
    return {"message": "Property deleted successfully"}


@router.post("/{property_id}/images")
async def add_images(
    property_id: str,
    images: List[str],
    user=Depends(require_role(["admin"]))
):
    prop = await get_property_by_id(property_id)
    updated = prop.get("images", []) + images

    from core.database import get_db
    db = get_db()

    await db.properties.update_one(
        {"id": property_id},
        {"$set": {
            "images": updated,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )

    return {"message": "Images added", "images": updated}


@router.get("/ping")
async def ping():
    return {"message": "Properties working"}
