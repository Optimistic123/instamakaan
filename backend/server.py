from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'instamakaan')]

# Create the main app without a prefix
app = FastAPI(title="InstaMakaan API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# ============== MODELS ==============

# Status Check Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Owner Models
class OwnerBase(BaseModel):
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    bank_details: Optional[str] = None
    notes: Optional[str] = None

class OwnerCreate(OwnerBase):
    pass

class OwnerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bank_details: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class Owner(OwnerBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "active"  # active, inactive
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OwnerDashboardStats(BaseModel):
    owner: dict
    total_properties: int
    active_properties: int
    total_earnings: float
    current_month_earnings: float
    properties: List[dict]
    earnings_history: List[dict]

# Agent Models
class AgentBase(BaseModel):
    name: str
    email: str
    phone: str
    designation: Optional[str] = "Field Agent"
    notes: Optional[str] = None

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class Agent(AgentBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "active"  # active, inactive
    total_inquiries_handled: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Property Models
class PropertyBase(BaseModel):
    title: str
    property_type: str  # pre-occupied, rent, buy
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
    owner_id: Optional[str] = None  # Link to owner
    monthly_rent_amount: Optional[float] = None  # For earnings calculation

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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Conversation Log Model
class ConversationLog(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    agent_id: str
    agent_name: str
    message: str
    status_change: Optional[str] = None

# Inquiry Models
class InquiryBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    property_id: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    whatsapp_updates: bool = False
    inquiry_type: str = "general"

class InquiryCreate(InquiryBase):
    pass

class InquiryUpdate(BaseModel):
    status: Optional[str] = None
    assigned_agent_id: Optional[str] = None

class Inquiry(InquiryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"  # new, assigned, talked, visit_scheduled, visit_completed, closed
    assigned_agent_id: Optional[str] = None
    assigned_agent_name: Optional[str] = None
    conversation_logs: List[dict] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Earnings Model (for tracking owner earnings)
class EarningsRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_id: str
    property_id: str
    amount: float
    month: str  # Format: "2026-01"
    description: Optional[str] = None
    status: str = "pending"  # pending, paid
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Dashboard Stats
class DashboardStats(BaseModel):
    total_properties: int
    active_properties: int
    total_inquiries: int
    new_inquiries: int
    total_owners: int
    total_agents: int
    properties_by_type: dict
    recent_inquiries: List[dict]

# ============== HELPER FUNCTIONS ==============

def serialize_datetime(obj):
    """Convert datetime objects to ISO format strings"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

async def get_owner_by_id(owner_id: str):
    """Get owner document by ID"""
    return await db.owners.find_one({"id": owner_id}, {"_id": 0})

async def get_agent_by_id(agent_id: str):
    """Get agent document by ID"""
    return await db.agents.find_one({"id": agent_id}, {"_id": 0})

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "InstaMakaan API is running"}

# Status routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ============== IMAGE UPLOAD ==============

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOADS_DIR / unique_filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"url": f"/uploads/{unique_filename}", "filename": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/upload/multiple")
async def upload_multiple_images(files: List[UploadFile] = File(...)):
    try:
        urls = []
        for file in files:
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = UPLOADS_DIR / unique_filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            urls.append(f"/uploads/{unique_filename}")
        return {"urls": urls}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== OWNER CRUD ==============

@api_router.post("/owners", response_model=Owner)
async def create_owner(owner_data: OwnerCreate):
    owner_dict = owner_data.model_dump()
    owner_obj = Owner(**owner_dict)
    doc = owner_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.owners.insert_one(doc)
    return owner_obj

@api_router.get("/owners", response_model=List[Owner])
async def get_owners(status: Optional[str] = None, limit: int = 100):
    query = {}
    if status:
        query['status'] = status
    owners = await db.owners.find(query, {"_id": 0}).to_list(limit)
    for owner in owners:
        if isinstance(owner.get('created_at'), str):
            owner['created_at'] = datetime.fromisoformat(owner['created_at'])
        if isinstance(owner.get('updated_at'), str):
            owner['updated_at'] = datetime.fromisoformat(owner['updated_at'])
    return owners

@api_router.get("/owners/{owner_id}", response_model=Owner)
async def get_owner(owner_id: str):
    owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    if isinstance(owner.get('created_at'), str):
        owner['created_at'] = datetime.fromisoformat(owner['created_at'])
    if isinstance(owner.get('updated_at'), str):
        owner['updated_at'] = datetime.fromisoformat(owner['updated_at'])
    return owner

@api_router.put("/owners/{owner_id}", response_model=Owner)
async def update_owner(owner_id: str, owner_update: OwnerUpdate):
    existing = await db.owners.find_one({"id": owner_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Owner not found")
    update_data = owner_update.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.owners.update_one({"id": owner_id}, {"$set": update_data})
    updated = await db.owners.find_one({"id": owner_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/owners/{owner_id}")
async def delete_owner(owner_id: str):
    result = await db.owners.delete_one({"id": owner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Owner not found")
    return {"message": "Owner deleted successfully"}

# Owner Dashboard
@api_router.get("/owners/{owner_id}/dashboard")
async def get_owner_dashboard(owner_id: str):
    owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    
    # Get owner's properties
    properties = await db.properties.find({"owner_id": owner_id}, {"_id": 0}).to_list(100)
    total_properties = len(properties)
    active_properties = len([p for p in properties if p.get('status') == 'active'])
    
    # Get earnings
    earnings = await db.earnings.find({"owner_id": owner_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    total_earnings = sum(e.get('amount', 0) for e in earnings if e.get('status') == 'paid')
    
    # Current month earnings
    current_month = datetime.now().strftime("%Y-%m")
    current_month_earnings = sum(
        e.get('amount', 0) for e in earnings 
        if e.get('month') == current_month and e.get('status') == 'paid'
    )
    
    # Earnings history (last 6 months)
    earnings_history = []
    for e in earnings[:6]:
        earnings_history.append({
            "month": e.get('month'),
            "amount": e.get('amount'),
            "status": e.get('status')
        })
    
    return {
        "owner": owner,
        "total_properties": total_properties,
        "active_properties": active_properties,
        "total_earnings": total_earnings,
        "current_month_earnings": current_month_earnings,
        "properties": properties,
        "earnings_history": earnings_history
    }

# ============== AGENT CRUD ==============

@api_router.post("/agents", response_model=Agent)
async def create_agent(agent_data: AgentCreate):
    agent_dict = agent_data.model_dump()
    agent_obj = Agent(**agent_dict)
    doc = agent_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.agents.insert_one(doc)
    return agent_obj

@api_router.get("/agents", response_model=List[Agent])
async def get_agents(status: Optional[str] = None, limit: int = 100):
    query = {}
    if status:
        query['status'] = status
    agents = await db.agents.find(query, {"_id": 0}).to_list(limit)
    for agent in agents:
        if isinstance(agent.get('created_at'), str):
            agent['created_at'] = datetime.fromisoformat(agent['created_at'])
        if isinstance(agent.get('updated_at'), str):
            agent['updated_at'] = datetime.fromisoformat(agent['updated_at'])
        # Count assigned inquiries
        inquiry_count = await db.inquiries.count_documents({"assigned_agent_id": agent['id']})
        agent['total_inquiries_handled'] = inquiry_count
    return agents

@api_router.get("/agents/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str):
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if isinstance(agent.get('created_at'), str):
        agent['created_at'] = datetime.fromisoformat(agent['created_at'])
    if isinstance(agent.get('updated_at'), str):
        agent['updated_at'] = datetime.fromisoformat(agent['updated_at'])
    return agent

@api_router.put("/agents/{agent_id}", response_model=Agent)
async def update_agent(agent_id: str, agent_update: AgentUpdate):
    existing = await db.agents.find_one({"id": agent_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Agent not found")
    update_data = agent_update.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.agents.update_one({"id": agent_id}, {"$set": update_data})
    updated = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    result = await db.agents.delete_one({"id": agent_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted successfully"}

# Agent Dashboard - Get agent's assigned inquiries
@api_router.get("/agents/{agent_id}/inquiries")
async def get_agent_inquiries(agent_id: str):
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    inquiries = await db.inquiries.find({"assigned_agent_id": agent_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Count by status
    status_counts = {}
    for inquiry in inquiries:
        status = inquiry.get('status', 'unknown')
        status_counts[status] = status_counts.get(status, 0) + 1
    
    return {
        "agent": agent,
        "total_inquiries": len(inquiries),
        "status_counts": status_counts,
        "inquiries": inquiries
    }

# ============== PROPERTY CRUD ==============

@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    property_dict = property_data.model_dump()
    property_obj = Property(**property_dict)
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.properties.insert_one(doc)
    return property_obj

@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    owner_id: Optional[str] = None,
    limit: int = 100
):
    query = {}
    if property_type:
        query['property_type'] = property_type
    if status:
        query['status'] = status
    if owner_id:
        query['owner_id'] = owner_id
    
    properties = await db.properties.find(query, {"_id": 0}).to_list(limit)
    
    for prop in properties:
        if isinstance(prop.get('created_at'), str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
        if isinstance(prop.get('updated_at'), str):
            prop['updated_at'] = datetime.fromisoformat(prop['updated_at'])
        # Add owner name if owner_id exists
        if prop.get('owner_id'):
            owner = await get_owner_by_id(prop['owner_id'])
            prop['owner_name'] = owner.get('name') if owner else None
    
    return properties

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    property_doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    if isinstance(property_doc.get('created_at'), str):
        property_doc['created_at'] = datetime.fromisoformat(property_doc['created_at'])
    if isinstance(property_doc.get('updated_at'), str):
        property_doc['updated_at'] = datetime.fromisoformat(property_doc['updated_at'])
    return property_doc

@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, property_update: PropertyUpdate):
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    update_data = property_update.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.properties.update_one({"id": property_id}, {"$set": update_data})
    updated = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return updated

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}

@api_router.post("/properties/{property_id}/images")
async def add_property_images(property_id: str, image_urls: List[str]):
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    current_images = existing.get('images', [])
    updated_images = current_images + image_urls
    await db.properties.update_one(
        {"id": property_id},
        {"$set": {"images": updated_images, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Images added successfully", "images": updated_images}

# ============== INQUIRY CRUD ==============

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry_data: InquiryCreate):
    inquiry_dict = inquiry_data.model_dump()
    inquiry_obj = Inquiry(**inquiry_dict)
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.inquiries.insert_one(doc)
    return inquiry_obj

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries(
    status: Optional[str] = None,
    inquiry_type: Optional[str] = None,
    assigned_agent_id: Optional[str] = None,
    unassigned: Optional[bool] = None,
    limit: int = 100
):
    query = {}
    if status:
        query['status'] = status
    if inquiry_type:
        query['inquiry_type'] = inquiry_type
    if assigned_agent_id:
        query['assigned_agent_id'] = assigned_agent_id
    if unassigned:
        query['assigned_agent_id'] = None
    
    inquiries = await db.inquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    
    for inquiry in inquiries:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
        if isinstance(inquiry.get('updated_at'), str):
            inquiry['updated_at'] = datetime.fromisoformat(inquiry['updated_at'])
    
    return inquiries

@api_router.get("/inquiries/{inquiry_id}")
async def get_inquiry(inquiry_id: str):
    inquiry = await db.inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if isinstance(inquiry.get('created_at'), str):
        inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    if isinstance(inquiry.get('updated_at'), str):
        inquiry['updated_at'] = datetime.fromisoformat(inquiry['updated_at'])
    return inquiry

@api_router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str):
    result = await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated successfully"}

# Assign inquiry to agent
@api_router.put("/inquiries/{inquiry_id}/assign")
async def assign_inquiry_to_agent(inquiry_id: str, agent_id: str):
    inquiry = await db.inquiries.find_one({"id": inquiry_id})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Add assignment log
    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent_id": agent_id,
        "agent_name": agent.get('name'),
        "message": f"Inquiry assigned to {agent.get('name')}",
        "status_change": "assigned"
    }
    
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {
            "$set": {
                "assigned_agent_id": agent_id,
                "assigned_agent_name": agent.get('name'),
                "status": "assigned",
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            "$push": {"conversation_logs": log_entry}
        }
    )
    
    return {"message": f"Inquiry assigned to {agent.get('name')}"}

# Unassign inquiry from agent
@api_router.put("/inquiries/{inquiry_id}/unassign")
async def unassign_inquiry(inquiry_id: str):
    inquiry = await db.inquiries.find_one({"id": inquiry_id})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {
            "$set": {
                "assigned_agent_id": None,
                "assigned_agent_name": None,
                "status": "new",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Inquiry unassigned successfully"}

# Add conversation log to inquiry
@api_router.post("/inquiries/{inquiry_id}/log")
async def add_conversation_log(inquiry_id: str, agent_id: str, message: str, new_status: Optional[str] = None):
    inquiry = await db.inquiries.find_one({"id": inquiry_id})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    agent = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent_id": agent_id,
        "agent_name": agent.get('name'),
        "message": message,
        "status_change": new_status
    }
    
    update_data = {
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if new_status:
        update_data["status"] = new_status
    
    await db.inquiries.update_one(
        {"id": inquiry_id},
        {
            "$set": update_data,
            "$push": {"conversation_logs": log_entry}
        }
    )
    
    return {"message": "Conversation log added successfully"}

# ============== EARNINGS ==============

@api_router.post("/earnings")
async def create_earnings_record(
    owner_id: str,
    property_id: str,
    amount: float,
    month: str,
    description: Optional[str] = None
):
    earnings = EarningsRecord(
        owner_id=owner_id,
        property_id=property_id,
        amount=amount,
        month=month,
        description=description
    )
    doc = earnings.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.earnings.insert_one(doc)
    return {"message": "Earnings record created", "id": earnings.id}

@api_router.get("/earnings")
async def get_earnings(owner_id: Optional[str] = None, property_id: Optional[str] = None):
    query = {}
    if owner_id:
        query['owner_id'] = owner_id
    if property_id:
        query['property_id'] = property_id
    earnings = await db.earnings.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return earnings

@api_router.put("/earnings/{earnings_id}/status")
async def update_earnings_status(earnings_id: str, status: str):
    result = await db.earnings.update_one(
        {"id": earnings_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Earnings record not found")
    return {"message": "Status updated successfully"}

# ============== DASHBOARD ==============

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    total_properties = await db.properties.count_documents({})
    active_properties = await db.properties.count_documents({"status": "active"})
    total_inquiries = await db.inquiries.count_documents({})
    new_inquiries = await db.inquiries.count_documents({"status": "new"})
    total_owners = await db.owners.count_documents({})
    total_agents = await db.agents.count_documents({"status": "active"})
    
    pipeline = [{"$group": {"_id": "$property_type", "count": {"$sum": 1}}}]
    type_counts = await db.properties.aggregate(pipeline).to_list(100)
    properties_by_type = {item['_id']: item['count'] for item in type_counts if item['_id']}
    
    recent = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    for inquiry in recent:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = inquiry['created_at']
    
    return DashboardStats(
        total_properties=total_properties,
        active_properties=active_properties,
        total_inquiries=total_inquiries,
        new_inquiries=new_inquiries,
        total_owners=total_owners,
        total_agents=total_agents,
        properties_by_type=properties_by_type,
        recent_inquiries=recent
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
