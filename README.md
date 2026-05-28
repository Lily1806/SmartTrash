# 🗑️ GarbageVision

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
-----------------
# 🗑️ GarbageVision — Ứng dụng phân loại rác thông minh bằng AI

<div align="center">

![GarbageVision Banner](https://img.shields.io/badge/GarbageVision-AI%20Waste%20Classification-16a34a?style=for-the-badge&logo=leaflet&logoColor=white)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-ResNet50-EE4C2C?style=flat-square&logo=pytorch)](https://pytorch.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

**GarbageVision** là ứng dụng web giúp người dùng phân loại rác thải đúng cách thông qua nhận diện hình ảnh bằng AI, góp phần bảo vệ môi trường và nâng cao ý thức cộng đồng.

[Demo](#) · [Báo lỗi](#) · [Đóng góp](#)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [AI Model](#-ai-model)
- [Nhóm phát triển](#-nhóm-phát-triển)

---

## 🌟 Giới thiệu

GarbageVision được phát triển như một dự án nghiên cứu khoa học (NCKH 2025) nhằm ứng dụng trí tuệ nhân tạo vào việc giải quyết vấn đề phân loại rác thải tại Việt Nam.

Người dùng chỉ cần **chụp ảnh** túi rác, chai nhựa, hay bất kỳ vật phẩm nào — AI sẽ tự động nhận diện loại rác và đưa ra hướng dẫn xử lý phù hợp trong vòng vài giây.

### Vấn đề giải quyết

- 🇻🇳 Việt Nam thải ra hơn **60.000 tấn rác** mỗi ngày, nhưng tỉ lệ tái chế còn rất thấp
- Người dân chưa có thói quen và kiến thức phân loại rác đúng cách
- Thiếu công cụ hỗ trợ trực quan, dễ sử dụng để phân loại rác tại nguồn

---

## ✨ Tính năng

### Theme 1 — Quản lý người dùng
| Mã | Tính năng | Mô tả |
|---|---|---|
| US-01 | Đăng nhập | Xác thực bằng email + mật khẩu, JWT token |
| US-02 | Đăng xuất | Xóa token, chuyển về trang login |
| US-03 | Xem danh sách user | Admin xem toàn bộ tài khoản |
| US-04 | Tìm kiếm user | Tìm theo tên hoặc email |
| US-05 | Tạo tài khoản | Đăng ký tài khoản mới |
| US-06 | Chỉnh sửa tài khoản | Khóa/mở tài khoản |
| US-07 | Xóa tài khoản | Admin xóa, user tự vô hiệu hóa |
| US-08 | Xem thông tin cá nhân | Xem profile, avatar |
| US-09 | Đổi mật khẩu | Xác nhận mật khẩu cũ trước khi đổi |

### Theme 2 — Nhận diện & Phân loại rác AI
| Mã | Tính năng | Mô tả |
|---|---|---|
| US-10 | Tải/Chụp ảnh rác | Upload ảnh từ máy, kéo thả |
| US-11 | Phân loại bằng AI | ResNet50 nhận diện 6 loại rác |
| US-12 | Hiển thị kết quả | Loại rác, độ chính xác, màu sắc |
| US-13 | Gợi ý xử lý rác | Hướng dẫn cụ thể theo từng loại |
| US-14 | Lưu lịch sử nhận diện | Ghi lại mỗi lần phân loại vào DB |

### Theme 3 — Quản lý dữ liệu rác
| Mã | Tính năng | Mô tả |
|---|---|---|
| US-15 | Xem danh sách loại rác | 6 loại mặc định + do admin thêm |
| US-16 | Tìm kiếm loại rác | Tìm theo tên hoặc mã code |
| US-17 | Thêm loại rác mới | Admin thêm loại rác tùy chỉnh |
| US-18 | Chỉnh sửa loại rác | Sửa tên, màu, hướng dẫn |
| US-19 | Xóa loại rác | Soft delete (vô hiệu hóa) |

### Theme 4 — Báo cáo & Thống kê
| Mã | Tính năng | Mô tả |
|---|---|---|
| US-29 | Tổng lượng rác phân loại | Số lần, số kg |
| US-30 | Báo cáo theo ngày | Biểu đồ cột 7/14/30 ngày |
| US-31 | Báo cáo theo loại rác | Tỉ lệ % từng loại |
| US-32 | Thống kê tỉ lệ tái chế | % rác có thể tái chế |

### Gamification
- 🏆 Hệ thống tích điểm: phân loại đúng → cộng điểm
- 🎖️ Huy hiệu thành tích: Người mới bắt đầu, Chiến binh xanh, Huyền thoại
- 📈 Dashboard cá nhân với thống kê trực quan

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                    Người dùng                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│              Frontend (React + Vite)                 │
│              localhost:5173 / Vercel                 │
│                                                      │
│  LoginPage  │  ClassifyPage  │  Dashboard            │
│  History    │  Reports       │  Admin                │
└──────────────────────┬──────────────────────────────┘
                       │ REST API / JSON
┌──────────────────────▼──────────────────────────────┐
│              Backend (FastAPI Python)                │
│              localhost:8000 / Railway                │
│                                                      │
│  /auth  │  /users  │  /classifications              │
│  /waste-logs  │  /reports  │  /gamification         │
└──────┬───────────────┬───────────────────────────────┘
       │               │
┌──────▼──────┐  ┌─────▼────────────────────┐
│ PostgreSQL  │  │      AI Model            │
│ Database    │  │  ResNet50 (PyTorch)      │
│             │  │  6 loại rác · 256×256    │
└─────────────┘  └──────────────────────────┘
```

---

## 🛠️ Tech Stack

| Lớp | Công nghệ | Phiên bản | Mục đích |
|---|---|---|---|
| Frontend | React | 18.3 | UI framework |
| Frontend | Vite | 5.x | Build tool |
| Frontend | TailwindCSS | 3.4 | Styling |
| Frontend | React Router | 6.x | Navigation |
| Frontend | Axios | 1.7 | HTTP client |
| Frontend | Zustand | 4.5 | State management |
| Backend | FastAPI | 0.111 | API framework |
| Backend | SQLAlchemy | 2.0 | ORM |
| Backend | Pydantic | 2.x | Data validation |
| Backend | JWT (python-jose) | 3.3 | Authentication |
| Backend | Bcrypt (passlib) | 1.7 | Password hashing |
| AI | PyTorch | 2.x | Deep learning |
| AI | ResNet50 | — | Model architecture |
| AI | torchvision | — | Image transforms |
| Database | PostgreSQL | 16 | Primary database |
| Storage | Cloudinary / Local | — | Image storage |

---

## 📁 Cấu trúc thư mục

```
smarttrash/
├── README.md
├── .gitignore
│
├── backend/                          # FastAPI (Python)
│   ├── .env                          # ⚠️ Không commit!
│   ├── .env.example                  # Mẫu cấu hình
│   ├── requirements.txt
│   ├── main.py                       # Entry point
│   │
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py             # Đọc biến môi trường
│   │   │   ├── database.py           # Kết nối PostgreSQL
│   │   │   ├── security.py           # JWT, bcrypt
│   │   │   └── dependencies.py       # get_db, get_current_user
│   │   │
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── waste.py
│   │   │   ├── classification.py
│   │   │   └── gamification.py
│   │   │
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── waste.py
│   │   │   ├── classification.py
│   │   │   └── report.py
│   │   │
│   │   ├── routers/                  # API endpoints
│   │   │   ├── auth.py               # /auth/register, /login
│   │   │   ├── users.py              # /users/me, /users (admin)
│   │   │   ├── classifications.py    # /classifications
│   │   │   ├── waste_logs.py         # /waste-logs
│   │   │   ├── reports.py            # /reports/stats, /daily
│   │   │   └── gamification.py       # /gamification
│   │   │
│   │   └── services/
│   │       ├── ai_service.py         # Gọi AI model
│   │       ├── cloudinary_service.py # Upload ảnh
│   │       └── points_service.py     # Tính điểm
│   │
│   └── ai_model/
│       ├── model.py                  # Load & predict
│       ├── labels.json
│       └── weights/
│           └── best_resnet50_model1.pth  # ⚠️ Không commit!
│
├── frontend/                         # React + TailwindCSS
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                   # Router chính
│       ├── pages/
│       │   ├── auth/                 # Login, Register
│       │   ├── dashboard/            # Trang chủ
│       │   ├── classify/             # Phân loại AI
│       │   ├── history/              # Lịch sử
│       │   ├── reports/              # Báo cáo
│       │   ├── profile/              # Thông tin cá nhân
│       │   └── admin/                # Quản trị
│       ├── services/                 # Gọi API
│       ├── store/                    # Zustand state
│       └── hooks/                    # Custom hooks
│
└── database/
    ├── smarttrash_schema.sql         # Tạo bảng
    ├── seed_data.sql                 # Dữ liệu mẫu
    └── migrations/
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

- macOS / Linux / Windows (WSL)
- Python 3.12+
- Node.js 18+
- PostgreSQL 16+
- Homebrew (macOS)

### 1. Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/GarbageVision.git
cd GarbageVision
```

### 2. Cài đặt PostgreSQL và tạo database

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Tạo database
createdb smarttrash

# Chạy schema
psql -d smarttrash -f database/smarttrash_schema.sql
```

### 3. Cài đặt Backend

```bash
cd backend

# Tạo môi trường ảo
python -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows

# Cài thư viện
pip install -r requirements.txt

# Cấu hình môi trường
cp .env.example .env
nano .env                          # Điền thông tin thực tế
```

**Nội dung file `.env`:**
```env
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/smarttrash
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# Khởi động backend
uvicorn main:app --reload
# → http://localhost:8000
# → Swagger docs: http://localhost:8000/docs
```

### 4. Cài đặt Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 5. Tích hợp AI Model

```bash
# Copy file model vào đúng vị trí
cp /path/to/best_resnet50_model1.pth backend/ai_model/weights/

# Cài PyTorch
cd backend
source venv/bin/activate
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### 6. Tạo tài khoản Admin

```bash
# Đăng ký tài khoản bình thường, sau đó cấp quyền admin
psql -d smarttrash -c "UPDATE users SET role_id=1 WHERE email='your@email.com';"
```

---

## 📡 API Documentation

Sau khi chạy backend, truy cập **http://localhost:8000/docs** để xem Swagger UI đầy đủ.

### Các endpoint chính

#### Authentication
```
POST /auth/register    Đăng ký tài khoản
POST /auth/login       Đăng nhập → nhận JWT token
```

#### Users
```
GET  /users/me         Thông tin user hiện tại
PUT  /users/me         Cập nhật thông tin
PUT  /users/me/password  Đổi mật khẩu
GET  /users/           Danh sách user (admin only)
```

#### AI Classification
```
POST /classifications/   Upload ảnh → AI phân loại
GET  /classifications/   Lịch sử phân loại của user
```

#### Reports
```
GET /reports/stats      Thống kê tổng hợp
GET /reports/daily      Báo cáo theo ngày (?days=7|14|30)
```

#### Waste Management
```
GET  /waste-logs/categories       Danh sách loại rác
POST /waste-logs/categories       Thêm loại rác (admin)
PUT  /waste-logs/categories/{id}  Sửa loại rác (admin)
DELETE /waste-logs/categories/{id} Xóa loại rác (admin)
```

### Xác thực API

Tất cả endpoint (trừ `/auth`) yêu cầu JWT token trong header:
```
Authorization: Bearer <access_token>
```

---

## 🗄️ Database Schema

Hệ thống gồm **10 bảng chính**:

```
roles               → Vai trò: admin, user, moderator
users               → Tài khoản người dùng
refresh_tokens      → JWT refresh tokens
waste_categories    → 6 loại rác (ORGANIC, PLASTIC, PAPER, METAL, GLASS, HAZARDOUS)
classifications     → Lịch sử phân loại AI
waste_logs          → Nhật ký vứt rác thực tế
locations           → Điểm thu gom rác
user_points         → Điểm tích lũy gamification
achievements        → Huy hiệu thành tích
user_achievements   → Huy hiệu user đã đạt
```

**6 loại rác được hỗ trợ:**

| Code | Tên | Màu | Hướng dẫn |
|---|---|---|---|
| ORGANIC | Rác hữu cơ | 🟢 #4CAF50 | Làm phân compost |
| PLASTIC | Nhựa | 🔵 #2196F3 | Rửa sạch, tái chế |
| PAPER | Giấy/Bìa | 🟠 #FF9800 | Giữ khô, tái chế |
| METAL | Kim loại | ⚫ #9E9E9E | Bán ve chai |
| GLASS | Thủy tinh | 🩵 #00BCD4 | Bọc kỹ, điểm thu gom |
| HAZARDOUS | Rác nguy hại | 🔴 #F44336 | Điểm thu gom đặc biệt |

---

## 🤖 AI Model

### Thông số kỹ thuật

| Thông số | Giá trị |
|---|---|
| Architecture | ResNet50 (Fine-tuned) |
| Framework | PyTorch |
| Input size | 256 × 256 × 3 (RGB) |
| Output classes | 6 |
| Training method | Fine-tune toàn bộ |
| File format | `.pth` |
| File size | ~95MB |

### Preprocessing pipeline

```python
transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # ImageNet chuẩn
        std=[0.229, 0.224, 0.225]
    )
])
```

### Tích hợp API

```
POST /classifications/
Content-Type: multipart/form-data

file: <image_file>

Response:
{
  "category": "PLASTIC",
  "category_name": "Nhựa",
  "confidence": 0.9234,
  "tips": "Rửa sạch trước khi bỏ vào thùng tái chế"
}
```

---

## 🌐 Deploy

| Dịch vụ | Mục đích | URL |
|---|---|---|
| Vercel | Frontend (React) | smarttrash.vercel.app |
| Railway | Backend (FastAPI) + PostgreSQL | smarttrash.railway.app |
| Cloudinary | Lưu trữ ảnh | cloudinary.com |

---

## 👥 Nhóm phát triển

Dự án Nghiên cứu Khoa học 2025

| Thành viên | Vai trò |
|---|---|
| Trần Lý | Developer |

---

## 📄 License

MIT License — Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">

Made with ❤️ for a greener Vietnam 🇻🇳

**GarbageVision** — Phân loại rác thông minh, bảo vệ môi trường bền vững

</div>