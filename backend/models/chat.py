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
    All fields are optional to support incremental extraction across document types.
    """
    response: str

    # Document type detection
    documentType: Optional[str] = None
    suggestedDocument: Optional[str] = None  # For unsupported requests

    # Common fields (shared across document types)
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None

    # Mutual NDA specific fields
    mndaTermType: Optional[Literal["expires", "continues"]] = None
    mndaTermYears: Optional[int] = None
    confidentialityTermType: Optional[Literal["years", "perpetuity"]] = None
    confidentialityTermYears: Optional[int] = None
    modifications: Optional[str] = None

    # Cloud Service Agreement fields
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    subscriptionPeriod: Optional[str] = None
    technicalSupport: Optional[str] = None
    fees: Optional[str] = None
    paymentTerms: Optional[str] = None

    # Pilot Agreement fields
    pilotPeriod: Optional[str] = None
    evaluationPurpose: Optional[str] = None
    generalCapAmount: Optional[str] = None

    # Design Partner Agreement fields
    programName: Optional[str] = None
    feedbackRequirements: Optional[str] = None
    accessPeriod: Optional[str] = None

    # SLA fields
    uptimeTarget: Optional[str] = None
    responseTimeCommitment: Optional[str] = None
    serviceCredits: Optional[str] = None

    # Professional Services fields
    deliverables: Optional[str] = None
    projectTimeline: Optional[str] = None
    paymentSchedule: Optional[str] = None
    ipOwnership: Optional[str] = None

    # Partnership Agreement fields
    partnershipScope: Optional[str] = None
    trademarkRights: Optional[str] = None
    revenueShare: Optional[str] = None

    # Software License fields
    licensedSoftware: Optional[str] = None
    licenseType: Optional[str] = None
    licenseFees: Optional[str] = None
    supportTerms: Optional[str] = None

    # DPA fields
    dataSubjects: Optional[str] = None
    processingPurpose: Optional[str] = None
    dataCategories: Optional[str] = None
    subprocessors: Optional[str] = None

    # BAA fields
    phiDescription: Optional[str] = None
    permittedUses: Optional[str] = None
    safeguards: Optional[str] = None

    # AI Addendum fields
    aiFeatures: Optional[str] = None
    trainingDataRights: Optional[str] = None
    outputOwnership: Optional[str] = None

    # Party information (common to all)
    party1: Optional[PartyInfoExtraction] = None
    party2: Optional[PartyInfoExtraction] = None

    # Completion flag
    isComplete: bool = False
