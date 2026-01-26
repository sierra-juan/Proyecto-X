# Personal Assistant

Aplicacion de asistente personal con doble interfaz: Bot de Telegram y Dashboard web moderno.

## Arquitectura

```
├── backend/
│   └── app/
│       ├── main.py          # FastAPI application
│       ├── database.py      # Database configuration
│       ├── models/          # SQLAlchemy models
│       │   ├── user.py
│       │   ├── reminder.py
│       │   ├── activity.py
│       │   └── ai_history.py
│       ├── routes/          # API endpoints
│       │   ├── reminders.py
│       │   ├── agenda.py
│       │   ├── summary.py
│       │   ├── users.py
│       │   └── telegram.py
│       └── schemas/         # Pydantic schemas
│           └── schemas.py
├── frontend/
│   └── src/
│       ├── app/             # Next.js pages
│       │   ├── page.tsx     # Home
│       │   ├── dashboard/
│       │   ├── agenda/
│       │   └── settings/
│       ├── components/
│       │   ├── ui/          # Reusable UI components
│       │   └── layout/      # Layout components
│       ├── services/        # API services
│       └── styles/          # CSS styles
└── README.md
```

## Tecnologias

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- python-telegram-bot

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Axios

## Endpoints API

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/{user_id}` - Obtener usuario
- `POST /api/users` - Crear usuario

### Recordatorios
- `GET /api/reminders/{user_id}` - Listar recordatorios
- `POST /api/reminders/{user_id}` - Crear recordatorio
- `PUT /api/reminders/{user_id}/{reminder_id}` - Actualizar recordatorio
- `DELETE /api/reminders/{user_id}/{reminder_id}` - Eliminar recordatorio

### Agenda
- `GET /api/agenda/{user_id}` - Listar actividades
- `POST /api/agenda/{user_id}` - Crear actividad
- `DELETE /api/agenda/{user_id}/{activity_id}` - Eliminar actividad

### Resumen
- `GET /api/summary/{user_id}` - Obtener resumen del usuario

### Telegram
- `POST /api/telegram/webhook` - Webhook para mensajes de Telegram
- `GET /api/telegram/set-webhook` - Configurar webhook

## Integracion Telegram

1. Crear un bot en Telegram con @BotFather
2. Obtener el token del bot
3. Configurar la variable de entorno `TELEGRAM_BOT_TOKEN`
4. Visitar `/api/telegram/set-webhook` para registrar el webhook

### Comandos del Bot
- `/start` - Iniciar el bot
- `/reminders` - Ver recordatorios pendientes
- `/add <texto>` - Agregar nuevo recordatorio
- `/help` - Ver ayuda

## Variables de Entorno

| Variable | Descripcion |
|----------|-------------|
| DATABASE_URL | URL de conexion a PostgreSQL |
| TELEGRAM_BOT_TOKEN | Token del bot de Telegram |

## Ejecucion

El proyecto esta configurado para ejecutarse automaticamente en Replit:
- Backend: Puerto 8000
- Frontend: Puerto 5000 (URL publica)

## Estructura para UI/UX

Los archivos que un disenador puede modificar estan organizados en:
- `frontend/src/components/ui/` - Componentes reutilizables
- `frontend/src/styles/` - Estilos globales y tema

## Base de Datos

El sistema usa PostgreSQL con las siguientes tablas:
- `users` - Usuarios del sistema
- `reminders` - Recordatorios
- `activities` - Actividades de agenda
- `ai_history` - Historial de conversaciones con IA

Todos los datos estan filtrados por `user_id` para garantizar privacidad.
