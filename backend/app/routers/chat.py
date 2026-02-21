"""Chat endpoint with streaming support"""
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models import ChatRequest
from app.services.rag_service import rag_service

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream chat responses using Server-Sent Events (SSE).
    
    Args:
        request: ChatRequest with user's question
        
    Returns:
        StreamingResponse with SSE events
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    async def generate():
        """Generator function for SSE streaming"""
        try:
            async for chunk in rag_service.stream_answer(request.question):
                # Format as SSE event
                data = json.dumps({"content": chunk})
                yield f"data: {data}\n\n"
            
            # Send completion event
            yield f"data: {json.dumps({'done': True})}\n\n"
            
        except Exception as e:
            # Send error event
            error_data = json.dumps({"error": str(e)})
            yield f"data: {error_data}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )
