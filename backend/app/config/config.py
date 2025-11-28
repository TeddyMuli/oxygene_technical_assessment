from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bookmarks"
    DATABASE_NAME: Optional[str] = None
    DATABASE_PASSWORD: Optional[str] = None
    DATABASE_PORT: Optional[str] = None
    DATABASE_USER: Optional[str] = None
    DATABASE_HOST: Optional[str] = None
    DATABASE_TYPE: Optional[str] = None
    SECRET_KEY: str = ""
    ALGORITHM: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: float = 0
    GEMINI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        
settings = Settings()
