"""FastAPI dependencies for authentication."""

from typing import Optional

from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, User
from core.security import decode_access_token
from services.auth_service import AuthService


async def get_current_user(
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency to get the current authenticated user from cookie.
    Raises 401 if not authenticated.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_access_token(access_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    auth_service = AuthService(db)
    return auth_service.get_user_by_id(int(user_id))


async def get_current_user_optional(
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Optional authentication - returns None if not authenticated.
    """
    if not access_token:
        return None

    payload = decode_access_token(access_token)
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    try:
        auth_service = AuthService(db)
        return auth_service.get_user_by_id(int(user_id))
    except HTTPException:
        return None
