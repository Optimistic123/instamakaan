from datetime import datetime, timedelta, timezone
from typing import Optional, List
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt

from core.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from core.database import get_db

# =========================
# PASSWORD UTILS (ADMIN / AGENT)
# =========================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# =========================
# JWT CONFIG
# =========================

REFRESH_TOKEN_EXPIRE_DAYS = 7
ISSUER = "instamakaan"
AUDIENCE = "instamakaan_users"

security = HTTPBearer()

# =========================
# TOKEN CREATORS
# =========================

def _base_payload(data: dict):
    return {
        **data,
        "iat": datetime.now(timezone.utc),
        "iss": ISSUER,
        "aud": AUDIENCE,
        "jti": str(uuid4()),
    }


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
):
    payload = _base_payload(data)
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload.update({
        "type": "access",
        "exp": expire,
    })
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(data: dict):
    payload = _base_payload(data)
    payload.update({
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    })
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# =========================
# TOKEN DECODER
# =========================

def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            audience=AUDIENCE,
            issuer=ISSUER,
        )
    except JWTError:
        return None

# =========================
# CURRENT USER (DB-BACKED)
# =========================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    db = get_db()
    user = await db.users.find_one({"id": user_id}, {"_id": 0})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# =========================
# RBAC
# =========================

def require_role(roles: List[str]):
    async def checker(user=Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden"
            )
        return user
    return checker
