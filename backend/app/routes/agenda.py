from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models.activity import Activity
from backend.app.schemas.schemas import ActivityCreate, ActivityResponse

from backend.app.auth import get_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/api/agenda", tags=["agenda"])

@router.get("/{user_id}", response_model=List[ActivityResponse])
def get_activities(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_id != str(current_user.id) and user_id != current_user.supabase_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this agenda")

    activities = db.query(Activity).filter(Activity.user_id == current_user.id).order_by(Activity.activity_date.desc()).all()
    return activities

@router.post("/{user_id}", response_model=ActivityResponse)
def create_activity(user_id: str, activity: ActivityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_id != str(current_user.id) and user_id != current_user.supabase_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to create activities for this user")

    db_activity = Activity(
        user_id=current_user.id,
        activity_type=activity.activity_type,
        description=activity.description,
        activity_date=activity.activity_date
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/{user_id}/{activity_id}")
def delete_activity(user_id: str, activity_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_id != str(current_user.id) and user_id != current_user.supabase_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this activity")

    db_activity = db.query(Activity).filter(
        Activity.id == activity_id,
        Activity.user_id == current_user.id
    ).first()
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(db_activity)
    db.commit()
    return {"message": "Activity deleted successfully"}
