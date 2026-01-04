# InstaMakaan - Application Flow Diagrams

## Overview
InstaMakaan is a property management platform with three main user roles: **Admin**, **Owner**, and **Agent**, plus **Public Users** who browse properties.

---

## 1. Authentication Flow

```
┌─────────────┐
│   Public    │
│    User     │
└──────┬──────┘
       │
       │ 1. Navigate to /auth/login
       ▼
┌─────────────────┐
│   Login Page    │
└──────┬──────────┘
       │
       │ 2. Enter email/password
       │ 3. POST /api/auth/login
       ▼
┌─────────────────┐
│   Backend API   │
│  (FastAPI)      │
└──────┬──────────┘
       │
       │ 4. Validate credentials
       │ 5. Generate JWT token
       │
       ▼
┌─────────────────┐
│  JWT Token +    │
│  User Info      │
└──────┬──────────┘
       │
       │ 6. Store token in localStorage
       │ 7. Redirect based on role
       │
       ▼
┌─────────────────────────────────────┐
│         Role-Based Redirect          │
├─────────────────────────────────────┤
│ • admin  → /admin                   │
│ • owner  → /owner                   │
│ • agent  → /agent                   │
└─────────────────────────────────────┘
```

---

## 2. Public User Flow

```
┌─────────────┐
│   Public    │
│    User     │
└──────┬──────┘
       │
       │ Browse public pages
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│  Home Page   │              │ Properties Page  │
│   (/)        │              │  (/properties)   │
└──────┬───────┘              └────────┬─────────┘
       │                                │
       │ • Hero Section                 │ • View all properties
       │ • Property Highlights          │ • Filter by type
       │ • Company Info                 │ • Search properties
       │ • Testimonials                 │
       │                                │
       │                                ▼
       │                       ┌──────────────────┐
       │                       │ Property Detail  │
       │                       │  (/property/:id) │
       │                       └────────┬─────────┘
       │                                │
       │                                │ View details:
       │                                │ • Images
       │                                │ • Features
       │                                │ • Location
       │                                │ • Price
       │                                │
       │                                ▼
       │                       ┌──────────────────┐
       │                       │  Contact Form    │
       │                       │  (Inquiry)       │
       │                       └────────┬─────────┘
       │                                │
       │                                │ Submit inquiry
       │                                │ POST /api/inquiries
       │                                │
       │                                ▼
       │                       ┌──────────────────┐
       │                       │  Inquiry Created │
       │                       │  Status: "new"   │
       │                       └──────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│         Other Public Pages                  │
├─────────────────────────────────────────────┤
│ • /about      - About Us                    │
│ • /partner    - Partner Program             │
│ • /blog       - Blog                        │
│ • /refer      - Referral Program            │
│ • /faq        - FAQ                         │
│ • /contact    - Contact Us                  │
└─────────────────────────────────────────────┘
```

---

## 3. Admin Flow

```
┌─────────────┐
│    Admin    │
│    User     │
└──────┬──────┘
       │
       │ Login → /admin
       │
       ▼
┌─────────────────┐
│  Admin Dashboard│
│   (/admin)      │
└──────┬──────────┘
       │
       │ View:
       │ • Total Properties
       │ • Active Properties
       │ • Total Inquiries
       │ • New Inquiries
       │ • Total Owners/Agents
       │ • Properties by Type
       │
       ├──────────────────────────────────────────────────┐
       │                                                  │
       ▼                                                  ▼
┌─────────────────┐                            ┌─────────────────┐
│  Properties     │                            │   Inquiries     │
│  Management     │                            │   Management    │
│  (/admin/       │                            │  (/admin/       │
│   properties)   │                            │   inquiries)    │
└──────┬──────────┘                            └────────┬────────┘
       │                                                 │
       │ • List all properties                          │ • List all inquiries
       │ • Create new property                          │ • Filter by status
       │ • Edit property                                │ • Assign to agent
       │ • Upload images                                │ • View conversation logs
       │ • Link to owner                                │ • Update status
       │                                                 │
       │                                                 │
       ├─────────────────────────────────────────────────┤
       │                                                 │
       ▼                                                 ▼
┌─────────────────┐                            ┌─────────────────┐
│  Owners         │                            │   Agents        │
│  Management     │                            │   Management    │
│  (/admin/       │                            │  (/admin/        │
│   owners)       │                            │   agents)       │
└──────┬──────────┘                            └────────┬────────┘
       │                                                 │
       │ • List all owners                              │ • List all agents
       │ • Create owner                                 │ • Create agent
       │ • View owner dashboard                         │ • View agent inquiries
       │ • Link user account                            │ • Link user account
       │ • Update owner info                            │ • Update agent info
       │                                                 │
       │                                                 │
       ▼                                                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Owner Dashboard View                           │
│         (/admin/owners/:ownerId/dashboard)                 │
│                                                             │
│ • Owner details                                             │
│ • Total properties                                          │
│ • Active properties                                         │
│ • Total earnings                                            │
│ • Monthly earnings                                          │
│ • Properties list                                           │
│ • Earnings history                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Owner Flow

```
┌─────────────┐
│    Owner    │
│    User     │
└──────┬──────┘
       │
       │ Login → /owner
       │
       ▼
┌─────────────────┐
│ Owner Dashboard │
│   (/owner)      │
└──────┬──────────┘
       │
       │ View:
       │ • My Properties
       │ • Total Earnings
       │ • Current Month Earnings
       │ • Earnings History
       │ • Property Statistics
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────────┐        ┌─────────────────┐
│  My Properties  │        │    Earnings     │
│  (/owner/       │        │  (/owner/       │
│   properties)   │        │   earnings)     │
└──────┬──────────┘        └────────┬────────┘
       │                            │
       │ • View my properties       │ • View earnings history
       │ • Property details         │ • Filter by month
       │ • Status (active/inactive) │ • Payment status
       │ • Monthly rent amount      │ • Total earnings
       │                            │
       │                            │
       └────────────────────────────┘
```

**Note**: Owners can view their properties and earnings, but property creation/editing is typically done by Admin.

---

## 5. Agent Flow

```
┌─────────────┐
│    Agent    │
│    User     │
└──────┬──────┘
       │
       │ Login → /agent
       │
       ▼
┌─────────────────┐
│ Agent Dashboard │
│   (/agent)      │
└──────┬──────────┘
       │
       │ View:
       │ • Assigned Inquiries
       │ • Inquiry Status Counts
       │ • Recent Conversations
       │
       │
       ▼
┌─────────────────────────────────────┐
│      Inquiry Management             │
│                                     │
│ For each assigned inquiry:          │
│                                     │
│ 1. View Inquiry Details             │
│    • Customer info                  │
│    • Property details              │
│    • Current status                │
│                                     │
│ 2. Update Status                    │
│    • new → assigned                │
│    • assigned → talked              │
│    • talked → visit_scheduled       │
│    • visit_scheduled → visit_completed│
│    • visit_completed → closed      │
│                                     │
│ 3. Add Conversation Log              │
│    • Record call notes              │
│    • Update status                  │
│    • Track interactions             │
│                                     │
│ 4. View Conversation History        │
│    • All previous logs              │
│    • Status changes                 │
│    • Agent notes                    │
└─────────────────────────────────────┘
```

---

## 6. Inquiry Lifecycle Flow

```
┌─────────────────┐
│  Public User    │
│  Creates        │
│  Inquiry        │
└────────┬────────┘
         │
         │ POST /api/inquiries
         │ Status: "new"
         │
         ▼
┌─────────────────┐
│   New Inquiry   │
│   (Unassigned)  │
└────────┬────────┘
         │
         │ Admin assigns to agent
         │ PUT /api/inquiries/:id/assign
         │
         ▼
┌─────────────────┐
│ Assigned Inquiry│
│ Status: "assigned"
│ assigned_agent_id set
└────────┬────────┘
         │
         │ Agent contacts customer
         │ POST /api/inquiries/:id/log
         │
         ▼
┌─────────────────┐
│  Talked Status  │
│ Status: "talked"
│ Log entry added
└────────┬────────┘
         │
         │ Schedule site visit
         │ POST /api/inquiries/:id/log
         │
         ▼
┌─────────────────┐
│ Visit Scheduled │
│ Status: "visit_scheduled"
│ Log entry added
└────────┬────────┘
         │
         │ Visit completed
         │ POST /api/inquiries/:id/log
         │
         ▼
┌─────────────────┐
│ Visit Completed │
│ Status: "visit_completed"
│ Log entry added
└────────┬────────┘
         │
         │ Deal closed or inquiry closed
         │ POST /api/inquiries/:id/log
         │
         ▼
┌─────────────────┐
│  Closed Inquiry │
│ Status: "closed"
│ Final log entry
└─────────────────┘
```

---

## 7. Property Creation Flow

```
┌─────────────┐
│    Admin    │
└──────┬──────┘
       │
       │ Navigate to /admin/properties/new
       │
       ▼
┌─────────────────┐
│ Property Form   │
│  Page           │
└──────┬──────────┘
       │
       │ Fill form:
       │ • Basic Info (title, type, location)
       │ • Property Details (beds, baths, area)
       │ • Pricing (price, deposit, brokerage)
       │ • Features & Amenities
       │ • Owner Selection
       │ • Images Upload
       │
       │
       ▼
┌─────────────────┐
│ Upload Images   │
│ POST /api/upload│
│ (multiple)      │
└──────┬──────────┘
       │
       │ Get image URLs
       │
       ▼
┌─────────────────┐
│ Create Property │
│ POST /api/      │
│ properties      │
└──────┬──────────┘
       │
       │ Property created
       │ Status: "active"
       │ owner_id linked
       │
       ▼
┌─────────────────┐
│ Property Listed │
│ Available on    │
│ /properties     │
└─────────────────┘
```

---

## 8. Earnings Tracking Flow

```
┌─────────────┐
│    Admin    │
│  (or System)│
└──────┬──────┘
       │
       │ Create earnings record
       │ POST /api/earnings
       │
       ▼
┌─────────────────┐
│ Earnings Record │
│ • owner_id      │
│ • property_id   │
│ • amount        │
│ • month (YYYY-MM)│
│ • status: "pending"
└──────┬──────────┘
       │
       │ Owner payment received
       │ PUT /api/earnings/:id/status
       │
       ▼
┌─────────────────┐
│ Status Updated   │
│ status: "paid"    │
└──────┬──────────┘
       │
       │ Owner views dashboard
       │ GET /api/owners/:id/dashboard
       │
       ▼
┌─────────────────┐
│ Owner Dashboard  │
│ Shows:           │
│ • Total Earnings │
│ • Monthly Breakdown│
│ • Payment Status │
└─────────────────┘
```

---

## 9. User Management Flow

```
┌─────────────┐
│    Admin    │
└──────┬──────┘
       │
       │ Create user account
       │ POST /api/auth/users
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌─────────────────┐              ┌─────────────────┐
│  Owner Account  │              │  Agent Account  │
│                 │              │                 │
│ • email         │              │ • email         │
│ • password      │              │ • password      │
│ • role: "owner" │              │ • role: "agent" │
│ • linked_id:    │              │ • linked_id:    │
│   owner.id      │              │   agent.id      │
└─────────────────┘              └─────────────────┘
       │                                     │
       │                                     │
       ▼                                     ▼
┌─────────────────┐              ┌─────────────────┐
│ Owner can login │              │ Agent can login │
│ to /owner       │              │ to /agent       │
│ portal          │              │ portal          │
└─────────────────┘              └─────────────────┘
```

---

## 10. API Request Flow

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       │ HTTP Request
       │ (with JWT token if authenticated)
       │
       ▼
┌─────────────────┐
│  FastAPI Backend│
│  Middleware     │
└──────┬──────────┘
       │
       │ 1. CORS Check
       │ 2. JWT Validation (if protected)
       │ 3. Role Check (if role-based)
       │
       ▼
┌─────────────────┐
│  Route Handler  │
└──────┬──────────┘
       │
       │ Business Logic
       │
       ▼
┌─────────────────┐
│  MongoDB        │
│  Database       │
└──────┬──────────┘
       │
       │ Query/Update Data
       │
       ▼
┌─────────────────┐
│  Response       │
│  (JSON)         │
└──────┬──────────┘
       │
       │ Return to Frontend
       │
       ▼
┌─────────────────┐
│   UI Update     │
└─────────────────┘
```

---

## Key User Journeys

### Journey 1: Customer Finds Property
1. Browse `/properties`
2. Filter by type (rent/buy/pre-occupied)
3. View property details `/property/:id`
4. Submit inquiry form
5. Inquiry created with status "new"
6. Admin assigns to agent
7. Agent contacts customer
8. Site visit scheduled
9. Visit completed
10. Deal closed

### Journey 2: Owner Lists Property
1. Admin creates owner record
2. Admin creates property linked to owner
3. Property appears on public site
4. Inquiries come in
5. Properties generate earnings
6. Owner views dashboard to see earnings

### Journey 3: Agent Handles Inquiry
1. Admin assigns inquiry to agent
2. Agent logs into `/agent` portal
3. Views assigned inquiries
4. Contacts customer (adds log)
5. Updates status to "talked"
6. Schedules visit (updates status)
7. Completes visit (updates status)
8. Closes inquiry

---

## Security Flow

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       │ Contains JWT token?
       │
       ├─── No ───► Return 401 Unauthorized
       │
       ▼ Yes
┌─────────────────┐
│ Validate JWT    │
└──────┬──────────┘
       │
       │ Valid?
       │
       ├─── No ───► Return 401 Unauthorized
       │
       ▼ Yes
┌─────────────────┐
│ Check User Role  │
└──────┬──────────┘
       │
       │ Role allowed?
       │
       ├─── No ───► Return 403 Forbidden
       │
       ▼ Yes
┌─────────────────┐
│ Process Request  │
└─────────────────┘
```

---

## Summary

The InstaMakaan platform supports:
- **Public Users**: Browse properties, submit inquiries
- **Admins**: Full system management (properties, owners, agents, inquiries)
- **Owners**: View their properties and earnings
- **Agents**: Manage assigned inquiries and track conversations

All flows are secured with JWT authentication and role-based access control.

