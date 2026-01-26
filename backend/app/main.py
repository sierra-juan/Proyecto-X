import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from backend.app.database import engine, Base
from backend.app.models import User, Reminder, Activity, AIHistory
from backend.app.routes import reminders, agenda, summary, users, telegram

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Assistant API",
    description="API para asistente personal con integración de Telegram",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reminders.router)
app.include_router(agenda.router)
app.include_router(summary.router)
app.include_router(users.router)
app.include_router(telegram.router)

# Servir archivos estáticos del frontend
frontend_path = os.path.join(os.getcwd(), "frontend/out")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

@app.get("/api")
def root():
    return {
        "message": "Personal Assistant API",
        "docs": "/docs",
        "endpoints": {
            "reminders": "/api/reminders/{user_id}",
            "agenda": "/api/agenda/{user_id}",
            "summary": "/api/summary/{user_id}",
            "users": "/api/users",
            "telegram_webhook": "/api/telegram/webhook"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
