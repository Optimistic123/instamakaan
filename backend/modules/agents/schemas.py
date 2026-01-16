from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class AgentBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    designation: Optional[str] = "Field Agent"
    notes: Optional[str] = None


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class Agent(AgentBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "active"
    total_inquiries_handled: int = 0
    created_at: datetime
    updated_at: datetime
