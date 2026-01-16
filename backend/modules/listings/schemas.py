from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class ListingStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class ListingType(str, Enum):
    RENT = "RENT"
    PRE_OCCUPIED = "PRE_OCCUPIED"
    BUY = "BUY"


class MediaItem(BaseModel):
    url: str
    order: int
    is_cover: bool = False


class ListingCreate(BaseModel):
    title: Optional[str] = None
    listing_type: Optional[ListingType] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    bhk: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    area_sqft: Optional[int] = None

    rent_monthly: Optional[int] = None
    deposit: Optional[int] = None
    sale_price: Optional[int] = None

    lat: Optional[float] = None
    lng: Optional[float] = None

    media: List[MediaItem] = []


class ListingResponse(ListingCreate):
    id: str
    status: ListingStatus
    cover_image_url: Optional[str] = None
