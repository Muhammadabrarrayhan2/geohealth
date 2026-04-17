"""Application configuration — single source of truth."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    # Default search radius when user asks for "nearby" hospitals (km)
    DEFAULT_NEARBY_RADIUS_KM: float = 25.0

    class Config:
        env_file = ".env"


settings = Settings()
