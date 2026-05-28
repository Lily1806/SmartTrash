import os
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import torch
import torch.nn as nn
from torchvision import models, transforms

INPUT_SIZE  = 256
NUM_CLASSES = 4

LABELS = {
    0: "GLASS",
    1: "METAL",
    2: "PAPER",
    3: "PLASTIC",
}

transform = transforms.Compose([
    transforms.Resize((INPUT_SIZE, INPUT_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

class CustomResNet50(nn.Module):
    def __init__(self, num_classes=4):
        super().__init__()
        backbone = models.resnet50(weights=None)
        self.base_model = nn.Sequential(
            backbone.conv1,
            backbone.bn1,
            backbone.relu,
            backbone.maxpool,
            backbone.layer1,
            backbone.layer2,
            backbone.layer3,
            backbone.layer4,
            backbone.avgpool,
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(2048, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.base_model(x)
        x = self.classifier(x)
        return x

def load_model():
    model_path = os.path.join(
        os.path.dirname(__file__), "weights", "best_resnet50_model1.pth"
    )
    if not os.path.exists(model_path):
        print("⚠️  Chưa có file model — đang dùng chế độ demo")
        return None
    try:
        model = CustomResNet50(num_classes=NUM_CLASSES)
        state_dict = torch.load(model_path, map_location=torch.device("cpu"))
        model.load_state_dict(state_dict)
        model.eval()
        print("✅ Load model thành công!")
        return model
    except Exception as e:
        print(f"❌ Lỗi load model: {e}")
        return None

_model = load_model()

def preprocess_from_url(image_url: str) -> torch.Tensor:
    """Tải ảnh từ URL hoặc đọc từ file local nếu là localhost"""
    try:
        if "localhost" in image_url or "127.0.0.1" in image_url:
            # Đọc thẳng từ file local — không cần server đang chạy
            filename = image_url.split("/images/")[-1]
            local_path = os.path.join(
                os.path.dirname(__file__), "..", "uploaded_images", filename
            )
            local_path = os.path.normpath(local_path)
            img = Image.open(local_path).convert("RGB")
        else:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            img = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Không thể tải ảnh: {e}")

    tensor = transform(img)
    return tensor.unsqueeze(0)

def predict(image_url: str) -> tuple:
    if _model is None:
        import random
        code = random.choice(list(LABELS.values()))
        conf = round(random.uniform(0.70, 0.99), 4)
        return code, conf

    with torch.no_grad():
        tensor     = preprocess_from_url(image_url)
        outputs    = _model(tensor)
        probs      = torch.softmax(outputs, dim=1)
        class_idx  = int(torch.argmax(probs))
        confidence = float(probs[0][class_idx])

    return LABELS[class_idx], round(confidence, 4)
