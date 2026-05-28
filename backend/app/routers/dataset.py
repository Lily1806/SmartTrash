from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.models.waste import WasteCategory
from app.services.cloudinary_service import upload_image
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid, os

router = APIRouter()

# ── Model DB inline (tránh import vòng) ──────────────────────
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from app.core.database import Base

class DatasetImage(Base):
    __tablename__ = "dataset_images"
    id          = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename    = Column(String(255), nullable=False)
    image_url   = Column(String(500), nullable=False)
    category_id = Column(Integer, ForeignKey("waste_categories.id"), nullable=False)
    label       = Column(String(50), nullable=False)
    note        = Column(Text)
    is_active   = Column(Boolean, default=True)
    uploaded_by = Column(PGUUID(as_uuid=True), ForeignKey("users.id"))
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ── US-19: Xem danh sách dataset ─────────────────────────────
@router.get("/")
def get_dataset(
    category_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Xem toàn bộ dataset ảnh huấn luyện, lọc theo loại rác nếu cần"""
    query = db.query(DatasetImage).filter(DatasetImage.is_active == True)
    if category_id:
        query = query.filter(DatasetImage.category_id == category_id)
    items = query.order_by(desc(DatasetImage.created_at)).offset(skip).limit(limit).all()

    # Thống kê theo loại
    stats = {}
    all_items = db.query(DatasetImage).filter(DatasetImage.is_active == True).all()
    for item in all_items:
        stats[item.label] = stats.get(item.label, 0) + 1

    return {
        "total": len(all_items),
        "stats": stats,
        "items": [
            {
                "id": str(i.id),
                "filename": i.filename,
                "image_url": i.image_url,
                "category_id": i.category_id,
                "label": i.label,
                "note": i.note,
                "created_at": i.created_at.strftime("%d/%m/%Y %H:%M")
            }
            for i in items
        ]
    }

# ── US-20: Thêm ảnh vào dataset ──────────────────────────────
@router.post("/")
async def add_dataset_image(
    file: UploadFile = File(...),
    category_id: int = Form(...),
    label: str = Form(...),
    note: str = Form(None),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Admin upload ảnh mới vào dataset huấn luyện"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file ảnh")

    category = db.query(WasteCategory).filter(WasteCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại rác")

    # Lưu ảnh local vào thư mục dataset riêng
    dataset_dir = f"uploaded_images/dataset/{label.lower()}"
    os.makedirs(dataset_dir, exist_ok=True)

    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join(dataset_dir, filename)
    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    image_url = f"http://localhost:8000/images/dataset/{label.lower()}/{filename}"

    record = DatasetImage(
        filename=filename,
        image_url=image_url,
        category_id=category_id,
        label=label.upper(),
        note=note,
        uploaded_by=admin.id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "message": "Thêm ảnh dataset thành công",
        "id": str(record.id),
        "image_url": image_url,
        "label": label.upper()
    }

# ── US-20: Upload nhiều ảnh cùng lúc ─────────────────────────
@router.post("/batch")
async def add_dataset_batch(
    files: list[UploadFile] = File(...),
    category_id: int = Form(...),
    label: str = Form(...),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Upload nhiều ảnh cùng lúc vào dataset"""
    category = db.query(WasteCategory).filter(WasteCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại rác")

    dataset_dir = f"uploaded_images/dataset/{label.lower()}"
    os.makedirs(dataset_dir, exist_ok=True)

    results = []
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(dataset_dir, filename)
        contents = await file.read()
        with open(filepath, "wb") as f:
            f.write(contents)
        image_url = f"http://localhost:8000/images/dataset/{label.lower()}/{filename}"
        record = DatasetImage(
            filename=filename,
            image_url=image_url,
            category_id=category_id,
            label=label.upper(),
            uploaded_by=admin.id
        )
        db.add(record)
        results.append({"filename": filename, "image_url": image_url})

    db.commit()
    return {"message": f"Đã upload {len(results)} ảnh thành công", "items": results}

# ── US-21: Cập nhật thông tin ảnh dataset ────────────────────
class UpdateDatasetRequest(BaseModel):
    category_id: Optional[int] = None
    label: Optional[str] = None
    note: Optional[str] = None

@router.put("/{image_id}")
def update_dataset_image(
    image_id: str,
    data: UpdateDatasetRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Cập nhật nhãn hoặc ghi chú cho ảnh dataset"""
    item = db.query(DatasetImage).filter(DatasetImage.id == image_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")

    if data.category_id is not None:
        category = db.query(WasteCategory).filter(WasteCategory.id == data.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Không tìm thấy loại rác")
        item.category_id = data.category_id
    if data.label is not None:
        item.label = data.label.upper()
    if data.note is not None:
        item.note = data.note

    db.commit()
    return {"message": "Cập nhật thành công"}

# ── Xóa ảnh khỏi dataset ─────────────────────────────────────
@router.delete("/{image_id}")
def delete_dataset_image(
    image_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Xóa ảnh khỏi dataset (soft delete)"""
    item = db.query(DatasetImage).filter(DatasetImage.id == image_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    item.is_active = False
    db.commit()
    return {"message": "Đã xóa ảnh khỏi dataset"}

# ── Thống kê dataset ──────────────────────────────────────────
@router.get("/stats")
def get_dataset_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Thống kê số lượng ảnh theo từng nhãn"""
    items = db.query(DatasetImage).filter(DatasetImage.is_active == True).all()
    stats = {}
    for item in items:
        stats[item.label] = stats.get(item.label, 0) + 1
    return {
        "total": len(items),
        "by_label": stats
    }
