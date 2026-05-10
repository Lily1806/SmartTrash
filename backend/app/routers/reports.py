from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.classification import Classification
from app.models.waste import WasteLog, WasteCategory
from app.models.gamification import UserPoints

router = APIRouter()

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_classifications = db.query(Classification).filter(
        Classification.user_id == current_user.id
    ).count()

    total_logs = db.query(WasteLog).filter(
        WasteLog.user_id == current_user.id
    ).count()

    total_points = db.query(func.sum(UserPoints.points)).filter(
        UserPoints.user_id == current_user.id
    ).scalar() or 0

    total_kg = db.query(func.sum(WasteLog.quantity_kg)).filter(
        WasteLog.user_id == current_user.id
    ).scalar() or 0

    by_category = db.query(
        WasteCategory.name,
        WasteCategory.code,
        WasteCategory.color_hex,
        func.count(Classification.id).label("count")
    ).join(
        Classification, Classification.predicted_category == WasteCategory.id, isouter=True
    ).filter(
        Classification.user_id == current_user.id
    ).group_by(
        WasteCategory.id, WasteCategory.name, WasteCategory.code, WasteCategory.color_hex
    ).all()

    return {
        "total_classifications": total_classifications,
        "total_logs": total_logs,
        "total_points": int(total_points),
        "total_kg": float(total_kg),
        "by_category": [
            {"name": r.name, "code": r.code, "color": r.color_hex, "count": r.count}
            for r in by_category
        ]
    }
