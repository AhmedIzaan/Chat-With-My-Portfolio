"""Health check endpoint"""
from fastapi import APIRouter
from app.models import HealthResponse
from app.services.vectordb import vector_db_service

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for monitoring service status.
    Returns vector DB status and document count.
    """
    doc_count = vector_db_service.get_count()
    
    return HealthResponse(
        status="healthy",
        vector_db_count=doc_count,
        resume_loaded=doc_count > 0
    )
