from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.classification import Classification
from app.models.waste import WasteLog, WasteCategory
from app.models.gamification import UserPoints
from datetime import datetime, timedelta

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

@router.get("/daily")
def get_daily_report(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Báo cáo số lần phân loại theo từng ngày trong N ngày gần nhất"""
    today = datetime.utcnow().date()
    start = today - timedelta(days=days-1)

    # Query số lần phân loại theo ngày
    rows = db.query(
        cast(Classification.classified_at, Date).label("date"),
        func.count(Classification.id).label("count")
    ).filter(
        Classification.user_id == current_user.id,
        Classification.classified_at >= start
    ).group_by(
        cast(Classification.classified_at, Date)
    ).all()

    # Tạo dict ngày → count
    data_map = {str(r.date): r.count for r in rows}

    # Điền đủ 7 ngày (ngày không có dữ liệu = 0)
    result = []
    for i in range(days):
        d = start + timedelta(days=i)
        date_str = str(d)
        result.append({
            "date": date_str,
            "label": d.strftime("%d/%m"),
            "count": data_map.get(date_str, 0)
        })

    return result
