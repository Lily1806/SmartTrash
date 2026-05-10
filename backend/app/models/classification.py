import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, Numeric, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base

class Classification(Base):
    __tablename__ = "classifications"
    id                 = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id            = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    image_url          = Column(String(500), nullable=False)
    predicted_category = Column(Integer, ForeignKey("waste_categories.id"))
    confidence_score   = Column(Numeric(5, 4))
    is_correct         = Column(Boolean)
    user_feedback      = Column(Text)
    processing_time_ms = Column(Integer)
    classified_at      = Column(DateTime, default=datetime.utcnow)

    user     = relationship("User", back_populates="classifications")
    category = relationship("WasteCategory")
