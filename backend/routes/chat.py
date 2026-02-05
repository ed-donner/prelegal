"""Chat API routes for AI-powered NDA creation."""

from fastapi import APIRouter, HTTPException
from models.chat import ChatRequest, ChatResponse
from services.ai_service import get_greeting, process_message

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/greeting", response_model=ChatResponse)
async def greeting():
    """Get the initial AI greeting message."""
    return get_greeting()


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a message and get AI response with extracted NDA fields.

    The request should include the full conversation history.
    The response includes the AI's reply and any extracted NDA fields.
    """
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")

    try:
        return process_message(request.messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
