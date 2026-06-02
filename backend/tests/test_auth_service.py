"""Unit tests for AuthService business logic."""

import pytest
from fastapi import HTTPException

from services.auth_service import AuthService


class TestSignup:
    def test_signup_creates_user(self, db_session):
        service = AuthService(db_session)
        user, token = service.signup("new@example.com", "password123")
        assert user.id is not None
        assert user.email == "new@example.com"
        assert user.hashed_password != "password123"

    def test_signup_returns_valid_token(self, db_session):
        from core.security import decode_access_token
        service = AuthService(db_session)
        user, token = service.signup("tok@example.com", "password123")
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == str(user.id)

    def test_signup_rejects_short_password(self, db_session):
        service = AuthService(db_session)
        with pytest.raises(HTTPException) as exc:
            service.signup("short@example.com", "abc")
        assert exc.value.status_code == 400
        assert "8 characters" in exc.value.detail

    def test_signup_rejects_duplicate_email(self, db_session):
        service = AuthService(db_session)
        service.signup("dup@example.com", "password123")
        with pytest.raises(HTTPException) as exc:
            service.signup("dup@example.com", "password456")
        assert exc.value.status_code == 400
        assert "already registered" in exc.value.detail


class TestSignin:
    def test_signin_with_correct_credentials(self, db_session):
        service = AuthService(db_session)
        service.signup("auth@example.com", "password123")
        user, token = service.signin("auth@example.com", "password123")
        assert user.email == "auth@example.com"
        assert token is not None

    def test_signin_wrong_password_raises_401(self, db_session):
        service = AuthService(db_session)
        service.signup("pass@example.com", "password123")
        with pytest.raises(HTTPException) as exc:
            service.signin("pass@example.com", "wrongpassword")
        assert exc.value.status_code == 401

    def test_signin_unknown_email_raises_401(self, db_session):
        service = AuthService(db_session)
        with pytest.raises(HTTPException) as exc:
            service.signin("nobody@example.com", "password123")
        assert exc.value.status_code == 401

    def test_signin_error_message_does_not_leak_email_existence(self, db_session):
        """Both wrong email and wrong password should return identical error message."""
        service = AuthService(db_session)
        service.signup("real@example.com", "password123")

        with pytest.raises(HTTPException) as wrong_pass:
            service.signin("real@example.com", "badpass123")

        with pytest.raises(HTTPException) as no_user:
            service.signin("fake@example.com", "password123")

        assert wrong_pass.value.detail == no_user.value.detail


class TestGetUserById:
    def test_get_existing_user(self, db_session):
        service = AuthService(db_session)
        created, _ = service.signup("find@example.com", "password123")
        found = service.get_user_by_id(created.id)
        assert found.id == created.id

    def test_get_nonexistent_user_raises_401(self, db_session):
        service = AuthService(db_session)
        with pytest.raises(HTTPException) as exc:
            service.get_user_by_id(99999)
        assert exc.value.status_code == 401
