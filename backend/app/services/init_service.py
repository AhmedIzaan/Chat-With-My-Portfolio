"""Initialization service for loading resume on startup"""
import os
import logging
from app.config import settings
from app.services.parser import parse_resume, chunk_text
from app.services.vectordb import vector_db_service

logger = logging.getLogger(__name__)


def initialize_vector_db() -> dict:
    """
    Initialize vector database with resume data.
    Checks if collection is empty and loads resume from file if needed.
    
    Returns:
        Dict with initialization status and chunk count
    """
    try:
        # Check if vector DB already has data
        doc_count = vector_db_service.get_count()
        if doc_count > 0:
            logger.info(f"Vector DB already initialized with {doc_count} documents")
            return {
                "success": True,
                "chunks_created": doc_count,
                "message": "Vector DB already initialized"
            }
        
        # Check if resume file exists
        if not os.path.exists(settings.RESUME_FILE_PATH):
            logger.warning(f"Resume file not found at {settings.RESUME_FILE_PATH}")
            return {
                "success": False,
                "chunks_created": 0,
                "message": f"Resume file not found at {settings.RESUME_FILE_PATH}"
            }
        
        logger.info(f"Loading resume from {settings.RESUME_FILE_PATH}")
        
        # Parse resume
        resume_text = parse_resume(settings.RESUME_FILE_PATH)
        logger.info(f"Successfully parsed resume ({len(resume_text)} characters)")
        
        # Chunk the text
        chunks = chunk_text(resume_text)
        logger.info(f"Created {len(chunks)} chunks from resume")
        
        # Reset collection to ensure clean state
        vector_db_service.reset_collection()
        
        # Add chunks to vector DB
        chunks_added = vector_db_service.add_documents(chunks)
        logger.info(f"Added {chunks_added} chunks to vector database")
        
        return {
            "success": True,
            "chunks_created": chunks_added,
            "message": f"Successfully initialized with {chunks_added} chunks"
        }
        
    except Exception as e:
        error_msg = f"Error initializing vector DB: {str(e)}"
        logger.error(error_msg)
        return {
            "success": False,
            "chunks_created": 0,
            "message": error_msg
        }
