"""
Load AI model và thực hiện dự đoán.

Bạn cần sửa file này để phù hợp với model đã train:
- Nếu dùng TensorFlow/Keras: dùng tf.keras.models.load_model()
- Nếu dùng PyTorch: dùng torch.load()
- Nếu dùng scikit-learn: dùng pickle.load()
"""
import os
import numpy as np
from PIL import Image
import requests
from io import BytesIO

# Nhãn phân loại — phải khớp với thứ tự lúc train model
LABELS = {
    0: "ORGANIC",
    1: "PLASTIC",
    2: "PAPER",
    3: "METAL",
    4: "GLASS",
    5: "HAZARDOUS"
}

# ========== THAY ĐỔI PHẦN NÀY ==========
def load_model():
    """Load model từ file weights"""
    model_path = os.path.join(os.path.dirname(__file__), "weights", "waste_classifier.h5")

    # Ví dụ dùng TensorFlow/Keras:
    # import tensorflow as tf
    # return tf.keras.models.load_model(model_path)

    # Ví dụ dùng PyTorch:
    # import torch
    # model = YourModelClass()
    # model.load_state_dict(torch.load(model_path))
    # return model

    # Tạm thời return None (chưa có model thật)
    return None

def preprocess_image(image_url: str) -> np.ndarray:
    """Tải ảnh từ URL, resize và chuẩn hóa để đưa vào model"""
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content)).convert("RGB")
    img = img.resize((224, 224))          # Thay đổi kích thước nếu model yêu cầu khác
    arr = np.array(img) / 255.0           # Chuẩn hóa về [0, 1]
    return np.expand_dims(arr, axis=0)    # Thêm batch dimension: (1, 224, 224, 3)

# Load model khi server khởi động (không load lại mỗi lần request)
_model = load_model()

def predict(image_url: str) -> tuple[str, float]:
    """
    Nhận URL ảnh, trả về (category_code, confidence_score)
    Ví dụ: ("PLASTIC", 0.9523)
    """
    if _model is None:
        # Chế độ demo — random kết quả khi chưa có model thật
        import random
        code = random.choice(list(LABELS.values()))
        conf = round(random.uniform(0.7, 0.99), 4)
        return code, conf

    img = preprocess_image(image_url)

    # TensorFlow/Keras:
    # predictions = _model.predict(img)
    # class_idx = np.argmax(predictions[0])
    # confidence = float(predictions[0][class_idx])

    # Placeholder:
    class_idx = 0
    confidence = 0.95
    return LABELS[class_idx], confidence
# ========================================
