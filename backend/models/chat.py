"""Pydantic models for chat API."""

from typing import Optional, Literal
from pydantic import BaseModel


class Message(BaseModel):
    """A single chat message."""
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Request body for chat endpoint."""
    messages: list[Message]


class PartyInfoExtraction(BaseModel):
    """Extracted party information."""
    name: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    noticeAddress: Optional[str] = None
    date: Optional[str] = None


class ChatResponse(BaseModel):
    """
    Structured response from AI containing both the reply and extracted fields.
    All fields are optional to support incremental extraction.
    """
    response: str

    # Agreement details
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[Literal["expires", "continues"]] = None
    mndaTermYears: Optional[int] = None
    confidentialityTermType: Optional[Literal["years", "perpetuity"]] = None
    confidentialityTermYears: Optional[int] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None

    # Party information
    party1: Optional[PartyInfoExtraction] = None
    party2: Optional[PartyInfoExtraction] = None

    # Completion flag
    isComplete: bool = False
