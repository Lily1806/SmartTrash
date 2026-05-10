from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.classification import Classification
from app.models.waste import WasteCategory
from app.services.ai_service import classify_image
from app.services.cloudinary_service import upload_image
import uuid

router = APIRouter()

@router.post("/")
async def classify(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = await upload_image(file)
    result = await classify_image(image_url)

    category = db.query(WasteCategory).filter(
        WasteCategory.code == result["category"]
    ).first()

    record = Classification(
        user_id=current_user.id,
        image_url=image_url,
        predicted_category=category.id if category else None,
        confidence_score=result["confidence"],
        processing_time_ms=result["processing_time_ms"]
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": str(record.id),
        "image_url": image_url,
        "category": result["category"],
        "category_name": category.name if category else "",
        "confidence": result["confidence"],
        "tips": result["tips"]
    }

@router.get("/")
def get_history(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(Classification).filter(
        Classification.user_id == current_user.id
    ).order_by(desc(Classification.classified_at)).offset(skip).limit(limit).all()

    result = []
    for r in records:
        cat = db.query(WasteCategory).filter(WasteCategory.id == r.predicted_category).first()
        result.append({
            "id": str(r.id),
            "image_url": r.image_url,
            "category": cat.code if cat else "UNKNOWN",
            "category_name": cat.name if cat else "Không xác định",
            "category_color": cat.color_hex if cat else "#9ca3af",
            "confidence": float(r.confidence_score or 0),
            "classified_at": r.classified_at.strftime("%d/%m/%Y %H:%M")
        })
    return result
