import os
import json
from fastapi import APIRouter, Request, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app.models.user import User
from backend.app.models.reminder import Reminder, ReactionStatus
from backend.app.models.activity import Activity
from backend.app.services.reminder_intelligence import ReminderIntelligence
from datetime import datetime, timedelta
import httpx

router = APIRouter(prefix="/api/telegram", tags=["telegram"])

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")

async def send_telegram_message(chat_id: int, text: str, reply_markup: dict = None):
    if not TELEGRAM_BOT_TOKEN:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload)

async def answer_callback_query(callback_query_id: str, text: str = None):
    if not TELEGRAM_BOT_TOKEN:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/answerCallbackQuery"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"callback_query_id": callback_query_id, "text": text})

def get_or_create_user(db: Session, telegram_id: str, name: str = None) -> User:
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        user = User(telegram_id=telegram_id, name=name)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/webhook")
async def telegram_webhook(request: Request):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    
    db = SessionLocal()
    try:
        # Handle Callback Queries (Button Reactions)
        if "callback_query" in data:
            callback = data["callback_query"]
            callback_id = callback["id"]
            chat_id = callback["message"]["chat"]["id"]
            data_parts = callback["data"].split(":")
            action = data_parts[0]
            reminder_id = int(data_parts[1])
            
            reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
            if not reminder:
                await answer_callback_query(callback_id, "Recordatorio no encontrado.")
                return {"ok": True}

            if action == "done":
                reminder.completed = True
                reminder.last_reaction_status = ReactionStatus.COMPLETED
                # Log structured activity
                activity = Activity(
                    user_id=reminder.user_id,
                    activity_type="completed_reminder",
                    description=f"Completó: {reminder.text}",
                    activity_date=datetime.now(),
                    reminder_id=reminder.id,
                    metadata_info={"reaction": "button_click", "timestamp": datetime.now().isoformat()}
                )
                db.add(activity)
                response = f"✅ ¡Excelente! He marcado '{reminder.text}' como completado."
            
            elif action == "snooze":
                reminder.reminder_time = datetime.now() + timedelta(minutes=20)
                reminder.last_reaction_status = ReactionStatus.SNOOZED
                response = f"⏳ Entendido. Te lo recordaré en 20 minutos."
            
            elif action == "ignore":
                reminder.last_reaction_status = ReactionStatus.IGNORED
                response = f"⏭️ Ok, lo saltaremos por ahora."

            db.commit()
            await answer_callback_query(callback_id)
            await send_telegram_message(chat_id, response)
            return {"ok": True}

        # Handle Regular Messages
        if "message" not in data:
            return {"ok": True}
        
        message = data["message"]
        chat_id = message["chat"]["id"]
        telegram_id = str(message["from"]["id"])
        user_name = message["from"].get("first_name", "User")
        text = message.get("text", "")
        
        user = get_or_create_user(db, telegram_id, user_name)
        
        if text.startswith("/start"):
            response = f"Hola {user_name}! Soy Tonalli AI. Mi objetivo es ayudarte a mantener tus hábitos.\n" \
                      f"Comandos:\n" \
                      f"/reminders - Ver tus recordatorios\n" \
                      f"/add <texto> - Agregar recordatorio\n" \
                      f"/help - Ver ayuda"
        
        elif text.startswith("/reminders"):
            reminders = db.query(Reminder).filter(
                Reminder.user_id == user.id,
                Reminder.completed == False
            ).all()
            if reminders:
                response = "Tus recordatorios pendientes:\n"
                for r in reminders:
                    response += f"- {r.text} ({r.reminder_time.strftime('%Y-%m-%d %H:%M')})\n"
                    # In a real scenario, we might trigger a notification with buttons here
            else:
                response = "No tienes recordatorios pendientes."
        
        elif text.startswith("/add "):
            reminder_text = text[5:].strip()
            if reminder_text:
                # Get dynamic tone
                streak = len(db.query(Activity).filter(Activity.user_id == user.id, Activity.activity_type == "completed_reminder").all())
                tone = await ReminderIntelligence.get_dynamic_tone(streak, 0, reminder_text)
                
                reminder = Reminder(
                    user_id=user.id,
                    text=reminder_text,
                    reminder_time=datetime.now() + timedelta(hours=1),
                    context_metadata={"initial_tone": tone}
                )
                db.add(reminder)
                db.commit()
                
                response = f"¡Listo! Recordatorio agregado: {reminder_text}\n\n{tone}"
                
                # Setup buttons for the 'reaction' (this would usually be sent later by a worker)
                reply_markup = {
                    "inline_keyboard": [[
                        {"text": "✅ Hecho", "callback_data": f"done:{reminder.id}"},
                        {"text": "⏳ +20m", "callback_data": f"snooze:{reminder.id}"},
                        {"text": "⏭️ Ignorar", "callback_data": f"ignore:{reminder.id}"}
                    ]]
                }
                await send_telegram_message(chat_id, response, reply_markup)
                return {"ok": True}
            else:
                response = "Por favor proporciona el texto del recordatorio. Uso: /add <texto>"
        
        elif text.startswith("/help"):
            response = "Comandos disponibles:\n" \
                      "/start - Iniciar el bot\n" \
                      "/reminders - Ver recordatorios pendientes\n" \
                      "/add <texto> - Agregar un nuevo recordatorio\n" \
                      "/help - Ver esta ayuda"
        
        else:
            response = "Comando no reconocido. Usa /help para ver los comandos disponibles."
        
        await send_telegram_message(chat_id, response)
        
    finally:
        db.close()
    
    return {"ok": True}

@router.get("/set-webhook")
async def set_webhook():
    if not TELEGRAM_BOT_TOKEN:
        return {"error": "TELEGRAM_BOT_TOKEN not configured"}
    
    replit_url = os.environ.get("REPLIT_DEV_DOMAIN", "")
    if not replit_url:
        return {"error": "REPLIT_DEV_DOMAIN not found"}
    
    webhook_url = f"https://{replit_url}/api/telegram/webhook"
    telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook"
    
    async with httpx.AsyncClient() as client:
        response = await client.post(telegram_url, json={"url": webhook_url})
        return response.json()
