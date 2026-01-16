from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from jose import jwt
from typing import Dict
import uuid

from modules.auth.schemas import (
    UserCreate,
    UserLogin,
    AdminLogin,
    TokenResponse,
    RefreshTokenRequest
)

SECRET_KEY = "DEV_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/auth", tags=["Auth"])

# -IN-MEMORY STORE (TEMP) 
_fake_users: Dict[str, dict] = {}
_fake_refresh_tokens: Dict[str, str] = {}

# Seed ADMIN (since DB not used yet)
_fake_users["admin@instamakaan.com"] = {
    "id": "admin-1",
    "email": "admin@instamakaan.com",
    "password": "admin123",
    "role": "ADMIN",
    "created_at": datetime.utcnow()
}

# - UTILS 
def create_access_token(subject: str, role: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "role": role,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str):
    token = str(uuid.uuid4())
    _fake_refresh_tokens[token] = subject
    return token

@router.post("/register")
def register(payload: UserCreate):
    if payload.email in _fake_users:
        raise HTTPException(status_code=400, detail="User already exists")

    _fake_users[payload.email] = {
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "password": payload.password,
        "role": "USER",
        "created_at": datetime.utcnow()
    }

    return {"message": "User registered"}


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    user = _fake_users.get(payload.email)

    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"])

    return {
        "access_token": access,
        "refresh_token": refresh
    }

@router.post("/admin/auth/login", response_model=TokenResponse)
def admin_login(payload: AdminLogin):
    user = _fake_users.get(payload.email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    if user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")

    if user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    access = create_access_token(user["id"], user["role"])
    refresh = create_refresh_token(user["id"])

    return {
        "access_token": access,
        "refresh_token": refresh
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshTokenRequest):
    if payload.refresh_token not in _fake_refresh_tokens:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    subject = _fake_refresh_tokens[payload.refresh_token]
    access = create_access_token(subject, "USER")

    return {"access_token": access}


@router.post("/logout")
def logout(payload: RefreshTokenRequest):
    _fake_refresh_tokens.pop(payload.refresh_token, None)
    return {"message": "Logged out"}
