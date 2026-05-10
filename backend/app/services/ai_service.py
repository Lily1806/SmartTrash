"""
Service gọi AI model phân loại rác.
Thay đổi hàm predict() trong ai_model/model.py để dùng model của bạn.
"""
import time
from ai_model.model import predict

CATEGORY_TIPS = {
    "ORGANIC":   "Có thể làm phân compost. Bỏ vào thùng rác hữu cơ màu xanh lá.",
    "PLASTIC":   "Rửa sạch trước khi tái chế. Bỏ vào thùng tái chế màu xanh dương.",
    "PAPER":     "Giữ khô ráo để tăng giá trị tái chế.",
    "METAL":     "Dẹp lon để tiết kiệm không gian. Có thể bán ve chai.",
    "GLASS":     "Bọc kỹ để tránh vỡ. Đem đến điểm thu gom thủy tinh.",
    "HAZARDOUS": "⚠️ KHÔNG vứt chung với rác thông thường! Đem đến điểm thu gom rác nguy hại.",
}

async def classify_image(image_url: str) -> dict:
    """
    Gọi AI model, trả về category, confidence, tips.
    image_url: link ảnh từ Cloudinary
    """
    start = time.time()

    # Gọi model (bạn sẽ implement hàm predict() trong ai_model/model.py)
    category_code, confidence = predict(image_url)

    elapsed_ms = int((time.time() - start) * 1000)

    return {
        "category": category_code,
        "confidence": round(confidence, 4),
        "tips": CATEGORY_TIPS.get(category_code, ""),
        "processing_time_ms": elapsed_ms
    }
