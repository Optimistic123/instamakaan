from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid


class PropertyBase(BaseModel):
    title: str
    property_type: str  
    location: str
    sector: Optional[str] = None
    price: str
    price_label: str
    description: str
    beds: int
    baths: int
    area: str
    features: List[str] = []
    amenities: List[str] = []
    furnishing: Optional[str] = None
    preferred_tenant: Optional[str] = None
    gender_preference: Optional[str] = None
    is_managed: bool = False
    status: str = "active"
    deposit: Optional[str] = None
    brokerage: Optional[str] = None
    owner_id: Optional[str] = None
    monthly_rent_amount: Optional[float] = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    sector: Optional[str] = None
    price: Optional[str] = None
    price_label: Optional[str] = None
    description: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    area: Optional[str] = None
    features: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    furnishing: Optional[str] = None
    preferred_tenant: Optional[str] = None
    gender_preference: Optional[str] = None
    is_managed: Optional[bool] = None
    status: Optional[str] = None
    deposit: Optional[str] = None
    brokerage: Optional[str] = None
    images: Optional[List[str]] = None
    owner_id: Optional[str] = None
    monthly_rent_amount: Optional[float] = None


class Property(PropertyBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    images: List[str] = []
    created_at: datetime
    updated_at: datetime
