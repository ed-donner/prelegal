"""Pydantic models for authentication."""

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    """Signup request body."""

    email: EmailStr
    password: str


class SigninRequest(BaseModel):
    """Signin request body."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User information response."""

    id: int
    email: str

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    """Authentication response with user info."""

    user: UserResponse
    message: str
