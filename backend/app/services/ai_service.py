import time
from ai_model.model import predict

CATEGORY_TIPS = {
    "GLASS":   "Bọc kỹ để tránh vỡ gây nguy hiểm. Đem đến điểm thu gom thủy tinh.",
    "METAL":   "Dẹp lon để tiết kiệm không gian. Có thể bán ve chai.",
    "PAPER":   "Giữ khô ráo để tăng giá trị tái chế. Bỏ vào thùng tái chế.",
    "PLASTIC": "Rửa sạch trước khi bỏ vào thùng tái chế màu xanh dương.",
}

async def classify_image(image_url: str) -> dict:
    start = time.time()
    category_code, confidence = predict(image_url)
    elapsed_ms = int((time.time() - start) * 1000)

    return {
        "category": category_code,
        "confidence": round(confidence, 4),
        "tips": CATEGORY_TIPS.get(category_code, ""),
        "processing_time_ms": elapsed_ms
    }
