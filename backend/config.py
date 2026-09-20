import os

class Config:
    PROJECT_NAME = "Arka-assist"
    PROJECT_TITLE = "Arka-assist — A Multimodal AI-Based Farm Intelligence and Decision Support System"
    SECRET_KEY = os.environ.get("SECRET_KEY", "arka-assist-secure-dev-key-2026")
    CORS_HEADERS = "Content-Type"
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = os.environ.get("FLASK_ENV") == "development"
