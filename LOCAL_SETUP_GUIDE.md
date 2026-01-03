# InstaMakaan - Local Development Setup Guide

A comprehensive guide to set up the InstaMakaan real estate platform locally on your machine.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Sample Data](#sample-data)
8. [Environment Variables Reference](#environment-variables-reference)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | v18.x or higher | [nodejs.org](https://nodejs.org/) |
| **Yarn** | v1.22.x | `npm install -g yarn` |
| **Python** | v3.10 or higher | [python.org](https://python.org/) |
| **MongoDB** | v6.0 or higher | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### Verify Installations

```bash
# Check Node.js
node --version
# Expected: v18.x.x or higher

# Check Yarn
yarn --version
# Expected: 1.22.x

# Check Python
python3 --version
# Expected: Python 3.10.x or higher

# Check MongoDB (if installed locally)
mongod --version

# Check Git
git --version
```

---

## Project Structure

```
instamakaan/
├── backend/                 # FastAPI Backend
│   ├── server.py           # Main server file
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Backend environment variables
│   └── tests/             # Backend tests
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main App component
│   ├── package.json       # Node.js dependencies
│   ├── .env              # Frontend environment variables
│   └── tailwind.config.js # Tailwind CSS config
│
└── README.md              # This file
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
.\venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Configure Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env

# MongoDB Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="instamakaan"

# CORS Configuration (comma-separated origins)
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"

# Optional: JWT Secret for future authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 5: Verify Backend Setup

```bash
# Test if server starts (from backend directory with venv activated)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8001
# INFO:     Application startup complete.
```

Visit `http://localhost:8001/api/` to verify. You should see:
```json
{"message": "InstaMakaan API is running"}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Node.js Dependencies

```bash
# Install all dependencies using Yarn
yarn install
```

### Step 3: Configure Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# frontend/.env

# Backend API URL (local development)
REACT_APP_BACKEND_URL=http://localhost:8001

# WebSocket port (not needed for local, set to empty)
WDS_SOCKET_PORT=

# Disable health check for local development
ENABLE_HEALTH_CHECK=false
```

### Step 4: Verify Frontend Setup

```bash
# Start the development server
yarn start

# You should see:
# Compiled successfully!
# You can now view frontend in the browser.
# Local: http://localhost:3000
```

---

## Database Setup

### Option A: Local MongoDB Installation

#### macOS (using Homebrew)

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh --eval "db.version()"
```

#### Ubuntu/Debian

```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh --eval "db.version()"
```

#### Windows

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the prompts
3. MongoDB will be installed as a Windows service
4. Verify using MongoDB Compass or `mongosh`

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster
3. Get your connection string
4. Update `backend/.env`:

```bash
MONGO_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="instamakaan"
```

### Option C: Docker (Recommended for Development)

```bash
# Pull and run MongoDB container
docker run -d \
  --name instamakaan-mongo \
  -p 27017:27017 \
  -v instamakaan-mongo-data:/data/db \
  mongo:7.0

# Verify container is running
docker ps

# View logs
docker logs instamakaan-mongo
```

---

## Running the Application

### Method 1: Run Services Separately (Recommended for Development)

Open **three terminal windows**:

#### Terminal 1: MongoDB (if using Docker)
```bash
docker start instamakaan-mongo
# Or if using local installation, ensure MongoDB service is running
```

#### Terminal 2: Backend
```bash
cd backend
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Terminal 3: Frontend
```bash
cd frontend
yarn start
```

### Method 2: Using a Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'instamakaan-backend',
      cwd: './backend',
      script: 'uvicorn',
      args: 'server:app --host 0.0.0.0 --port 8001',
      interpreter: './venv/bin/python',
      env: {
        MONGO_URL: 'mongodb://localhost:27017',
        DB_NAME: 'instamakaan'
      }
    },
    {
      name: 'instamakaan-frontend',
      cwd: './frontend',
      script: 'yarn',
      args: 'start',
      env: {
        REACT_APP_BACKEND_URL: 'http://localhost:8001'
      }
    }
  ]
};
EOF

# Start all services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Stop all services
pm2 stop all
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React application |
| **Backend API** | http://localhost:8001/api | FastAPI endpoints |
| **API Docs** | http://localhost:8001/docs | Swagger UI documentation |
| **Admin Panel** | http://localhost:3000/admin | Admin dashboard |

---

## Sample Data

### Seed the Database with Sample Data

Create a file `backend/seed_data.py`:

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from uuid import uuid4
from datetime import datetime, timezone

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "instamakaan"

async def seed_database():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Clear existing data
    await db.properties.delete_many({})
    await db.owners.delete_many({})
    await db.agents.delete_many({})
    await db.inquiries.delete_many({})
    
    # Create Owners
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
        }
    ]
    await db.owners.insert_many(owners)
    print(f"✅ Created {len(owners)} owners")
    
    # Create Agents
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
        }
    ]
    await db.agents.insert_many(agents)
    print(f"✅ Created {len(agents)} agents")
    
    # Create Properties
    properties = [
        {
            "id": str(uuid4()),
            "title": "3 BHK Luxury Apartment in ATS Greens",
            "description": "Beautiful 3 BHK apartment with modern amenities, spacious rooms, and great ventilation.",
            "property_type": "rent",
            "status": "active",
            "location": "Sector 150, Noida",
            "sector": "Sector 150",
            "price": "45,000",
            "price_label": "Full Flat Rent",
            "beds": 3,
            "baths": 3,
            "area": "1800 sq.ft",
            "furnishing": "semi-furnished",
            "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
            "features": ["Modular Kitchen", "Power Backup", "Parking"],
            "amenities": ["Swimming Pool", "Gym", "Club House"],
            "owner_id": owners[0]["id"],
            "owner_name": owners[0]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "4 BHK Villa in Jaypee Greens",
            "description": "Stunning 4 BHK villa with private garden, modern interiors, and premium fittings.",
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
            "images": ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"],
            "features": ["Private Garden", "Servant Quarter", "Study Room"],
            "amenities": ["24x7 Security", "CCTV", "Kids Play Area"],
            "owner_id": owners[1]["id"],
            "owner_name": owners[1]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "2 BHK Flat in Gaur City",
            "description": "Well-maintained 2 BHK flat perfect for small families. Close to metro station.",
            "property_type": "rent",
            "status": "active",
            "location": "Greater Noida West",
            "sector": "Gaur City",
            "price": "18,000",
            "price_label": "Per Bed Rent",
            "beds": 2,
            "baths": 2,
            "area": "1200 sq.ft",
            "furnishing": "furnished",
            "images": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
            "features": ["Balcony", "Store Room", "Covered Parking"],
            "amenities": ["Metro Nearby", "Shopping Mall", "Hospital"],
            "owner_id": owners[0]["id"],
            "owner_name": owners[0]["name"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.properties.insert_many(properties)
    print(f"✅ Created {len(properties)} properties")
    
    # Create Inquiries
    inquiries = [
        {
            "id": str(uuid4()),
            "name": "Rahul Verma",
            "email": "rahul.verma@email.com",
            "phone": "+91 77777 66666",
            "message": "Interested in the 3 BHK apartment. Please arrange a site visit.",
            "inquiry_type": "schedule_visit",
            "property_id": properties[0]["id"],
            "status": "new",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Sneha Kapoor",
            "email": "sneha.k@email.com",
            "phone": "+91 66666 55555",
            "message": "Looking for 4 BHK villa. What is the best price?",
            "inquiry_type": "price_inquiry",
            "property_id": properties[1]["id"],
            "status": "new",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.inquiries.insert_many(inquiries)
    print(f"✅ Created {len(inquiries)} inquiries")
    
    print("\n🎉 Database seeded successfully!")
    print(f"   - Owners: {len(owners)}")
    print(f"   - Agents: {len(agents)}")
    print(f"   - Properties: {len(properties)}")
    print(f"   - Inquiries: {len(inquiries)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
```

Run the seed script:

```bash
cd backend
source venv/bin/activate
python seed_data.py
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URL` | Yes | - | MongoDB connection string |
| `DB_NAME` | Yes | - | Database name |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins (comma-separated) |
| `JWT_SECRET` | No | - | Secret key for JWT tokens |
| `JWT_ALGORITHM` | No | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | Token expiration time |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_BACKEND_URL` | Yes | - | Backend API URL |
| `WDS_SOCKET_PORT` | No | - | WebSocket port for hot reload |
| `ENABLE_HEALTH_CHECK` | No | `false` | Enable health check endpoint |

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongod` (Linux) or `brew services list` (macOS)
- Check if MongoDB is listening on the correct port: `netstat -an | grep 27017`

#### 2. CORS Error in Browser

```
Access to fetch at 'http://localhost:8001/api/...' has been blocked by CORS policy
```

**Solution:**
- Verify `CORS_ORIGINS` in `backend/.env` includes your frontend URL
- Restart the backend server after changing `.env`

#### 3. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find and kill the process using the port
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 4. Python Module Not Found

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

#### 5. Node.js Version Mismatch

```
error @something@x.x.x: The engine "node" is incompatible with this module
```

**Solution:**
- Use Node Version Manager (nvm) to switch Node.js versions:
```bash
nvm install 18
nvm use 18
```

### Getting Help

If you encounter issues not covered here:

1. Check the console logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Backend, Frontend) are running
4. Check the API documentation at `http://localhost:8001/docs`

---

## Quick Start Commands Summary

```bash
# Clone the repository
git clone <repository-url>
cd instamakaan

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with MongoDB configuration

# Frontend setup
cd ../frontend
yarn install
# Create .env file with backend URL

# Start MongoDB (Docker)
docker run -d --name instamakaan-mongo -p 27017:27017 mongo:7.0

# Start Backend (new terminal)
cd backend && source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Start Frontend (new terminal)
cd frontend && yarn start

# Seed sample data
cd backend && python seed_data.py
```

---

## 🎉 You're All Set!

Visit:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:8001/docs

Happy coding! 🏠
