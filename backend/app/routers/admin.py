"""Admin endpoints for managing the system"""
from fastapi import APIRouter
from app.models import ReloadResponse
from app.services.init_service import initialize_vector_db, force_reinitialize_vector_db

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/reload", response_model=ReloadResponse)
async def reload_vector_db():
    """
    Load documents into vector DB only if it is currently empty.
    No-op if data already exists.
    """
    result = initialize_vector_db()
    return ReloadResponse(
        success=result["success"],
        chunks_created=result["chunks_created"],
        message=result["message"]
    )


@router.post("/reinitialize", response_model=ReloadResponse)
async def reinitialize_vector_db():
    """
    Force wipe and re-embed all documents (resume + profile).
    Use this after updating any file in data/.
    """
    result = force_reinitialize_vector_db()
    return ReloadResponse(
        success=result["success"],
        chunks_created=result["chunks_created"],
        message=result["message"]
    )
