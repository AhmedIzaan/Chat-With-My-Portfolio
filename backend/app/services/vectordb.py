"""Vector database service using ChromaDB"""
import os
from typing import List, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.vectorstores import VectorStoreRetriever
from app.config import settings


class VectorDBService:
    """Singleton service for managing ChromaDB vector store"""
    
    _instance: Optional['VectorDBService'] = None
    _initialized: bool = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize the vector database service"""
        if not self._initialized:
            self._initialize()
            self._initialized = True
    
    def _initialize(self):
        """Set up ChromaDB client and collection"""
        # Create directory if it doesn't exist
        os.makedirs(settings.CHROMA_DB_PATH, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH,
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True,
            )
        )
        
        # Initialize Gemini embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            google_api_key=settings.GOOGLE_API_KEY
        )
        
        self.collection_name = "portfolio_resume"
        
        # Initialize Langchain Chroma wrapper
        self.vectorstore = Chroma(
            client=self.client,
            collection_name=self.collection_name,
            embedding_function=self.embeddings,
            collection_metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(self, texts: List[str]) -> int:
        """
        Add text chunks to the vector store.
        
        Args:
            texts: List of text chunks to embed and store
            
        Returns:
            Number of documents added
        """
        if not texts:
            return 0
        
        # Add texts to vector store
        self.vectorstore.add_texts(texts)
        return len(texts)
    
    def search(self, query: str, k: int = 3) -> List[str]:
        """
        Search for relevant documents using similarity search.
        
        Args:
            query: Search query
            k: Number of results to return
            
        Returns:
            List of relevant text chunks
        """
        results = self.vectorstore.similarity_search(query, k=k)
        return [doc.page_content for doc in results]
    
    def get_retriever(self, k: int = 3) -> VectorStoreRetriever:
        """
        Get a retriever for RAG pipeline with MMR search.
        
        Args:
            k: Number of results to return
            
        Returns:
            VectorStoreRetriever configured with MMR
        """
        return self.vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": k, "fetch_k": k * 3}
        )
    
    def is_empty(self) -> bool:
        """Check if the collection is empty"""
        try:
            count = self.get_count()
            return count == 0
        except Exception:
            return True
    
    def get_count(self) -> int:
        """Get the number of documents in the collection"""
        try:
            # Get the collection directly from client
            collection = self.client.get_collection(self.collection_name)
            return collection.count()
        except Exception:
            return 0
    
    def reset_collection(self):
        """Delete and recreate the collection"""
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            pass  # Collection might not exist
        
        # Reinitialize the vectorstore
        self.vectorstore = Chroma(
            client=self.client,
            collection_name=self.collection_name,
            embedding_function=self.embeddings,
            collection_metadata={"hnsw:space": "cosine"}
        )


# Global instance
vector_db_service = VectorDBService()
