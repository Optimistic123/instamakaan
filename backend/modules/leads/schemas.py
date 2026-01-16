from pydantic import BaseModel
from typing import Optional, Dict, List
from enum import Enum
from datetime import datetime


class LeadType(str, Enum):
    TENANT = "TENANT"
    OWNER = "OWNER"


class LeadStage(str, Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    VISIT_REQUESTED = "VISIT_REQUESTED"
    VISIT_SCHEDULED = "VISIT_SCHEDULED"
    VISIT_DONE = "VISIT_DONE"
    CLOSED_WON = "CLOSED_WON"
    CLOSED_LOST = "CLOSED_LOST"


class TenantLeadCreate(BaseModel):
    listing_id: str
    name: str
    phone: str
    whatsapp_opt_in: bool = False
    action: Optional[str] = "SCHEDULE_VISIT"
    source_page: Optional[str] = None
    utm: Optional[Dict] = None


class OwnerLeadCreate(BaseModel):
    name: str
    phone: str
    city: Optional[str] = None
    whatsapp_opt_in: bool = False
    source_page: Optional[str] = None


class LeadResponse(BaseModel):
    lead_id: str
    created: bool
    brochure_url: Optional[str] = None


# ---------- ADMIN SCHEMAS ----------

class AdminLeadListItem(BaseModel):
    id: str
    name: str
    phone: str
    type: LeadType
    listing_id: Optional[str] = None
    stage: LeadStage
    created_at: datetime
    updated_at: Optional[datetime] = None


class LeadStageUpdate(BaseModel):
    stage: LeadStage
    next_followup_at: Optional[datetime] = None


class LeadNoteCreate(BaseModel):
    note: str
