import uuid
import os
from fastapi import UploadFile

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def upload_image(file: UploadFile) -> str:
    """
    Lưu ảnh local thay vì Cloudinary.
    Sau này thay bằng Cloudinary thật khi có API key.
    """
    contents = await file.read()
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    # Trả về URL local (backend tự serve ảnh)
    return f"http://localhost:8000/images/{filename}"
