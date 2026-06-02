"""Tests for FastAPI authentication dependencies."""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from core.dependencies import get_current_user, get_current_user_optional
from core.security import create_access_token
from database import get_db


def _make_mini_app(db_session):
    """Build a minimal FastAPI app wired to the test DB with auth endpoints."""
    from database import get_db

    app = FastAPI()

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    @app.get("/protected")
    async def protected(user=pytest.param(None)):
        from fastapi import Depends
        return {}

    return app


class TestGetCurrentUserOptional:
    def _app_with_optional_auth(self, db_session):
        from fastapi import Depends
        from database import get_db

        app = FastAPI()

        def override_get_db():
            yield db_session

        app.dependency_overrides[get_db] = override_get_db

        @app.get("/optional")
        async def optional_endpoint(current_user=Depends(get_current_user_optional)):
            if current_user:
                return {"authenticated": True, "email": current_user.email}
            return {"authenticated": False}

        return app

    def test_optional_returns_none_without_cookie(self, db_session):
        app = self._app_with_optional_auth(db_session)
        with TestClient(app) as client:
            res = client.get("/optional")
        assert res.status_code == 200
        assert res.json() == {"authenticated": False}

    def test_optional_returns_user_with_valid_cookie(self, db_session):
        from services.auth_service import AuthService
        service = AuthService(db_session)
        user, token = service.signup("opt@example.com", "password123")

        app = self._app_with_optional_auth(db_session)
        with TestClient(app) as client:
            client.cookies.set("access_token", token)
            res = client.get("/optional")
        assert res.status_code == 200
        assert res.json()["authenticated"] is True
        assert res.json()["email"] == "opt@example.com"

    def test_optional_returns_none_with_invalid_token(self, db_session):
        app = self._app_with_optional_auth(db_session)
        with TestClient(app) as client:
            client.cookies.set("access_token", "invalid.token.here")
            res = client.get("/optional")
        assert res.status_code == 200
        assert res.json() == {"authenticated": False}

    def test_optional_returns_none_for_deleted_user(self, db_session):
        """Token for a user that no longer exists in DB returns None."""
        # Create a token for a non-existent user ID
        token = create_access_token(user_id=99999, email="ghost@example.com")
        app = self._app_with_optional_auth(db_session)
        with TestClient(app) as client:
            client.cookies.set("access_token", token)
            res = client.get("/optional")
        assert res.status_code == 200
        assert res.json() == {"authenticated": False}


class TestGetDb:
    def test_get_db_yields_session(self, db_session):
        """get_db yields a session and closes it cleanly."""
        gen = get_db()
        session = next(gen)
        assert session is not None
        # Exhaust the generator (triggers finally block)
        try:
            next(gen)
        except StopIteration:
            pass
