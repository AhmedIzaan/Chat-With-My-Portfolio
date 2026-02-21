"""RAG (Retrieval Augmented Generation) service"""
from typing import AsyncGenerator
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.config import settings
from app.services.vectordb import vector_db_service


class RAGService:
    """Service for handling RAG pipeline with streaming support"""
    
    def __init__(self):
        """Initialize RAG service with LLM and prompt template"""
        # Initialize Gemini LLM with streaming
        self.llm = ChatGoogleGenerativeAI(
            model=settings.CHAT_MODEL,
            temperature=settings.TEMPERATURE,
            max_output_tokens=settings.MAX_TOKENS,
            google_api_key=settings.GOOGLE_API_KEY
        )
        
        # Define prompt template
        self.prompt = ChatPromptTemplate.from_template(
            """You are an AI assistant answering questions about a software engineer's portfolio/resume.
Use only the provided context to answer the question. Be concise, specific, and professional.
If the context doesn't contain relevant information, say so honestly.

Context:
{context}

Question: {question}

Answer:"""
        )
        
        # Chain is built lazily to avoid stale collection references
        self._chain = None
    
    def _build_chain(self):
        """Build (or rebuild) the LCEL chain with a fresh retriever"""
        retriever = vector_db_service.get_retriever(k=3)
        self._chain = (
            {
                "context": retriever | self._format_docs,
                "question": RunnablePassthrough()
            }
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
        return self._chain
    
    @property
    def chain(self):
        """Always return a chain with the current vectorstore retriever"""
        return self._build_chain()
    
    def _format_docs(self, docs) -> str:
        """Format retrieved documents into a single context string"""
        if not docs:
            return "No relevant information found in the resume."
        return "\n\n".join([doc.page_content for doc in docs])
    
    async def stream_answer(self, question: str) -> AsyncGenerator[str, None]:
        """
        Stream answer to a question using RAG pipeline.
        
        Args:
            question: User's question
            
        Yields:
            Text chunks as they're generated
        """
        try:
            # Check if vector DB is empty
            if vector_db_service.is_empty():
                yield "Error: No resume data loaded. Please upload a resume first."
                return
            
            # Stream the response
            async for chunk in self.chain.astream(question):
                if chunk:
                    yield chunk
                    
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            yield error_msg


# Global instance
rag_service = RAGService()
