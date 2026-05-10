from datetime import datetime

def format_datetime(dt: datetime) -> str:
    """Định dạng datetime thành chuỗi dễ đọc"""
    return dt.strftime("%d/%m/%Y %H:%M")
