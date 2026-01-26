# Personal Assistant - Replit Project

## Overview
Aplicacion de asistente personal con dos interfaces:
1. Bot de Telegram para interacciones rapidas
2. Dashboard web moderno para gestion completa

## Recent Changes
- 2026-01-22: Proyecto MVP completo creado con backend FastAPI y frontend Next.js
- 2026-01-22: Base de datos PostgreSQL configurada con tablas: users, reminders, activities, ai_history
- 2026-01-22: Frontend con paginas Home, Dashboard, Agenda, Settings funcionando
- 2026-01-24: Implementación de Autenticación con Supabase (Google OAuth)
- 2026-01-24: Implementación de Habit Tracker con gestión de recordatorios desde Dashboard
- 2026-01-24: Aislamiento de datos por usuario (Multi-tenancy) mediante JWT

## Project Architecture

### Backend (Python/FastAPI)
- Puerto: 8000 (dev) / 5000 (prod)
- Framework: FastAPI con SQLAlchemy
- Seguridad: JWT Auth (Supabase)
- Rutas: `/backend/app/routes/`
  - reminders.py - CRUD protegida
  - agenda.py - CRUD protegida
  - summary.py - Dashboard protegido
  - users.py - Perfil /me y protección de datos
  - telegram.py - Webhook del bot
- Auth: `/backend/app/auth.py`
- Modelos: `/backend/app/models/`
  - user.py (con supabase_user_id), reminder.py, activity.py, ai_history.py

### Frontend (Next.js/React)
- Puerto: 5000
- Framework: Next.js 16 con App Router
- Auth Library: `@supabase/supabase-js`
- Context: `/frontend/src/context/AuthContext.tsx`
- Paginas:
  - Home (/), Dashboard (/dashboard), Agenda (/agenda), Settings (/settings), Login (/login)
- Servicios: `/frontend/src/services/api.ts` (con interceptores JWT)

### Database Tables
- users: id, supabase_user_id (auth map), telegram_id, name, email, created_at, updated_at
- reminders: id, user_id (FK users.id), text, reminder_time, completed, created_at, updated_at

## Environment Variables (Secrets)
- `SUPABASE_JWT_SECRET`: Secreto para validar tokens en backend
- `SUPABASE_URL`: URL del proyecto Supabase
- `SUPABASE_ANON_KEY`: Llave pública de Supabase
- `DATABASE_URL`: Conexión a DB

## Deployment Decisions
- **Autoscale:** El backend sirve el frontend estático desde `frontend/out`.
- **Sync:** Deploy vía rama `feature/audit-habit-tracker-impl`.
