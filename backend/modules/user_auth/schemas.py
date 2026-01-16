from pydantic import BaseModel, Field


class RequestOTP(BaseModel):
    phone: str = Field(..., pattern=r"^[6-9]\d{9}$")


class VerifyOTP(BaseModel):
    phone: str = Field(..., pattern=r"^[6-9]\d{9}$")
    otp: str = Field(..., min_length=6, max_length=6)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserAuthResponse(BaseModel):
    id: str
    phone: str
    role: str
    is_new_user: bool
    access_token: str
    refresh_token: str
    expires_in: int
