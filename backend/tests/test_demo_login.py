"""Tests for the fake demo login (KAN-12)."""

from sqlalchemy import select

from database import SessionLocal, User


class TestDemoLogin:
    def test_demo_login_returns_user_and_cookie(self, client):
        res = client.post("/api/auth/demo", json={"name": "Alice"})

        assert res.status_code == 200
        body = res.json()
        assert body["message"] == "Signed in as demo user"
        assert body["user"]["email"] == "demo.522b276a356b@prelegal.local"
        assert "access_token" in res.cookies

    def test_demo_login_creates_user_in_db(self, client):
        client.post("/api/auth/demo", json={"name": "Bob"})

        with SessionLocal() as db:
            user = db.execute(select(User)).scalar_one()
            assert user.email == "demo.48181acd22b3@prelegal.local"
            assert user.hashed_password  # stored but never verified

    def test_demo_login_requires_no_credentials(self, client):
        res = client.post("/api/auth/demo", json={})

        assert res.status_code == 200
        assert res.json()["user"]["email"]  # default demo user

    def test_demo_login_reuses_existing_demo_user(self, client):
        first = client.post("/api/auth/demo", json={"name": "Carol"})
        second = client.post("/api/auth/demo", json={"name": "Carol"})

        assert first.json()["user"]["id"] == second.json()["user"]["id"]

    def test_demo_user_can_access_protected_endpoint(self, client):
        res = client.post("/api/auth/demo", json={"name": "Dave"})
        cookie = {"access_token": res.cookies["access_token"]}

        me = client.get("/api/auth/me", cookies=cookie)
        assert me.status_code == 200
        assert me.json()["email"] == "demo.bfcdf3e6ca6c@prelegal.local"