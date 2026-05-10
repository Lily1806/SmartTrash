import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base

class UserPoints(Base):
    __tablename__ = "user_points"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    points       = Column(Integer, nullable=False)
    action_type  = Column(String(50), nullable=False)  # 'CLASSIFY', 'LOG_WASTE', 'STREAK_BONUS'
    reference_id = Column(UUID(as_uuid=True))
    description  = Column(Text)
    created_at   = Column(DateTime, default=datetime.utcnow)
    user         = relationship("User", back_populates="points")

class Achievement(Base):
    __tablename__ = "achievements"
    id              = Column(Integer, primary_key=True)
    name            = Column(String(100), unique=True, nullable=False)
    description     = Column(Text)
    icon_url        = Column(String(500))
    required_points = Column(Integer, default=0)
    badge_type      = Column(String(20), default="BRONZE")
    created_at      = Column(DateTime, default=datetime.utcnow)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at      = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("user_id", "achievement_id"),)
