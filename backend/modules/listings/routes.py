from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional

from modules.listings.schemas import ListingCreate, ListingResponse
from modules.listings import service

try:
    from core.rbac import require_role
except ImportError:
    def require_role(role: str):
        def _noop():
            return None
        return _noop


router = APIRouter(prefix="/listings", tags=["Listings"])

@router.post(
    "/admin/listings",
    response_model=ListingResponse,
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_create_listing():
    return service.create_listing()


@router.patch(
    "/admin/listings/{listing_id}",
    response_model=ListingResponse,
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_update_listing(listing_id: str, payload: ListingCreate):
    listing = service.update_listing(
        listing_id,
        payload.dict(exclude_unset=True)
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.post(
    "/admin/listings/{listing_id}/publish",
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_publish_listing(listing_id: str):
    listing, error = service.publish_listing(listing_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {"published": True}


@router.post(
    "/admin/listings/{listing_id}/unpublish",
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_unpublish_listing(listing_id: str):
    listing = service.unpublish_listing(listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"unpublished": True}


@router.get("", response_model=List[ListingResponse])
def get_listings(
    type: Optional[str] = Query(None),
    city: Optional[str] = None,
    bhk: Optional[int] = None,
    minPrice: Optional[int] = None,
    maxPrice: Optional[int] = None,
    sort: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
):
    return service.search_public_listings(
        listing_type=type,
        city=city,
        bhk=bhk,
        min_price=minPrice,
        max_price=maxPrice,
        sort=sort,
        page=page,
        limit=limit,
    )


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing_detail(listing_id: str):
    listing = service.get_listing_by_id(listing_id)
    if not listing or listing["status"] != "PUBLISHED":
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing
