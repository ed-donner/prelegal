"""Shared fixtures for backend tests."""

import os
import tempfile

import pytest

# Use a throwaway SQLite DB per test run so tests never touch real data.
_db_fd, _db_path = tempfile.mkstemp(suffix=".db")
os.environ["DATABASE_URL"] = f"sqlite:///{_db_path}"

from fastapi.testclient import TestClient  # noqa: E402

from database import Base, engine  # noqa: E402
from main import app  # noqa: E402


@pytest.fixture()
def client():
    # Fresh schema for every test so user counts are isolated.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as test_client:
        yield test_client