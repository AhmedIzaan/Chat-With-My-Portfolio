"""Main FastAPI application"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routers import health, chat, admin
from app.services.init_service import initialize_vector_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    Initializes vector DB on startup.
    """
    # Startup
    logger.info("Starting Portfolio RAG API...")
    logger.info(f"OpenAI Embedding Model: {settings.EMBEDDING_MODEL}")
    logger.info(f"OpenAI Chat Model: {settings.CHAT_MODEL}")
    logger.info(f"Resume File Path: {settings.RESUME_FILE_PATH}")
    logger.info(f"Chroma DB Path: {settings.CHROMA_DB_PATH}")
    
    # Initialize vector database
    logger.info("Initializing vector database...")
    result = initialize_vector_db()
    
    if result["success"]:
        logger.info(f"✓ {result['message']}")
    else:
        logger.warning(f"✗ {result['message']}")
    
    logger.info("Portfolio RAG API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Portfolio RAG API...")


# Initialize FastAPI app
app = FastAPI(
    title="Portfolio RAG API",
    description="Retrieval Augmented Generation API for portfolio/resume Q&A",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
allowed_origins = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Portfolio RAG API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat/stream",
            "admin_reload": "/api/admin/reload"
        }
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
