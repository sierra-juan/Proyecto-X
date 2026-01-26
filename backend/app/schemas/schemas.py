from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    telegram_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReminderBase(BaseModel):
    text: str
    reminder_time: datetime

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    text: Optional[str] = None
    reminder_time: Optional[datetime] = None
    completed: Optional[bool] = None
    last_reaction_status: Optional[str] = None
    context_metadata: Optional[dict] = None

class ReminderResponse(ReminderBase):
    id: int
    user_id: int
    completed: bool
    last_reaction_status: str
    context_metadata: Optional[dict] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    activity_type: str
    description: Optional[str] = None
    activity_date: datetime
    reminder_id: Optional[int] = None
    metadata_info: Optional[dict] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AIHistoryBase(BaseModel):
    prompt: str
    response: str

class AIHistoryCreate(AIHistoryBase):
    pass

class AIHistoryResponse(AIHistoryBase):
    id: int
    user_id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

class SummaryResponse(BaseModel):
    total_reminders: int
    completed_reminders: int
    pending_reminders: int
    total_activities: int
    recent_activities: list[ActivityResponse]
    recent_reminders: list[ReminderResponse]
