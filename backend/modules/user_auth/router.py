from fastapi import APIRouter, HTTPException
from modules.user_auth.schemas import (
    RequestOTP,
    VerifyOTP,
    RefreshTokenRequest,
    UserAuthResponse,
)
from modules.user_auth.service import (
    request_otp,
    verify_otp,
    revoke_refresh_token,
    is_refresh_revoked,
)
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["User Auth"])


@router.post("/request-otp")
def request_otp_api(payload: RequestOTP):
    ok, err = request_otp(payload.phone)
    if err:
        raise HTTPException(status_code=429, detail=err)
    return {"success": True, "message": "OTP sent"}


@router.post("/verify-otp", response_model=UserAuthResponse)
def verify_otp_api(payload: VerifyOTP):
    result = verify_otp(payload.phone, payload.otp)
    if not result:
        raise HTTPException(status_code=400, detail="OTP verification failed")

    user, is_new_user = result

    access_token = create_access_token({
        "sub": user["id"],
        "role": user["role"],
    })

    refresh_token = create_refresh_token({
        "sub": user["id"],
        "role": user["role"],
    })

    return {
        "id": user["id"],
        "phone": user["phone"],
        "role": user["role"],
        "is_new_user": is_new_user,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": 15 * 60,
    }


@router.post("/refresh")
def refresh_token_api(payload: RefreshTokenRequest):
    if is_refresh_revoked(payload.refresh_token):
        raise HTTPException(status_code=401, detail="Token revoked")

    try:
        data = decode_token(payload.refresh_token)
        if data.get("type") != "refresh":
            raise Exception()
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token({
        "sub": data["sub"],
        "role": data["role"],
    })

    return {"access_token": access_token, "expires_in": 15 * 60}


@router.post("/logout")
def logout_api(payload: RefreshTokenRequest):
    revoke_refresh_token(payload.refresh_token)
    return {"success": True}
