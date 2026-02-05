"""Document management business logic."""

import json

from fastapi import HTTPException
from sqlalchemy.orm import Session

from database import Document


class DocumentService:
    """Handles document business logic."""

    def __init__(self, db: Session):
        self.db = db

    def save_document(
        self, user_id: int, document_type: str, title: str, form_data: dict
    ) -> Document:
        """Save a new document."""
        doc = Document(
            user_id=user_id,
            document_type=document_type,
            title=title,
            form_data=json.dumps(form_data),
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def get_user_documents(self, user_id: int) -> list[Document]:
        """Get all documents for a user, sorted by most recently updated."""
        return (
            self.db.query(Document)
            .filter(Document.user_id == user_id)
            .order_by(Document.updated_at.desc())
            .all()
        )

    def get_document(self, document_id: int, user_id: int) -> Document:
        """Get a specific document. Raises 404 if not found or not owned by user."""
        doc = (
            self.db.query(Document)
            .filter(Document.id == document_id, Document.user_id == user_id)
            .first()
        )
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        return doc

    def update_document(
        self, document_id: int, user_id: int, title: str, form_data: dict
    ) -> Document:
        """Update an existing document."""
        doc = self.get_document(document_id, user_id)
        doc.title = title
        doc.form_data = json.dumps(form_data)
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def delete_document(self, document_id: int, user_id: int) -> None:
        """Delete a document."""
        doc = self.get_document(document_id, user_id)
        self.db.delete(doc)
        self.db.commit()
