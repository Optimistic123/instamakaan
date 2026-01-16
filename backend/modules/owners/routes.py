from fastapi import APIRouter, Depends
from typing import Optional, List

from modules.owners.schemas import Owner, OwnerCreate, OwnerUpdate
from modules.owners.service import (
    create_owner,
    get_owners,
    get_owner_by_id,
    update_owner,
    delete_owner,
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
    prefix="/owners",
    tags=["Owners"]
)


@router.post("/", response_model=Owner)
async def create(
    data: OwnerCreate,
    user=Depends(require_role(["admin"]))
):
    return await create_owner(data)


@router.get("/", response_model=List[Owner])
async def list_all(
    status: Optional[str] = None,
    limit: int = 100,
    user=Depends(require_role(["admin"]))
):
    filters = {}
    if status:
        filters["status"] = status
    return await get_owners(filters, limit)


@router.get("/{owner_id}", response_model=Owner)
async def get_one(
    owner_id: str,
    user=Depends(require_role(["admin"]))
):
    return await get_owner_by_id(owner_id)


@router.put("/{owner_id}", response_model=Owner)
async def update(
    owner_id: str,
    data: OwnerUpdate,
    user=Depends(require_role(["admin"]))
):
    return await update_owner(owner_id, data)


@router.delete("/{owner_id}")
async def delete(
    owner_id: str,
    user=Depends(require_role(["admin"]))
):
    await delete_owner(owner_id)
    return {"message": "Owner deleted successfully"}


@router.get("/ping")
async def ping():
    return {"message": "Owners working"}
