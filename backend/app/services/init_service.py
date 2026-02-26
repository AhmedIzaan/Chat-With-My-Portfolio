"""Initialization service for loading resume and profile on startup"""
import os
import logging
from app.config import settings
from app.services.parser import parse_document, chunk_text
from app.services.vectordb import vector_db_service

logger = logging.getLogger(__name__)


def force_reinitialize_vector_db() -> dict:
    """
    Force a full re-ingestion: wipe the collection and re-embed all documents.
    Always runs regardless of existing data.
    """
    try:
        vector_db_service.reset_collection()
        logger.info("Collection reset. Re-ingesting documents...")
    except Exception as e:
        return {"success": False, "chunks_created": 0, "message": f"Failed to reset collection: {e}"}

    # Reuse main logic by falling through with empty DB
    return initialize_vector_db()


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
        
        all_chunks: list[str] = []

        # --- Resume ---
        if os.path.exists(settings.RESUME_FILE_PATH):
            logger.info(f"Loading resume from {settings.RESUME_FILE_PATH}")
            resume_text = parse_document(settings.RESUME_FILE_PATH)
            logger.info(f"Parsed resume ({len(resume_text)} characters)")
            all_chunks.extend(chunk_text(resume_text))
        else:
            logger.warning(f"Resume file not found at {settings.RESUME_FILE_PATH}")

        # --- Profile / bio text ---
        if os.path.exists(settings.PROFILE_FILE_PATH):
            logger.info(f"Loading profile from {settings.PROFILE_FILE_PATH}")
            profile_text = parse_document(settings.PROFILE_FILE_PATH)
            logger.info(f"Parsed profile ({len(profile_text)} characters)")
            all_chunks.extend(chunk_text(profile_text))
        else:
            logger.info(f"No profile file found at {settings.PROFILE_FILE_PATH} — skipping")

        if not all_chunks:
            return {
                "success": False,
                "chunks_created": 0,
                "message": "No documents found to ingest (resume and profile both missing)"
            }

        logger.info(f"Total chunks to embed: {len(all_chunks)}")

        # Reset collection to ensure clean state
        vector_db_service.reset_collection()

        # Add all chunks to vector DB
        chunks_added = vector_db_service.add_documents(all_chunks)
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
