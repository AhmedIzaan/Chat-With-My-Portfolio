"""Configuration settings for the Portfolio RAG API"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Required settings
    GOOGLE_API_KEY: str
    
    # CORS settings
    ALLOWED_ORIGINS: str = "*"
    
    # Paths
    CHROMA_DB_PATH: str = "/tmp/chroma_db"
    RESUME_FILE_PATH: str = "/app/data/resume.pdf"
    
    # Gemini models
    EMBEDDING_MODEL: str = "models/gemini-embedding-001"
    CHAT_MODEL: str = "gemini-2.5-flash"
    
    # Chat settings
    TEMPERATURE: float = 0.3
    MAX_TOKENS: int = 1000
    
    # Text processing settings
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 100
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


# Global settings instance
settings = Settings()
