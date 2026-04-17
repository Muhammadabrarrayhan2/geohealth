"""Application configuration — single source of truth."""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://geohealth-phi.vercel.app",
    ]
    DEFAULT_NEARBY_RADIUS_KM: float = 25.0

    class Config:
        env_file = ".env"

    def __init__(self, **values):
        env_origins = os.getenv("CORS_ORIGINS")
        if env_origins:
            values["CORS_ORIGINS"] = [o.strip() for o in env_origins.split(",") if o.strip()]
        super().__init__(**values)


settings = Settings()