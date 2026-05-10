from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, TokenResponse

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    # Kiểm tra email đã tồn tại chưa
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email đã được đăng ký")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token}

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token}
