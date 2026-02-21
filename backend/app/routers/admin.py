"""Admin endpoints for managing the system"""
from fastapi import APIRouter
from app.models import ReloadResponse
from app.services.init_service import initialize_vector_db

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/reload", response_model=ReloadResponse)
async def reload_vector_db():
    """
    Manually trigger reload of vector database from resume file.
    Useful for testing or forcing a refresh without restarting the service.
    
    Returns:
        ReloadResponse with success status and chunk count
    """
    result = initialize_vector_db()
    
    return ReloadResponse(
        success=result["success"],
        chunks_created=result["chunks_created"],
        message=result["message"]
    )
