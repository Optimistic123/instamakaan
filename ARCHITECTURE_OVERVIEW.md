# InstaMakaan - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Public Pages │  │ Admin Portal │  │ Owner Portal │         │
│  │              │  │              │  │              │         │
│  │ • Home       │  │ • Dashboard  │  │ • Dashboard  │         │
│  │ • Properties │  │ • Properties │  │ • Properties │         │
│  │ • Contact    │  │ • Owners     │  │ • Earnings   │         │
│  │ • About      │  │ • Agents     │  │              │         │
│  │              │  │ • Inquiries  │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                               │
│  ┌──────────────┐                                            │
│  │ Agent Portal │                                            │
│  │              │                                            │
│  │ • Dashboard  │                                            │
│  │ • Inquiries  │                                            │
│  │ • Logs       │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (JWT Authentication)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    API Routes                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │   Auth   │  │Properties│  │ Inquiries│  │ Earnings │ │ │
│  │  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │  Owners  │  │  Agents  │  │  Users   │              │ │
│  │  │  Routes  │  │  Routes  │  │  Routes  │              │ │
│  │  └──────────┘  └──────────┘  └──────────┘              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Authentication & Authorization               │ │
│  │  • JWT Token Validation                                  │ │
│  │  • Role-Based Access Control (RBAC)                      │ │
│  │  • Password Hashing (bcrypt)                             │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Motor (Async MongoDB Driver)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  users   │  │ owners   │  │ agents  │  │properties│     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │inquiries │  │ earnings │  │status_   │                     │
│  │          │  │          │  │checks    │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 19.0.0
- **Routing**: React Router DOM 7.5.1
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Build Tool**: CRACO (Create React App Configuration Override)

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB (via Motor - Async MongoDB driver)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt (via passlib)
- **File Upload**: FastAPI UploadFile
- **CORS**: Starlette CORS Middleware

### Infrastructure
- **Database**: MongoDB
- **File Storage**: Local filesystem (`/uploads` directory)
- **Deployment**: Railway (based on Procfile and nixpacks.toml)

## Data Flow Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User Action
       │
       ▼
┌─────────────┐
│  React App  │
│  (Frontend) │
└──────┬──────┘
       │
       │ 2. API Call (Axios)
       │    Headers: Authorization: Bearer <JWT>
       │
       ▼
┌─────────────┐
│  FastAPI    │
│  Backend    │
└──────┬──────┘
       │
       │ 3. Middleware Chain:
       │    • CORS Check
       │    • JWT Validation
       │    • Role Check
       │
       ▼
┌─────────────┐
│  Route      │
│  Handler    │
└──────┬──────┘
       │
       │ 4. Business Logic
       │    • Validate Input
       │    • Process Request
       │
       ▼
┌─────────────┐
│  MongoDB    │
│  Driver     │
│  (Motor)    │
└──────┬──────┘
       │
       │ 5. Database Query
       │
       ▼
┌─────────────┐
│  MongoDB    │
│  Database   │
└──────┬──────┘
       │
       │ 6. Return Data
       │
       ▼
┌─────────────┐
│  JSON       │
│  Response   │
└──────┬──────┘
       │
       │ 7. Update UI
       │
       ▼
┌─────────────┐
│  User Sees  │
│  Updated    │
│  Content    │
└─────────────┘
```

## Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────┐
│                      User Roles                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐        │
│  │  Admin   │      │  Owner   │      │  Agent   │        │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘        │
│       │                 │                 │               │
│       │ Full Access     │ Limited Access  │ Limited Access│
│       │                 │                 │               │
│       ▼                 ▼                 ▼               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Permissions Matrix                      │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ Resource      │ Admin │ Owner │ Agent │ Public    │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ Properties    │  CRUD │   R   │   R   │    R      │  │
│  │ Owners        │  CRUD │   -   │   -   │    -      │  │
│  │ Agents        │  CRUD │   -   │   -   │    -      │  │
│  │ Inquiries     │  CRUD │   R   │  CRU  │    C      │  │
│  │ Earnings      │  CRUD │   R   │   -   │    -      │  │
│  │ Users         │  CRUD │   -   │   -   │    -      │  │
│  │ Dashboard     │   R   │   R   │   R   │    -      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Legend: C=Create, R=Read, U=Update, D=Delete, -=No Access │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoint Structure

```
/api
├── /auth
│   ├── POST   /register          # Register new user
│   ├── POST   /login             # User login
│   ├── GET    /me                # Get current user
│   ├── PUT    /change-password   # Change password
│   ├── GET    /users             # List users (admin)
│   ├── POST   /users             # Create user (admin)
│   ├── DELETE /users/:id         # Delete user (admin)
│   └── POST   /setup             # Initial admin setup
│
├── /properties
│   ├── GET    /                  # List properties
│   ├── POST   /                  # Create property
│   ├── GET    /:id               # Get property
│   ├── PUT    /:id               # Update property
│   ├── DELETE /:id               # Delete property
│   └── POST   /:id/images        # Add images
│
├── /owners
│   ├── GET    /                  # List owners
│   ├── POST   /                  # Create owner
│   ├── GET    /:id               # Get owner
│   ├── PUT    /:id               # Update owner
│   ├── DELETE /:id               # Delete owner
│   └── GET    /:id/dashboard     # Owner dashboard
│
├── /agents
│   ├── GET    /                  # List agents
│   ├── POST   /                  # Create agent
│   ├── GET    /:id               # Get agent
│   ├── PUT    /:id               # Update agent
│   ├── DELETE /:id               # Delete agent
│   └── GET    /:id/inquiries     # Agent inquiries
│
├── /inquiries
│   ├── GET    /                  # List inquiries
│   ├── POST   /                  # Create inquiry
│   ├── GET    /:id               # Get inquiry
│   ├── PUT    /:id/status        # Update status
│   ├── PUT    /:id/assign        # Assign to agent
│   ├── PUT    /:id/unassign      # Unassign agent
│   └── POST   /:id/log           # Add conversation log
│
├── /earnings
│   ├── GET    /                  # List earnings
│   ├── POST   /                  # Create earnings record
│   └── PUT    /:id/status        # Update payment status
│
├── /dashboard
│   └── GET    /stats             # Dashboard statistics
│
├── /upload
│   ├── POST   /                  # Upload single image
│   └── POST   /multiple          # Upload multiple images
│
└── /status
    ├── GET    /                  # Get status checks
    └── POST   /                  # Create status check
```

## Key Features

### 1. Multi-Role System
- **Admin**: Full system access
- **Owner**: View properties and earnings
- **Agent**: Manage assigned inquiries
- **Public**: Browse and submit inquiries

### 2. Property Management
- Support for rent, buy, and pre-occupied properties
- Image upload and management
- Owner linking
- Status tracking (active/inactive)

### 3. Inquiry Management
- Status workflow: new → assigned → talked → visit_scheduled → visit_completed → closed
- Agent assignment
- Conversation logging
- Inquiry tracking

### 4. Earnings Tracking
- Monthly earnings per owner
- Payment status (pending/paid)
- Earnings history
- Owner dashboard integration

### 5. Authentication & Security
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Protected routes on frontend

## File Structure

```
instamakaan/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── seed_data.py       # Database seeding script
│   ├── requirements.txt   # Python dependencies
│   ├── uploads/           # Uploaded images
│   └── venv/              # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── owner/     # Owner pages
│   │   │   ├── agent/      # Agent pages
│   │   │   └── auth/      # Auth pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   └── lib/           # Utilities
│   ├── package.json       # Node dependencies
│   └── craco.config.js    # Build configuration
│
├── DATA_MODEL.md          # Data model documentation
├── FLOW_DIAGRAM.md        # Flow diagrams
└── ARCHITECTURE_OVERVIEW.md # This file
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=instamakaan
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8001
```

## Deployment Considerations

1. **Database**: MongoDB instance (local or cloud)
2. **File Storage**: Consider cloud storage (S3, Cloudinary) for production
3. **Environment Variables**: Secure storage of secrets
4. **CORS**: Configure allowed origins for production
5. **JWT Secret**: Use strong, random secret in production
6. **HTTPS**: Enable SSL/TLS for production

## Development Workflow

1. **Backend**: Start FastAPI server (`uvicorn server:app --reload`)
2. **Frontend**: Start React dev server (`yarn start`)
3. **Database**: Seed with sample data (`python seed_data.py`)
4. **Testing**: Use API docs at `/docs` (Swagger UI)

## Future Enhancements

- Email notifications
- WhatsApp integration
- Payment gateway integration
- Advanced analytics
- Mobile app
- Real-time updates (WebSockets)
- Image optimization
- Search and filtering improvements

