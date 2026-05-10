from sqlalchemy.orm import Session
from app.models.gamification import UserPoints
import uuid

POINT_RULES = {
    "CLASSIFY":     10,  # Phân loại rác
    "LOG_WASTE":    15,  # Ghi log vứt rác thực tế
    "STREAK_BONUS": 50,  # Bonus vứt rác 7 ngày liên tục
}

def award_points(db: Session, user_id: uuid.UUID, action_type: str, reference_id=None):
    """Cộng điểm cho user sau mỗi hành động tốt"""
    points = POINT_RULES.get(action_type, 0)
    if points == 0:
        return

    entry = UserPoints(
        user_id=user_id,
        points=points,
        action_type=action_type,
        reference_id=reference_id,
        description=f"{action_type} +{points} điểm"
    )
    db.add(entry)
    db.commit()
    return points
