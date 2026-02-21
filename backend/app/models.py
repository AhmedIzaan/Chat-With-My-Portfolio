"""Pydantic models for API request/response validation"""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    question: str = Field(..., min_length=1, max_length=1000, description="User's question about the portfolio")


class ChatResponse(BaseModel):
    """Response model for chat endpoint (non-streaming)"""
    answer: str = Field(..., description="AI-generated answer")


class HealthResponse(BaseModel):
    """Response model for health check endpoint"""
    status: str = Field(..., description="Service status")
    vector_db_count: int = Field(..., description="Number of documents in vector DB")
    resume_loaded: bool = Field(..., description="Whether resume has been loaded")


class ReloadResponse(BaseModel):
    """Response model for reload endpoint"""
    success: bool = Field(..., description="Whether reload was successful")
    chunks_created: int = Field(..., description="Number of chunks created")
    message: str = Field(..., description="Status message")
