"""
InstaMakaan - Database Seed Script
Run this script to populate the database with sample data for local development.

Usage:
    cd backend
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    python seed_data.py
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from uuid import uuid4
from datetime import datetime, timezone
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "instamakaan")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def seed_database():
    """Seed the database with sample data."""
    print(f"\n🔄 Connecting to MongoDB: {MONGO_URL}")
    print(f"📦 Database: {DB_NAME}\n")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Check connection
    try:
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!\n")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return
    
    # Clear existing data
    print("🗑️  Clearing existing data...")
    await db.properties.delete_many({})
    await db.owners.delete_many({})
    await db.agents.delete_many({})
    await db.inquiries.delete_many({})
    await db.users.delete_many({})
    print("   Done!\n")
    
    # Create Owners
    print("👤 Creating owners...")
    owners = [
        {
            "id": str(uuid4()),
            "name": "Rajesh Kumar",
            "email": "rajesh@example.com",
            "phone": "+91 98765 43210",
            "address": "Sector 150, Noida",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Priya Sharma",
            "email": "priya@example.com",
            "phone": "+91 87654 32109",
            "address": "Greater Noida West",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Vikram Malhotra",
            "email": "vikram@example.com",
            "phone": "+91 76543 21098",
            "address": "Sector 128, Noida",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.owners.insert_many(owners)
    print(f"   ✅ Created {len(owners)} owners")
    
    # Create Agents
    print("🕵️ Creating agents...")
    agents = [
        {
            "id": str(uuid4()),
            "name": "Amit Singh",
            "email": "amit@instamakaan.com",
            "phone": "+91 99999 88888",
            "designation": "Senior Field Agent",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Neha Gupta",
            "email": "neha@instamakaan.com",
            "phone": "+91 88888 77777",
            "designation": "Property Consultant",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Rohit Verma",
            "email": "rohit@instamakaan.com",
            "phone": "+91 77777 66666",
            "designation": "Junior Agent",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.agents.insert_many(agents)
    print(f"   ✅ Created {len(agents)} agents")
    
    # Create Properties
    print("🏠 Creating properties...")
    properties = [
        {
            "id": str(uuid4()),
            "title": "3 BHK Luxury Apartment in ATS Greens",
            "description": "Beautiful 3 BHK apartment with modern amenities, spacious rooms, and great ventilation. Located in a prime location with easy access to metro, schools, and hospitals.",
            "property_type": "rent",
            "status": "active",
            "location": "Sector 150, Noida",
            "sector": "Sector 150",
            "price": "45,000",
            "price_label": "Full Flat Rent",
            "monthly_rent_amount": 45000,
            "beds": 3,
            "baths": 3,
            "area": "1800 sq.ft",
            "furnishing": "semi-furnished",
            "preferred_tenant": "family",
            "deposit": "2 Months",
            "brokerage": "15 Days",
            "images": [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
            ],
            "features": ["Modular Kitchen", "Power Backup", "Parking", "Balcony"],
            "amenities": ["Swimming Pool", "Gym", "Club House", "24x7 Security"],
            "owner_id": owners[0]["id"],
            "owner_name": owners[0]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "4 BHK Villa in Jaypee Greens",
            "description": "Stunning 4 BHK villa with private garden, modern interiors, and premium fittings. Perfect for families looking for luxury living with ample space and privacy.",
            "property_type": "buy",
            "status": "active",
            "location": "Sector 128, Noida",
            "sector": "Sector 128",
            "price": "2.5 Cr",
            "price_label": "Price",
            "beds": 4,
            "baths": 4,
            "area": "3500 sq.ft",
            "furnishing": "unfurnished",
            "images": [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
            ],
            "features": ["Private Garden", "Servant Quarter", "Study Room", "Home Theatre"],
            "amenities": ["24x7 Security", "CCTV", "Kids Play Area", "Jogging Track"],
            "owner_id": owners[1]["id"],
            "owner_name": owners[1]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "2 BHK Flat in Gaur City",
            "description": "Well-maintained 2 BHK flat perfect for small families or working professionals. Close to metro station and major IT hubs.",
            "property_type": "rent",
            "status": "active",
            "location": "Greater Noida West",
            "sector": "Gaur City",
            "price": "18,000",
            "price_label": "Per Bed Rent",
            "monthly_rent_amount": 18000,
            "beds": 2,
            "baths": 2,
            "area": "1200 sq.ft",
            "furnishing": "furnished",
            "preferred_tenant": "any",
            "deposit": "1 Month",
            "brokerage": "10 Days",
            "images": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
            ],
            "features": ["Balcony", "Store Room", "Covered Parking"],
            "amenities": ["Metro Nearby", "Shopping Mall", "Hospital", "Schools"],
            "owner_id": owners[0]["id"],
            "owner_name": owners[0]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "Pre-Occupied Managed Home in Supertech",
            "description": "Professionally managed pre-occupied property generating steady rental income. Ideal for investors looking for hassle-free returns.",
            "property_type": "pre-occupied",
            "status": "active",
            "location": "Greater Noida West",
            "sector": "Supertech Eco Village",
            "price": "78,968",
            "price_label": "Total Price",
            "monthly_rent_amount": 15000,
            "beds": 2,
            "baths": 2,
            "area": "1100 sq.ft",
            "furnishing": "semi-furnished",
            "images": [
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
            ],
            "features": ["Rental Income", "Managed Property", "Regular Maintenance"],
            "amenities": ["Security", "Power Backup", "Water Supply"],
            "owner_id": owners[2]["id"],
            "owner_name": owners[2]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "Studio Apartment in Noida Extension",
            "description": "Compact and cozy studio apartment perfect for bachelors or young professionals. Fully furnished with all modern amenities.",
            "property_type": "rent",
            "status": "active",
            "location": "Noida Extension",
            "sector": "Sector 1",
            "price": "12,000",
            "price_label": "Full Flat Rent",
            "monthly_rent_amount": 12000,
            "beds": 1,
            "baths": 1,
            "area": "450 sq.ft",
            "furnishing": "furnished",
            "preferred_tenant": "bachelor",
            "deposit": "1 Month",
            "brokerage": "7 Days",
            "images": [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
            ],
            "features": ["Fully Furnished", "AC", "WiFi Ready"],
            "amenities": ["Laundry", "House Keeping Available"],
            "owner_id": owners[1]["id"],
            "owner_name": owners[1]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.properties.insert_many(properties)
    print(f"   ✅ Created {len(properties)} properties")
    
    # Create Inquiries
    print("📧 Creating inquiries...")
    inquiries = [
        {
            "id": str(uuid4()),
            "name": "Rahul Verma",
            "email": "rahul.verma@email.com",
            "phone": "+91 77777 66666",
            "message": "Interested in the 3 BHK apartment in ATS Greens. Please arrange a site visit this weekend.",
            "inquiry_type": "schedule_visit",
            "property_id": properties[0]["id"],
            "status": "assigned",
            "assigned_agent_id": agents[0]["id"],
            "assigned_agent_name": agents[0]["name"],
            "conversation_logs": [
                {
                    "agent_id": agents[0]["id"],
                    "agent_name": agents[0]["name"],
                    "message": "Inquiry received and assigned",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "status_change": "assigned"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Sneha Kapoor",
            "email": "sneha.k@email.com",
            "phone": "+91 66666 55555",
            "message": "Looking for 4 BHK villa in Jaypee Greens. What is the best price? Can we negotiate?",
            "inquiry_type": "price_inquiry",
            "property_id": properties[1]["id"],
            "status": "new",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Arjun Mehta",
            "email": "arjun.m@email.com",
            "phone": "+91 55555 44444",
            "message": "Need a 2 BHK for my family. We are relocating from Delhi next month.",
            "inquiry_type": "general",
            "status": "talked",
            "assigned_agent_id": agents[1]["id"],
            "assigned_agent_name": agents[1]["name"],
            "conversation_logs": [
                {
                    "agent_id": agents[1]["id"],
                    "agent_name": agents[1]["name"],
                    "message": "Inquiry assigned",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "status_change": "assigned"
                },
                {
                    "agent_id": agents[1]["id"],
                    "agent_name": agents[1]["name"],
                    "message": "Called the customer. Discussed requirements - needs 2 BHK with parking, budget 15-20k.",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "status_change": "talked"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Kavita Joshi",
            "email": "kavita.j@email.com",
            "phone": "+91 44444 33333",
            "message": "Want to invest in pre-occupied property. Looking for good returns.",
            "inquiry_type": "investment",
            "property_id": properties[3]["id"],
            "status": "new",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.inquiries.insert_many(inquiries)
    print(f"   ✅ Created {len(inquiries)} inquiries")
    
    # Create Users (Admin, Owner, Agent)
    print("👥 Creating users...")
    users = [
        # Admin User
        {
            "id": str(uuid4()),
            "name": "Admin User",
            "email": "admin@instamakaan.com",
            "password_hash": get_password_hash("admin123"),
            "role": "admin",
            "status": "active",
            "linked_id": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Owner User (linked to first owner - Rajesh Kumar)
        {
            "id": str(uuid4()),
            "name": owners[0]["name"],
            "email": owners[0]["email"],
            "password_hash": get_password_hash("owner123"),
            "role": "owner",
            "status": "active",
            "linked_id": owners[0]["id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Second Owner User (linked to second owner - Priya Sharma)
        {
            "id": str(uuid4()),
            "name": owners[1]["name"],
            "email": owners[1]["email"],
            "password_hash": get_password_hash("owner123"),
            "role": "owner",
            "status": "active",
            "linked_id": owners[1]["id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Agent User (linked to first agent - Amit Singh)
        {
            "id": str(uuid4()),
            "name": agents[0]["name"],
            "email": "amit@instamakaan.com",  # Different email for login
            "password_hash": get_password_hash("agent123"),
            "role": "agent",
            "status": "active",
            "linked_id": agents[0]["id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Second Agent User (linked to second agent - Neha Gupta)
        {
            "id": str(uuid4()),
            "name": agents[1]["name"],
            "email": "neha@instamakaan.com",  # Different email for login
            "password_hash": get_password_hash("agent123"),
            "role": "agent",
            "status": "active",
            "linked_id": agents[1]["id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.users.insert_many(users)
    print(f"   ✅ Created {len(users)} users")
    
    # Print summary
    print("\n" + "="*50)
    print("🎉 DATABASE SEEDED SUCCESSFULLY!")
    print("="*50)
    print(f"\n📊 Summary:")
    print(f"   • Owners:     {len(owners)}")
    print(f"   • Agents:     {len(agents)}")
    print(f"   • Properties: {len(properties)}")
    print(f"   • Inquiries:  {len(inquiries)}")
    print(f"   • Users:      {len(users)}")
    print(f"\n🔐 Login Credentials:")
    print(f"   ┌─────────────────────────────────────────────────────┐")
    print(f"   │ Role   │ Email                    │ Password       │")
    print(f"   ├─────────────────────────────────────────────────────┤")
    print(f"   │ Admin  │ admin@instamakaan.com    │ admin123       │")
    print(f"   │ Owner  │ rajesh@example.com       │ owner123       │")
    print(f"   │ Owner  │ priya@example.com        │ owner123       │")
    print(f"   │ Agent  │ amit@instamakaan.com     │ agent123       │")
    print(f"   │ Agent  │ neha@instamakaan.com     │ agent123       │")
    print(f"   └─────────────────────────────────────────────────────┘")
    print(f"\n🌐 You can now access:")
    print(f"   • Frontend:    http://localhost:3000")
    print(f"   • Admin Panel: http://localhost:3000/admin")
    print(f"   • Owner Portal: http://localhost:3000/owner")
    print(f"   • Agent Portal: http://localhost:3000/agent")
    print(f"   • API Docs:    http://localhost:8001/docs")
    print()
    
    client.close()


async def clear_database():
    """Clear all data from the database."""
    print(f"\n🔄 Connecting to MongoDB: {MONGO_URL}")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🗑️  Clearing all collections...")
    await db.properties.delete_many({})
    await db.owners.delete_many({})
    await db.agents.delete_many({})
    await db.inquiries.delete_many({})
    await db.users.delete_many({})
    print("✅ Database cleared!")
    
    client.close()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--clear":
        asyncio.run(clear_database())
    else:
        asyncio.run(seed_database())
