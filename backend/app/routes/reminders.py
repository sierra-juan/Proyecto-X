from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models.reminder import Reminder
from backend.app.schemas.schemas import ReminderCreate, ReminderUpdate, ReminderResponse
from backend.app.auth import get_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/api/reminders", tags=["reminders"])

@router.get("/{user_id}", response_model=List[ReminderResponse])
def get_reminders(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify user ownership - accept both numeric ID and Supabase UUID
    if user_id != str(current_user.id) and user_id != str(current_user.supabase_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access these reminders")
        
    reminders = db.query(Reminder).filter(Reminder.user_id == current_user.id).all()
    
    # Ensure Enum to string conversion
    return [
        ReminderResponse(
            id=r.id,
            user_id=r.user_id,
            text=r.text,
            reminder_time=r.reminder_time,
            completed=r.completed,
            last_reaction_status=r.last_reaction_status.value if hasattr(r.last_reaction_status, 'value') else str(r.last_reaction_status),
            context_metadata=r.context_metadata,
            created_at=r.created_at
        ) for r in reminders
    ]

@router.post("/{user_id}", response_model=ReminderResponse)
def create_reminder(user_id: str, reminder: ReminderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Accept either the numeric ID or the Supabase UUID
    if user_id != str(current_user.id) and user_id != str(current_user.supabase_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to create reminders for this user")

    db_reminder = Reminder(
        user_id=current_user.id,
        text=reminder.text,
        reminder_time=reminder.reminder_time,
        last_reaction_status="pending" # Ensure it matches Enum
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    # Manual mapping to ensure Enum to string conversion for Pydantic
    return ReminderResponse(
        id=db_reminder.id,
        user_id=db_reminder.user_id,
        text=db_reminder.text,
        reminder_time=db_reminder.reminder_time,
        completed=db_reminder.completed,
        last_reaction_status=db_reminder.last_reaction_status.value if hasattr(db_reminder.last_reaction_status, 'value') else str(db_reminder.last_reaction_status),
        context_metadata=db_reminder.context_metadata,
        created_at=db_reminder.created_at
    )

@router.put("/{user_id}/{reminder_id}", response_model=ReminderResponse)
def update_reminder(user_id: str, reminder_id: int, reminder: ReminderUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Accept either the numeric ID or the Supabase UUID
    if user_id != str(current_user.id) and user_id != str(current_user.supabase_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to update this reminder")

    db_reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id, 
        Reminder.user_id == current_user.id
    ).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    if reminder.text is not None:
        db_reminder.text = reminder.text
    if reminder.reminder_time is not None:
        db_reminder.reminder_time = reminder.reminder_time
    if reminder.completed is not None:
        db_reminder.completed = reminder.completed
    if reminder.last_reaction_status is not None:
        db_reminder.last_reaction_status = reminder.last_reaction_status
    
    db.commit()
    db.refresh(db_reminder)
    
    return ReminderResponse(
        id=db_reminder.id,
        user_id=db_reminder.user_id,
        text=db_reminder.text,
        reminder_time=db_reminder.reminder_time,
        completed=db_reminder.completed,
        last_reaction_status=db_reminder.last_reaction_status.value if hasattr(db_reminder.last_reaction_status, 'value') else str(db_reminder.last_reaction_status),
        context_metadata=db_reminder.context_metadata,
        created_at=db_reminder.created_at
    )

@router.delete("/{user_id}/{reminder_id}")
def delete_reminder(user_id: str, reminder_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Accept either the numeric ID or the Supabase UUID
    if user_id != str(current_user.id) and user_id != str(current_user.supabase_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this reminder")

    db_reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id, 
        Reminder.user_id == current_user.id
    ).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    db.delete(db_reminder)
    db.commit()
    return {"message": "Reminder deleted successfully"}
