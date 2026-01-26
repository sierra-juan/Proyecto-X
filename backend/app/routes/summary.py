from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.reminder import Reminder
from backend.app.models.activity import Activity
from backend.app.schemas.schemas import SummaryResponse, ActivityResponse, ReminderResponse

from backend.app.auth import get_current_user
from backend.app.models.user import User
from fastapi import HTTPException

router = APIRouter(prefix="/api/summary", tags=["summary"])

@router.get("/{user_id}", response_model=SummaryResponse)
def get_summary(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify user ownership
    if user_id != str(current_user.id) and user_id != current_user.supabase_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this summary")

    total_reminders = db.query(Reminder).filter(Reminder.user_id == current_user.id).count()
    completed_reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id, 
        Reminder.completed == True
    ).count()
    pending_reminders = total_reminders - completed_reminders
    
    total_activities = db.query(Activity).filter(Activity.user_id == current_user.id).count()
    
    recent_activities = db.query(Activity).filter(
        Activity.user_id == current_user.id
    ).order_by(Activity.activity_date.desc()).limit(5).all()
    
    recent_reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id
    ).order_by(Reminder.reminder_time.desc()).limit(5).all()
    
    return SummaryResponse(
        total_reminders=total_reminders,
        completed_reminders=completed_reminders,
        pending_reminders=pending_reminders,
        total_activities=total_activities,
        recent_activities=[ActivityResponse.model_validate(a) for a in recent_activities],
        recent_reminders=[ReminderResponse.model_validate(r) for r in recent_reminders]
    )
