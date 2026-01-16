import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")

# App
APP_NAME = "InstaMakaan API"

# Database
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ.get("DB_NAME", "instamakaan")

# JWT
JWT_SECRET = os.environ.get("JWT_SECRET", "instamakaan-secret-key-change-in-production")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24)
)

# CORS
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")
