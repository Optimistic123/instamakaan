from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class OwnerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    bank_details: Optional[str] = None
    notes: Optional[str] = None


class OwnerCreate(OwnerBase):
    pass


class OwnerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bank_details: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class Owner(OwnerBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "active"  # active / inactive
    created_at: datetime
    updated_at: datetime

