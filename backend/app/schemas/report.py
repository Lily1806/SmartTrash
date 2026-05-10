from pydantic import BaseModel
from typing import Dict, Any

class StatsResponse(BaseModel):
    total_classifications: int
    total_waste_logs: int
    total_points: int
    by_category: Dict[str, Any]
