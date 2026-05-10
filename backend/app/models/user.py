import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base

class Role(Base):
    __tablename__ = "roles"
    id          = Column(Integer, primary_key=True)
    name        = Column(String(50), unique=True, nullable=False)
    description = Column(String)
    created_at  = Column(DateTime, default=datetime.utcnow)
    users       = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email         = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name     = Column(String(150))
    avatar_url    = Column(String(500))
    role_id       = Column(Integer, ForeignKey("roles.id"), default=2)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    role            = relationship("Role", back_populates="users")
    classifications = relationship("Classification", back_populates="user")
    waste_logs      = relationship("WasteLog", back_populates="user")
    points          = relationship("UserPoints", back_populates="user")
