"""Document management routes."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, User
from models.documents import (
    DocumentSaveRequest,
    DocumentUpdateRequest,
    DocumentResponse,
    DocumentListResponse,
)
from services.document_service import DocumentService
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/documents", tags=["documents"])


def document_to_response(doc) -> DocumentResponse:
    """Convert a Document model to a DocumentResponse."""
    try:
        form_data = json.loads(doc.form_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=f"Document {doc.id} has corrupted data")

    return DocumentResponse(
        id=doc.id,
        document_type=doc.document_type,
        title=doc.title,
        form_data=form_data,
        created_at=doc.created_at.isoformat(),
        updated_at=doc.updated_at.isoformat(),
    )


@router.get("", response_model=DocumentListResponse)
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all documents for the current user."""
    doc_service = DocumentService(db)
    documents = doc_service.get_user_documents(current_user.id)
    return DocumentListResponse(
        documents=[document_to_response(doc) for doc in documents]
    )


@router.post("", response_model=DocumentResponse)
async def save_document(
    request: DocumentSaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save a new document."""
    doc_service = DocumentService(db)
    doc = doc_service.save_document(
        current_user.id,
        request.document_type.value,
        request.title,
        request.form_data,
    )
    return document_to_response(doc)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific document."""
    doc_service = DocumentService(db)
    doc = doc_service.get_document(document_id, current_user.id)
    return document_to_response(doc)


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: int,
    request: DocumentUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing document."""
    doc_service = DocumentService(db)
    doc = doc_service.update_document(
        document_id,
        current_user.id,
        request.title,
        request.form_data,
    )
    return document_to_response(doc)


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a document."""
    doc_service = DocumentService(db)
    doc_service.delete_document(document_id, current_user.id)
    return {"message": "Document deleted successfully"}
