import os
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import torch
import torch.nn as nn
from torchvision import models, transforms

# ==================== CẤU HÌNH ====================
INPUT_SIZE  = 256
NUM_CLASSES = 6

LABELS = {
    0: "ORGANIC",
    1: "PLASTIC",
    2: "PAPER",
    3: "METAL",
    4: "GLASS",
    5: "HAZARDOUS"
}

# Transform ảnh — phải khớp với lúc train
transform = transforms.Compose([
    transforms.Resize((INPUT_SIZE, INPUT_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # Chuẩn ImageNet
        std=[0.229, 0.224, 0.225]
    )
])

# ==================== LOAD MODEL ====================
def load_model():
    model_path = os.path.join(
        os.path.dirname(__file__),
        "weights",
        "best_resnet50_model1.pth"
    )

    if not os.path.exists(model_path):
        print("⚠️  Chưa có file model — đang dùng chế độ demo")
        return None

    try:
        # Khởi tạo kiến trúc ResNet50
        model = models.resnet50(weights=None)

        # Thay lớp cuối để phù hợp 6 class
        model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

        # Load weights đã train
        state_dict = torch.load(model_path, map_location=torch.device("cpu"))

        # Xử lý trường hợp file lưu cả model lẫn optimizer
        if isinstance(state_dict, dict):
            if "model_state_dict" in state_dict:
                state_dict = state_dict["model_state_dict"]
            elif "state_dict" in state_dict:
                state_dict = state_dict["state_dict"]
            elif "model" in state_dict:
                state_dict = state_dict["model"]

        model.load_state_dict(state_dict)
        model.eval()  # Chuyển sang chế độ inference
        print("✅ Load ResNet50 model thành công!")
        return model

    except Exception as e:
        print(f"❌ Lỗi load model: {e}")
        print("→ Chạy chế độ demo")
        return None

# Load 1 lần khi server khởi động
_model = load_model()

# ==================== PREDICT ====================
def preprocess(image_url: str) -> torch.Tensor:
    """Tải ảnh từ URL, xử lý thành tensor"""
    response = requests.get(image_url, timeout=10)
    img = Image.open(BytesIO(response.content)).convert("RGB")
    tensor = transform(img)
    return tensor.unsqueeze(0)  # Thêm batch dimension: (1, 3, 256, 256)

def predict(image_url: str) -> tuple:
    """
    Nhận URL ảnh → trả về (category_code, confidence)
    Ví dụ: ("PLASTIC", 0.9234)
    """
    if _model is None:
        # Chế độ demo khi chưa có model
        import random
        code = random.choice(list(LABELS.values()))
        conf = round(random.uniform(0.70, 0.99), 4)
        return code, conf

    with torch.no_grad():
        tensor      = preprocess(image_url)
        outputs     = _model(tensor)              # shape: (1, 6)
        probs       = torch.softmax(outputs, dim=1)
        class_idx   = int(torch.argmax(probs))
        confidence  = float(probs[0][class_idx])

    return LABELS[class_idx], round(confidence, 4)
