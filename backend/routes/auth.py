"""Authentication routes."""

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from database import get_db, User
from models.auth import SignupRequest, SigninRequest, UserResponse, AuthResponse
from services.auth_service import AuthService
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, response: Response, db: Session = Depends(get_db)):
    """Register a new user account."""
    auth_service = AuthService(db)
    user, token = auth_service.signup(request.email, request.password)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
    )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Account created successfully",
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(request: SigninRequest, response: Response, db: Session = Depends(get_db)):
    """Sign in to an existing account."""
    auth_service = AuthService(db)
    user, token = auth_service.signin(request.email, request.password)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
    )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Signed in successfully",
    )


@router.post("/signout")
async def signout(response: Response):
    """Sign out by clearing the auth cookie."""
    response.delete_cookie(key="access_token")
    return {"message": "Signed out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information."""
    return UserResponse.model_validate(current_user)
