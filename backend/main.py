"""FastAPI application for Prelegal."""

import os
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db
from routes.auth import router as auth_router

load_dotenv()

STATIC_DIR = Path(__file__).parent.parent / "frontend" / "out"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield


app = FastAPI(
    title="Prelegal API",
    description="Backend API for Prelegal legal document SaaS",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if STATIC_DIR.exists():
    app.mount("/_next", StaticFiles(directory=STATIC_DIR / "_next"), name="next_static")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve static files or fallback to index.html for SPA routing."""
        file_path = STATIC_DIR / full_path

        if full_path and file_path.exists() and file_path.is_file():
            return FileResponse(file_path)

        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)

        return {"error": "Frontend not built. Run 'npm run build' in frontend/"}
