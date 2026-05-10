from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.config import settings
from app.routers import auth, users, classifications, waste_logs, locations, reports, gamification

app = FastAPI(
    title="SmartTrash API",
    description="API phân loại rác thông minh bằng AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve ảnh local
os.makedirs("uploaded_images", exist_ok=True)
app.mount("/images", StaticFiles(directory="uploaded_images"), name="images")

app.include_router(auth.router,            prefix="/auth",           tags=["Auth"])
app.include_router(users.router,           prefix="/users",          tags=["Users"])
app.include_router(classifications.router, prefix="/classifications", tags=["AI Classification"])
app.include_router(waste_logs.router,      prefix="/waste-logs",     tags=["Waste Logs"])
app.include_router(locations.router,       prefix="/locations",      tags=["Locations"])
app.include_router(reports.router,         prefix="/reports",        tags=["Reports"])
app.include_router(gamification.router,    prefix="/gamification",   tags=["Gamification"])

@app.get("/")
def root():
    return {"message": "SmartTrash API đang chạy 🚀", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
