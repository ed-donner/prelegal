"""Unit tests for security utilities."""

import pytest
from core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)


class TestPasswordHashing:
    def test_hash_is_not_plaintext(self):
        hashed = get_password_hash("mysecret")
        assert hashed != "mysecret"

    def test_correct_password_verifies(self):
        hashed = get_password_hash("mysecret")
        assert verify_password("mysecret", hashed) is True

    def test_wrong_password_fails(self):
        hashed = get_password_hash("mysecret")
        assert verify_password("wrongpassword", hashed) is False

    def test_hashes_are_unique(self):
        h1 = get_password_hash("same")
        h2 = get_password_hash("same")
        assert h1 != h2  # bcrypt uses random salt


class TestJWT:
    def test_create_and_decode_token(self):
        token = create_access_token(user_id=42, email="user@example.com")
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "42"
        assert payload["email"] == "user@example.com"

    def test_invalid_token_returns_none(self):
        result = decode_access_token("not.a.valid.token")
        assert result is None

    def test_tampered_token_returns_none(self):
        token = create_access_token(user_id=1, email="x@example.com")
        tampered = token[:-5] + "XXXXX"
        assert decode_access_token(tampered) is None
