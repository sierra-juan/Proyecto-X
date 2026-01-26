# Architecture Document - Personal Assistant

## System Overview

Personal Assistant is a bilingual (Spanish) task management application with dual interfaces:
1. **Telegram Bot** - For quick mobile interactions
2. **Web Dashboard** - For comprehensive task management

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
├─────────────────────────────────┬───────────────────────────────────────┤
│         Telegram App            │           Web Browser                  │
│    (Mobile/Desktop Client)      │      (Next.js Frontend)               │
└────────────┬────────────────────┴──────────────────┬────────────────────┘
             │                                        │
             │ Telegram Bot API                       │ HTTP/REST
             │ (Webhook)                              │ Port 8000 (dev) / 5000 (prod)
             ▼                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI)                                │
│                    Port 8000 (dev) / 5000 (prod)                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   /api/      │  │   /api/      │  │   /api/      │  │   /api/     │ │
│  │  telegram    │  │  reminders   │  │   agenda     │  │   users     │ │
│  │   webhook    │  │    CRUD      │  │    CRUD      │  │    CRUD     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      SQLAlchemy ORM                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
             │
             │ SQL Queries
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐       │
│  │   users   │  │ reminders  │  │ activities │  │  ai_history  │       │
│  │           │  │            │  │            │  │              │       │
│  │ id (PK)   │  │ id (PK)    │  │ id (PK)    │  │ id (PK)      │       │
│  │ telegram  │  │ user_id(FK)│  │ user_id(FK)│  │ user_id (FK) │       │
│  │ name      │  │ text       │  │ type       │  │ prompt       │       │
│  │ email     │  │ time       │  │ desc       │  │ response     │       │
│  │ created   │  │ completed  │  │ date       │  │ timestamp    │       │
│  └───────────┘  └────────────┘  └────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Backend (Python/FastAPI)

**Location:** `/backend/app/`

| Component | File | Purpose |
|-----------|------|---------|
| Entry Point | `main.py` | FastAPI app initialization, CORS, router mounting |
| Database | `database.py` | SQLAlchemy engine, session management |
| Models | `models/*.py` | ORM models for all entities |
| Routes | `routes/*.py` | API endpoint handlers |
| Schemas | `schemas/schemas.py` | Pydantic validation models |

**API Routes:**
- `/api/users` - User management
- `/api/reminders/{user_id}` - Reminder CRUD operations
- `/api/agenda/{user_id}` - Activity/calendar management
- `/api/summary/{user_id}` - User dashboard data
- `/api/telegram/webhook` - Telegram bot message handler

### Frontend (Next.js/React)

**Location:** `/frontend/src/`

| Component | Path | Purpose |
|-----------|------|---------|
| Pages | `app/` | Next.js App Router pages |
| UI Components | `components/ui/` | Reusable Button, Card, Input, Modal, Tabs |
| Layout | `components/layout/` | Navbar, Sidebar, Footer |
| API Client | `services/api.ts` | Axios HTTP client for backend |

**Pages:**
- `/` - Home/Landing page
- `/dashboard` - Main user dashboard
- `/agenda` - Calendar/activity view
- `/settings` - User preferences

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    email VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    text TEXT NOT NULL,
    reminder_time TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR NOT NULL,
    description TEXT,
    activity_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI History table
CREATE TABLE ai_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    prompt TEXT,
    response TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## Data Flow

### Web Dashboard Flow
```
User Action → Next.js Page → API Service (Axios) → FastAPI → SQLAlchemy → PostgreSQL
                                                              ↓
User View   ← React State  ← JSON Response     ← FastAPI ← SQLAlchemy
```

### Telegram Bot Flow
```
User Message → Telegram Server → Webhook POST → /api/telegram/webhook
                                                        ↓
                                              Parse Command
                                                        ↓
                                              Execute Action (CRUD)
                                                        ↓
User Response ← Telegram Server ← Bot Reply   ← FastAPI Response
```

## Security Considerations

### Current Implementation
- Data **intended** to be filtered by `user_id` for isolation (NOT enforced - see limitations)
- CORS enabled for frontend origin
- Environment variables for sensitive data (DATABASE_URL, TELEGRAM_BOT_TOKEN)

### Known Limitations (To Audit - CRITICAL)
- **No Authentication:** Frontend uses hardcoded `userId=1`
- **No Authorization:** API endpoints don't verify user ownership
- **No Rate Limiting:** API endpoints unprotected from abuse
- **No Input Sanitization:** Potential XSS/injection vulnerabilities

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Backend Runtime | Python | 3.11 |
| Backend Framework | FastAPI | Latest |
| ORM | SQLAlchemy | Latest |
| Database | PostgreSQL | 16 |
| Frontend Runtime | Node.js | 20 |
| Frontend Framework | Next.js | 16.x |
| UI Library | React | 18 |
| Styling | Tailwind CSS | 3.x |
| HTTP Client | Axios | Latest |
| Bot Library | python-telegram-bot | Latest |

## Deployment Architecture

### Development
- Backend: Port 8000 (uvicorn with --reload)
- Frontend: Port 5000 (Next.js dev server)
- Both run in parallel via Replit workflows

### Production (Replit Autoscale)
- Backend only: Port 5000 (uvicorn production mode)
- Command: `python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 5000`
- Frontend: Requires separate static build deployment or integration into backend

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| PostgreSQL over SQLite | Scalability, concurrent access, production-ready |
| FastAPI over Flask | Async support, automatic OpenAPI docs, type hints |
| Next.js over React SPA | SSR capability, better SEO, file-based routing |
| Tailwind CSS | Rapid prototyping, consistent styling, small bundle |
| Separated backend/frontend | Independent scaling, clear separation of concerns |
| user_id filtering | Intended multi-tenant data isolation (not enforced without auth) |
