"""Document type definitions and registry."""

from enum import Enum
from typing import Optional
from pydantic import BaseModel


class DocumentType(str, Enum):
    """Supported document types."""
    MUTUAL_NDA = "mutual_nda"
    CLOUD_SERVICE = "cloud_service"
    PILOT = "pilot"
    DESIGN_PARTNER = "design_partner"
    SLA = "sla"
    PROFESSIONAL_SERVICES = "professional_services"
    PARTNERSHIP = "partnership"
    SOFTWARE_LICENSE = "software_license"
    DPA = "dpa"
    BAA = "baa"
    AI_ADDENDUM = "ai_addendum"


class PartyInfo(BaseModel):
    """Party information common to all documents."""
    name: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    noticeAddress: Optional[str] = None
    date: Optional[str] = None


# Document catalog with descriptions for AI
DOCUMENT_CATALOG = {
    DocumentType.MUTUAL_NDA: {
        "name": "Mutual Non-Disclosure Agreement",
        "description": "A standard mutual NDA for protecting confidential information exchanged between two parties evaluating a potential business relationship.",
    },
    DocumentType.CLOUD_SERVICE: {
        "name": "Cloud Service Agreement",
        "description": "A comprehensive agreement for selling and buying cloud software and SaaS products, covering access, payment, security, liability, and confidentiality.",
    },
    DocumentType.PILOT: {
        "name": "Pilot Agreement",
        "description": "A short-term trial or evaluation agreement allowing prospective customers to test a product before committing to a longer-term deal.",
    },
    DocumentType.DESIGN_PARTNER: {
        "name": "Design Partner Agreement",
        "description": "An agreement for early product access where partners provide feedback in exchange for using pre-release software.",
    },
    DocumentType.SLA: {
        "name": "Service Level Agreement",
        "description": "A standard SLA defining uptime targets, response time commitments, service credits, and remedies for cloud service providers.",
    },
    DocumentType.PROFESSIONAL_SERVICES: {
        "name": "Professional Services Agreement",
        "description": "An agreement for professional services engagements covering deliverables, intellectual property, payment terms, and project management.",
    },
    DocumentType.PARTNERSHIP: {
        "name": "Partnership Agreement",
        "description": "A standard agreement for business partnerships covering cooperation obligations, trademark licensing, fees, confidentiality, and liability.",
    },
    DocumentType.SOFTWARE_LICENSE: {
        "name": "Software License Agreement",
        "description": "A comprehensive license agreement for on-premise or installable software, covering licensing terms, restrictions, warranties, and support.",
    },
    DocumentType.DPA: {
        "name": "Data Processing Agreement",
        "description": "A GDPR-compliant data processing agreement covering data protection obligations, subprocessors, international transfers, and security requirements.",
    },
    DocumentType.BAA: {
        "name": "Business Associate Agreement",
        "description": "A HIPAA-compliant agreement for business associates handling protected health information (PHI).",
    },
    DocumentType.AI_ADDENDUM: {
        "name": "AI Addendum",
        "description": "An addendum for agreements involving AI/ML features, covering input/output ownership, model training restrictions, and AI-specific disclaimers.",
    },
}


def get_document_catalog_text() -> str:
    """Generate the document catalog text for the AI system prompt."""
    lines = []
    for doc_type, info in DOCUMENT_CATALOG.items():
        lines.append(f"- {info['name']}: {info['description']}")
    return "\n".join(lines)
