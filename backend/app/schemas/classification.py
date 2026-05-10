from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class ClassificationResponse(BaseModel):
    id: UUID
    image_url: str
    predicted_category: Optional[int]
    category_name: Optional[str]
    category_code: Optional[str]
    confidence_score: Optional[float]
    tips: Optional[str]
    classified_at: datetime
    class Config:
        from_attributes = True
