from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class WasteLogCreate(BaseModel):
    category_id: int
    classification_id: Optional[UUID] = None
    location_id: Optional[int] = None
    quantity_kg: Optional[float] = None
    notes: Optional[str] = None

class WasteLogResponse(BaseModel):
    id: UUID
    category_id: int
    quantity_kg: Optional[float]
    notes: Optional[str]
    logged_at: datetime
    class Config:
        from_attributes = True
