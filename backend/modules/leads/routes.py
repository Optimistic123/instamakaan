from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional

from modules.leads.schemas import (
    TenantLeadCreate,
    OwnerLeadCreate,
    LeadResponse,
    AdminLeadListItem,
    LeadStageUpdate,
    LeadNoteCreate
)
from modules.leads import service
try:
    from core.rbac import require_role
except ImportError:
    def require_role(role: str):
        def _noop():
            return None
        return _noop


router = APIRouter(prefix="/leads", tags=["Leads"])

@router.post("/tenant", response_model=LeadResponse)
def create_tenant_lead(payload: TenantLeadCreate):
    lead, error = service.create_tenant_lead(payload.dict())
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {"lead_id": lead["id"], "created": True}


@router.post("/owner", response_model=LeadResponse)
def create_owner_lead(payload: OwnerLeadCreate):
    lead, error = service.create_owner_lead(payload.dict())
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {
        "lead_id": lead["id"],
        "created": True,
        "brochure_url": "https://instamakaan.com/brochure.pdf"
    }

@router.get(
    "/admin/leads",
    response_model=List[AdminLeadListItem],
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_get_leads(
    type: Optional[str] = Query(None),
    stage: Optional[str] = Query(None),
    listing_id: Optional[str] = Query(None)
):
    return service.get_all_leads(type, stage, listing_id)


@router.patch(
    "/admin/leads/{lead_id}",
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_update_lead_stage(lead_id: str, payload: LeadStageUpdate):
    lead = service.update_lead_stage(
        lead_id,
        payload.stage,
        payload.next_followup_at
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"updated": True}


@router.post(
    "/admin/leads/{lead_id}/notes",
    dependencies=[Depends(require_role("ADMIN"))]
)
def admin_add_lead_note(lead_id: str, payload: LeadNoteCreate):
    success = service.add_lead_note(lead_id, payload.note)
    if not success:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"note_added": True}
