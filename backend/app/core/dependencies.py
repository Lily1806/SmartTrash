from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User
from jose import JWTError

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency: lấy user hiện tại từ JWT token.
    Dùng trong router: current_user: User = Depends(get_current_user)
    """
    try:
        payload = decode_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token không hợp lệ")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="Người dùng không tồn tại")
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: chỉ cho phép admin truy cập"""
    if current_user.role.name != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền này")
    return current_user
