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

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Property Models
class PropertyBase(BaseModel):
    title: str
    property_type: str  # pre-occupied, rent, buy
    location: str
    sector: Optional[str] = None
    price: str
    price_label: str  # "Per Bed Rent", "Full Flat Rent", "Price"
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
    status: str = "active"  # active, inactive, rented, sold
    deposit: Optional[str] = None
    brokerage: Optional[str] = None

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

class Property(PropertyBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    images: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertyResponse(Property):
    pass

# Inquiry Model
class InquiryBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    property_id: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    whatsapp_updates: bool = False
    inquiry_type: str = "general"  # general, schedule_visit, callback

class InquiryCreate(InquiryBase):
    pass

class Inquiry(InquiryBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"  # new, contacted, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Dashboard Stats
class DashboardStats(BaseModel):
    total_properties: int
    active_properties: int
    total_inquiries: int
    new_inquiries: int
    properties_by_type: dict
    recent_inquiries: List[dict]

# Routes
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
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Image Upload
@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOADS_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL path
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

# Property CRUD
@api_router.post("/properties", response_model=PropertyResponse)
async def create_property(property_data: PropertyCreate):
    property_dict = property_data.model_dump()
    property_obj = Property(**property_dict)
    
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.properties.insert_one(doc)
    return property_obj

@api_router.get("/properties", response_model=List[PropertyResponse])
async def get_properties(
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100
):
    query = {}
    if property_type:
        query['property_type'] = property_type
    if status:
        query['status'] = status
    
    properties = await db.properties.find(query, {"_id": 0}).to_list(limit)
    
    for prop in properties:
        if isinstance(prop.get('created_at'), str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
        if isinstance(prop.get('updated_at'), str):
            prop['updated_at'] = datetime.fromisoformat(prop['updated_at'])
    
    return properties

@api_router.get("/properties/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: str):
    property_doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    
    if not property_doc:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if isinstance(property_doc.get('created_at'), str):
        property_doc['created_at'] = datetime.fromisoformat(property_doc['created_at'])
    if isinstance(property_doc.get('updated_at'), str):
        property_doc['updated_at'] = datetime.fromisoformat(property_doc['updated_at'])
    
    return property_doc

@api_router.put("/properties/{property_id}", response_model=PropertyResponse)
async def update_property(property_id: str, property_update: PropertyUpdate):
    # Get existing property
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Update only provided fields
    update_data = property_update.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.properties.update_one(
        {"id": property_id},
        {"$set": update_data}
    )
    
    # Return updated property
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

# Add images to property
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

# Inquiry CRUD
@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry_data: InquiryCreate):
    inquiry_dict = inquiry_data.model_dump()
    inquiry_obj = Inquiry(**inquiry_dict)
    
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.inquiries.insert_one(doc)
    return inquiry_obj

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries(
    status: Optional[str] = None,
    inquiry_type: Optional[str] = None,
    limit: int = 100
):
    query = {}
    if status:
        query['status'] = status
    if inquiry_type:
        query['inquiry_type'] = inquiry_type
    
    inquiries = await db.inquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    
    for inquiry in inquiries:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    
    return inquiries

@api_router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str):
    result = await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated successfully"}

# Dashboard Stats
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    # Total properties
    total_properties = await db.properties.count_documents({})
    active_properties = await db.properties.count_documents({"status": "active"})
    
    # Properties by type
    pipeline = [
        {"$group": {"_id": "$property_type", "count": {"$sum": 1}}}
    ]
    type_counts = await db.properties.aggregate(pipeline).to_list(100)
    properties_by_type = {item['_id']: item['count'] for item in type_counts if item['_id']}
    
    # Total inquiries
    total_inquiries = await db.inquiries.count_documents({})
    new_inquiries = await db.inquiries.count_documents({"status": "new"})
    
    # Recent inquiries
    recent = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    for inquiry in recent:
        if isinstance(inquiry.get('created_at'), str):
            inquiry['created_at'] = inquiry['created_at']
    
    return DashboardStats(
        total_properties=total_properties,
        active_properties=active_properties,
        total_inquiries=total_inquiries,
        new_inquiries=new_inquiries,
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
