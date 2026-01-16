import random
import uuid
from datetime import datetime, timedelta
from typing import Dict

# IN-MEMORY STORES (DB READY)
_users: Dict[str, dict] = {}         
_otp_sessions: Dict[str, dict] = {}   
_revoked_refresh_tokens = set()       

OTP_EXPIRY_MINUTES = 5
OTP_MAX_ATTEMPTS = 5
OTP_REQUEST_COOLDOWN_SECONDS = 60
OTP_MAX_REQUESTS_WINDOW = 3
OTP_REQUEST_WINDOW_MINUTES = 10
OTP_LOCK_MINUTES = 15


def _now():
    return datetime.utcnow()


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


def request_otp(phone: str):
    now = _now()
    session = _otp_sessions.get(phone)

    if session and session.get("locked_until") and now < session["locked_until"]:
        return None, "OTP temporarily locked. Try later"

    if session and session.get("last_sent_at"):
        if (now - session["last_sent_at"]).total_seconds() < OTP_REQUEST_COOLDOWN_SECONDS:
            return None, "Please wait before requesting another OTP"

    otp = _generate_otp()
    expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)

    _otp_sessions[phone] = {
        "otp": otp,
        "expires_at": expires_at,
        "attempts": 0,
        "locked_until": None,
        "last_sent_at": now,
        "requests": session.get("requests", 0) + 1 if session else 1,
        "window_start": session.get("window_start", now) if session else now,
    }

    # TESTING ONLY
    print(f"[OTP] {phone} -> {otp}")

    return True, None


def verify_otp(phone: str, otp: str):
    session = _otp_sessions.get(phone)
    now = _now()

    if not session:
        return None, "OTP not requested"

    if session.get("locked_until") and now < session["locked_until"]:
        return None, "OTP attempts locked. Try later"

    if now > session["expires_at"]:
        _otp_sessions.pop(phone, None)
        return None, "OTP expired"

    session["attempts"] += 1

    if session["otp"] != otp:
        if session["attempts"] >= OTP_MAX_ATTEMPTS:
            session["locked_until"] = now + timedelta(minutes=OTP_LOCK_MINUTES)
        return None, "Invalid OTP"

    
    _otp_sessions.pop(phone, None)

    user = _users.get(phone)
    is_new_user = False

    if not user:
        user = {
            "id": str(uuid.uuid4()),
            "phone": phone,
            "role": "USER",
            "is_phone_verified": True,
            "created_at": now,
            "last_login_at": now,
        }
        _users[phone] = user
        is_new_user = True
    else:
        user["last_login_at"] = now

    return user, is_new_user


def revoke_refresh_token(token: str):
    _revoked_refresh_tokens.add(token)


def is_refresh_revoked(token: str) -> bool:
    return token in _revoked_refresh_tokens
