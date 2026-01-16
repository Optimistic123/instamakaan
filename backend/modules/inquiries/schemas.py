from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid


class InquiryBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    listing_id: Optional[str] = None
    whatsapp_opt_in: bool = False
    inquiry_type: str = "TENANT"  # TENANT / OWNER
    source_page: Optional[str] = None


class InquiryCreate(InquiryBase):
    pass


class InquiryUpdate(BaseModel):
    stage: Optional[str] = None
    assigned_agent_id: Optional[str] = None
    next_followup_at: Optional[str] = None


class Inquiry(InquiryBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    stage: str = "NEW"
    assigned_agent_id: Optional[str] = None
    assigned_agent_name: Optional[str] = None
    notes: List[str] = []
    conversation_logs: List[dict] = []
    created_at: datetime
    updated_at: datetime
