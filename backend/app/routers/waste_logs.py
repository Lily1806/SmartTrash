from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User
from app.models.waste import WasteCategory, WasteLog
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CategoryCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    color_hex: Optional[str] = "#9ca3af"
    tips: Optional[str] = None

class WasteLogCreate(BaseModel):
    category_id: int
    quantity_kg: Optional[float] = None
    notes: Optional[str] = None

# ==================== CATEGORY ROUTES ====================

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(WasteCategory).filter(WasteCategory.is_active == True).all()
    return [
        {
            "id": c.id, "name": c.name, "code": c.code,
            "description": c.description, "color_hex": c.color_hex,
            "tips": c.tips
        }
        for c in cats
    ]

@router.post("/categories")
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    existing = db.query(WasteCategory).filter(WasteCategory.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mã loại rác đã tồn tại")
    cat = WasteCategory(**data.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"message": "Tạo thành công", "id": cat.id}

@router.put("/categories/{cat_id}")
def update_category(
    cat_id: int,
    data: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    cat = db.query(WasteCategory).filter(WasteCategory.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    for k, v in data.dict().items():
        setattr(cat, k, v)
    db.commit()
    return {"message": "Cập nhật thành công"}

@router.delete("/categories/{cat_id}")
def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    cat = db.query(WasteCategory).filter(WasteCategory.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    cat.is_active = False
    db.commit()
    return {"message": "Xóa thành công"}

# ==================== WASTE LOG ROUTES ====================

@router.post("/logs")
def create_log(
    data: WasteLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = WasteLog(user_id=current_user.id, **data.dict())
    db.add(log)
    db.commit()
    return {"message": "Ghi log thành công"}

@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(WasteLog).filter(
        WasteLog.user_id == current_user.id
    ).order_by(desc(WasteLog.logged_at)).limit(50).all()
    return [
        {
            "id": str(l.id),
            "category_id": l.category_id,
            "quantity_kg": float(l.quantity_kg or 0),
            "notes": l.notes,
            "logged_at": l.logged_at.strftime("%d/%m/%Y %H:%M")
        }
        for l in logs
    ]
