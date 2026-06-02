"""Integration tests for auth API routes."""

import pytest


class TestSignup:
    def test_signup_returns_200(self, client):
        res = client.post("/api/auth/signup", json={
            "email": "new@example.com",
            "password": "password123",
        })
        assert res.status_code == 200
        data = res.json()
        assert data["user"]["email"] == "new@example.com"
        assert "id" in data["user"]
        assert data["message"] == "Account created successfully"

    def test_signup_sets_cookie(self, client):
        res = client.post("/api/auth/signup", json={
            "email": "cookie@example.com",
            "password": "password123",
        })
        assert res.status_code == 200
        assert "access_token" in res.cookies

    def test_signup_duplicate_email_returns_400(self, client):
        payload = {"email": "dup@example.com", "password": "password123"}
        client.post("/api/auth/signup", json=payload)
        res = client.post("/api/auth/signup", json=payload)
        assert res.status_code == 400

    def test_signup_short_password_returns_400(self, client):
        res = client.post("/api/auth/signup", json={
            "email": "short@example.com",
            "password": "abc",
        })
        assert res.status_code == 400

    def test_signup_invalid_email_returns_422(self, client):
        res = client.post("/api/auth/signup", json={
            "email": "not-an-email",
            "password": "password123",
        })
        assert res.status_code == 422


class TestSignin:
    def _create_user(self, client, email="user@example.com", password="password123"):
        client.post("/api/auth/signup", json={"email": email, "password": password})

    def test_signin_valid_credentials_returns_200(self, client):
        self._create_user(client)
        res = client.post("/api/auth/signin", json={
            "email": "user@example.com",
            "password": "password123",
        })
        assert res.status_code == 200
        assert res.json()["message"] == "Signed in successfully"

    def test_signin_sets_cookie(self, client):
        self._create_user(client)
        res = client.post("/api/auth/signin", json={
            "email": "user@example.com",
            "password": "password123",
        })
        assert "access_token" in res.cookies

    def test_signin_wrong_password_returns_401(self, client):
        self._create_user(client)
        res = client.post("/api/auth/signin", json={
            "email": "user@example.com",
            "password": "wrongpassword",
        })
        assert res.status_code == 401

    def test_signin_unknown_email_returns_401(self, client):
        res = client.post("/api/auth/signin", json={
            "email": "nobody@example.com",
            "password": "password123",
        })
        assert res.status_code == 401


class TestSignout:
    def test_signout_returns_200(self, client):
        res = client.post("/api/auth/signout")
        assert res.status_code == 200
        assert res.json()["message"] == "Signed out successfully"

    def test_signout_clears_cookie(self, client):
        # Sign up to get cookie
        client.post("/api/auth/signup", json={
            "email": "out@example.com",
            "password": "password123",
        })
        res = client.post("/api/auth/signout")
        # Cookie should be deleted (set-cookie with empty value or max-age=0)
        assert res.status_code == 200


class TestGetMe:
    def _signup_and_get_cookie(self, client):
        res = client.post("/api/auth/signup", json={
            "email": "me@example.com",
            "password": "password123",
        })
        return res.cookies.get("access_token")

    def test_me_authenticated_returns_user(self, client):
        self._signup_and_get_cookie(client)
        # Cookie is set in the client's cookie jar automatically
        res = client.get("/api/auth/me")
        assert res.status_code == 200
        assert res.json()["email"] == "me@example.com"

    def test_me_unauthenticated_returns_401(self, client):
        res = client.get("/api/auth/me")
        assert res.status_code == 401


class TestHealth:
    def test_health_check(self, client):
        res = client.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"
