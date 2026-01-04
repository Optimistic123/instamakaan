# InstaMakaan - Data Model Documentation

## Overview
InstaMakaan is a property management platform built with FastAPI (backend) and React (frontend), using MongoDB as the database. The system manages properties, owners, agents, inquiries, and earnings.

## Database Collections

### 1. Users Collection
**Purpose**: Authentication and authorization for all system users

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `email` | String | User email address | Unique, Required |
| `name` | String | Full name | Required |
| `password_hash` | String | Bcrypt hashed password | Required |
| `role` | String | User role | Values: `admin`, `owner`, `agent` |
| `status` | String | Account status | Values: `active`, `inactive` |
| `linked_id` | String (UUID) | Links to owner_id or agent_id | Optional, Foreign Key |
| `created_at` | DateTime | Creation timestamp | Auto-generated |
| `updated_at` | DateTime | Last update timestamp | Auto-updated |

**Indexes**: `email` (unique)

**Relationships**:
- `linked_id` → `owners.id` (if role = "owner")
- `linked_id` → `agents.id` (if role = "agent")

---

### 2. Owners Collection
**Purpose**: Property owners who list their properties

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `name` | String | Owner name | Required |
| `email` | String | Contact email | Required |
| `phone` | String | Contact phone | Required |
| `address` | String | Physical address | Optional |
| `bank_details` | String | Banking information | Optional |
| `notes` | String | Additional notes | Optional |
| `status` | String | Owner status | Values: `active`, `inactive` |
| `created_at` | DateTime | Creation timestamp | Auto-generated |
| `updated_at` | DateTime | Last update timestamp | Auto-updated |

**Relationships**:
- One-to-Many with `properties` (via `owner_id`)
- One-to-Many with `earnings` (via `owner_id`)

---

### 3. Agents Collection
**Purpose**: Field agents who handle inquiries and property visits

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `name` | String | Agent name | Required |
| `email` | String | Contact email | Required |
| `phone` | String | Contact phone | Required |
| `designation` | String | Job title/designation | Default: "Field Agent" |
| `notes` | String | Additional notes | Optional |
| `status` | String | Agent status | Values: `active`, `inactive` |
| `total_inquiries_handled` | Integer | Count of assigned inquiries | Calculated |
| `created_at` | DateTime | Creation timestamp | Auto-generated |
| `updated_at` | DateTime | Last update timestamp | Auto-updated |

**Relationships**:
- One-to-Many with `inquiries` (via `assigned_agent_id`)

---

### 4. Properties Collection
**Purpose**: Property listings (rent, buy, pre-occupied)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `title` | String | Property title | Required |
| `property_type` | String | Type of property | Values: `rent`, `buy`, `pre-occupied` |
| `location` | String | Property location | Required |
| `sector` | String | Sector/area name | Optional |
| `price` | String | Display price | Required |
| `price_label` | String | Price label | Examples: "Full Flat Rent", "Per Bed Rent", "Price" |
| `description` | String | Detailed description | Required |
| `beds` | Integer | Number of bedrooms | Required |
| `baths` | Integer | Number of bathrooms | Required |
| `area` | String | Property area | Required |
| `features` | Array[String] | Property features | Optional |
| `amenities` | Array[String] | Building amenities | Optional |
| `furnishing` | String | Furnishing status | Values: `furnished`, `semi-furnished`, `unfurnished` |
| `preferred_tenant` | String | Tenant preference | Values: `family`, `bachelor`, `any` |
| `gender_preference` | String | Gender preference | Optional |
| `is_managed` | Boolean | Managed property flag | Default: false |
| `status` | String | Listing status | Values: `active`, `inactive` |
| `deposit` | String | Deposit amount/terms | Optional |
| `brokerage` | String | Brokerage terms | Optional |
| `images` | Array[String] | Image URLs | Optional |
| `owner_id` | String (UUID) | Owner reference | Optional, Foreign Key |
| `monthly_rent_amount` | Float | Monthly rent (for earnings) | Optional |
| `created_at` | DateTime | Creation timestamp | Auto-generated |
| `updated_at` | DateTime | Last update timestamp | Auto-updated |

**Indexes**: `property_type`, `status`, `owner_id`

**Relationships**:
- Many-to-One with `owners` (via `owner_id`)
- One-to-Many with `inquiries` (via `property_id`)
- One-to-Many with `earnings` (via `property_id`)

---

### 5. Inquiries Collection
**Purpose**: Customer inquiries about properties

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `name` | String | Customer name | Required |
| `phone` | String | Contact phone | Required |
| `email` | String | Contact email | Optional |
| `property_id` | String (UUID) | Related property | Optional, Foreign Key |
| `subject` | String | Inquiry subject | Optional |
| `message` | String | Inquiry message | Optional |
| `whatsapp_updates` | Boolean | WhatsApp consent | Default: false |
| `inquiry_type` | String | Type of inquiry | Values: `general`, `schedule_visit`, `price_inquiry`, `investment` |
| `status` | String | Inquiry status | Values: `new`, `assigned`, `talked`, `visit_scheduled`, `visit_completed`, `closed` |
| `assigned_agent_id` | String (UUID) | Assigned agent | Optional, Foreign Key |
| `assigned_agent_name` | String | Agent name (denormalized) | Optional |
| `conversation_logs` | Array[Object] | Conversation history | Optional |
| `created_at` | DateTime | Creation timestamp | Auto-generated |
| `updated_at` | DateTime | Last update timestamp | Auto-updated |

**Conversation Log Object**:
```json
{
  "timestamp": "DateTime",
  "agent_id": "String (UUID)",
  "agent_name": "String",
  "message": "String",
  "status_change": "String (optional)"
}
```

**Indexes**: `status`, `assigned_agent_id`, `property_id`, `inquiry_type`

**Relationships**:
- Many-to-One with `properties` (via `property_id`)
- Many-to-One with `agents` (via `assigned_agent_id`)

---

### 6. Earnings Collection
**Purpose**: Track monthly earnings for property owners

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `owner_id` | String (UUID) | Owner reference | Required, Foreign Key |
| `property_id` | String (UUID) | Property reference | Required, Foreign Key |
| `amount` | Float | Earnings amount | Required |
| `month` | String | Month in YYYY-MM format | Required |
| `description` | String | Earnings description | Optional |
| `status` | String | Payment status | Values: `pending`, `paid` |
| `created_at` | DateTime | Creation timestamp | Auto-generated |

**Indexes**: `owner_id`, `property_id`, `month`

**Relationships**:
- Many-to-One with `owners` (via `owner_id`)
- Many-to-One with `properties` (via `property_id`)

---

### 7. Status Checks Collection
**Purpose**: Health check and monitoring

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Unique identifier | Primary Key |
| `client_name` | String | Client identifier | Required |
| `timestamp` | DateTime | Check timestamp | Auto-generated |

---

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│─────────────│
│ id (PK)     │
│ email       │◄────────┐
│ name        │         │
│ role        │         │
│ linked_id   │─────────┼──┐
│ status      │         │  │
└─────────────┘         │  │
                        │  │
┌─────────────┐         │  │
│   Owners    │         │  │
│─────────────│         │  │
│ id (PK)     │◄────────┘  │
│ name        │            │
│ email       │            │
│ phone       │            │
│ status      │            │
└─────────────┘            │
      │                    │
      │ 1:N                │
      │                    │
      ▼                    │
┌─────────────┐            │
│ Properties  │            │
│─────────────│            │
│ id (PK)     │            │
│ owner_id(FK)│────────────┘
│ title       │
│ type        │
│ status      │
│ images[]    │
└─────────────┘
      │
      │ 1:N
      │
      ▼
┌─────────────┐
│  Inquiries  │
│─────────────│
│ id (PK)     │
│ property_id │
│ agent_id(FK)│──┐
│ name        │  │
│ status      │  │
│ logs[]      │  │
└─────────────┘  │
                 │
                 │ N:1
                 │
      ┌──────────┘
      │
      ▼
┌─────────────┐
│   Agents    │
│─────────────│
│ id (PK)     │
│ name        │
│ email       │
│ phone       │
│ status      │
└─────────────┘

┌─────────────┐
│  Earnings   │
│─────────────│
│ id (PK)     │
│ owner_id(FK)│──┐
│ property_id │  │
│ amount      │  │
│ month       │  │
│ status      │  │
└─────────────┘  │
                 │
                 │ N:1
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌─────────────┐    ┌─────────────┐
│   Owners    │    │ Properties  │
│             │    │             │
└─────────────┘    └─────────────┘
```

## Data Flow Summary

1. **User Registration/Login**: Creates/authenticates `users` record
2. **Owner Management**: Admin creates `owners`, can link to `users`
3. **Agent Management**: Admin creates `agents`, can link to `users`
4. **Property Listing**: Admin/Owner creates `properties` linked to `owners`
5. **Inquiry Creation**: Public users create `inquiries` (optionally linked to `properties`)
6. **Inquiry Assignment**: Admin assigns `inquiries` to `agents`
7. **Conversation Logging**: Agents add logs to `inquiries.conversation_logs`
8. **Earnings Tracking**: System creates `earnings` records for owner payments

## Key Design Decisions

1. **Denormalization**: `assigned_agent_name` stored in `inquiries` for faster queries
2. **Linked Users**: `users.linked_id` connects user accounts to owner/agent records
3. **Status Workflow**: Inquiries follow a status workflow: `new` → `assigned` → `talked` → `visit_scheduled` → `visit_completed` → `closed`
4. **Earnings Tracking**: Monthly earnings tracked separately for reporting and payment management
5. **Conversation Logs**: Embedded array in inquiries for audit trail

