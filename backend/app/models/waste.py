import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, Numeric, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base

class WasteCategory(Base):
    __tablename__ = "waste_categories"
    id          = Column(Integer, primary_key=True)
    name        = Column(String(100), unique=True, nullable=False)
    code        = Column(String(20), unique=True, nullable=False)
    description = Column(Text)
    color_hex   = Column(String(7))
    icon_url    = Column(String(500))
    tips        = Column(Text)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

class Location(Base):
    __tablename__ = "locations"
    id          = Column(Integer, primary_key=True)
    name        = Column(String(200), nullable=False)
    address     = Column(String(300))
    latitude    = Column(Numeric(10, 8))
    longitude   = Column(Numeric(11, 8))
    category_id = Column(Integer, ForeignKey("waste_categories.id"))
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

class WasteLog(Base):
    __tablename__ = "waste_logs"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id           = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    classification_id = Column(UUID(as_uuid=True), ForeignKey("classifications.id"))
    category_id       = Column(Integer, ForeignKey("waste_categories.id"), nullable=False)
    location_id       = Column(Integer, ForeignKey("locations.id"))
    quantity_kg       = Column(Numeric(8, 3))
    notes             = Column(Text)
    logged_at         = Column(DateTime, default=datetime.utcnow)

    user     = relationship("User", back_populates="waste_logs")
    category = relationship("WasteCategory")
