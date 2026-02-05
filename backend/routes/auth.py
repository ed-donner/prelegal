"""Authentication routes - placeholder implementation."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup")
async def signup():
    """Placeholder signup endpoint."""
    return JSONResponse(
        content={"message": "Signup endpoint - not implemented"},
        status_code=501
    )


@router.post("/signin")
async def signin():
    """Placeholder signin endpoint."""
    return JSONResponse(
        content={"message": "Signin endpoint - not implemented"},
        status_code=501
    )


@router.get("/me")
async def get_current_user():
    """Placeholder current user endpoint."""
    return JSONResponse(
        content={"error": "Not authenticated"},
        status_code=401
    )
