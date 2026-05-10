# 🗑️ SmartTrash

Ứng dụng phân loại rác thông minh bằng AI.

## Tech Stack
- **Frontend**: React + TailwindCSS + Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: Model phân loại rác (đã train)
- **Storage**: Cloudinary

## Cách chạy

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
