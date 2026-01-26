from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.schemas.schemas import UserCreate, UserResponse

from backend.app.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Only for admin? For now, just protect it
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify user ownership or admin
    if user_id != str(current_user.id) and user_id != current_user.supabase_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user = db.query(User).filter(
        (User.id == user_id) if user_id.isdigit() else (User.supabase_user_id == user_id)
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/telegram/{telegram_id}", response_model=UserResponse)
def get_user_by_telegram(telegram_id: str, db: Session = Depends(get_db)):
    # Telegram bot doesn't send JWT, maybe verify with a secret?
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Usually users are created via the Auth dependency now
    db_user = User(
        telegram_id=user.telegram_id,
        name=user.name,
        email=user.email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
