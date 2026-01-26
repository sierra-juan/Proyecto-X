from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from backend.app.database import Base

class ReactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    DELAYED = "delayed"
    IGNORED = "ignored"
    SNOOZED = "snoozed"

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    text = Column(String, nullable=False)
    reminder_time = Column(DateTime(timezone=True), nullable=False)
    completed = Column(Boolean, default=False)
    last_reaction_status = Column(Enum(ReactionStatus), default=ReactionStatus.PENDING)
    context_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="reminders")
