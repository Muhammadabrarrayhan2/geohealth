"""
GeoHealth Compass — FastAPI backend entry point.

Modular monolith: one app, multiple clearly-separated modules.
Each module lives under app/modules/ and exposes its own router.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.modules.hospitals.router import router as hospitals_router
from app.modules.geolocation.router import router as geo_router
from app.modules.recommendation.router import router as reco_router
from app.modules.voice.router import router as voice_router
from app.modules.insights.router import router as insights_router

app = FastAPI(
    title="GeoHealth Compass API",
    description=(
        "Nationwide smart hospital discovery and healthcare access "
        "intelligence platform — public utility + civic health insight."
    ),
    version="0.1.0",
)

# CORS: frontend runs on localhost:3000 during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["meta"])
def root():
    return {
        "name": "GeoHealth Compass API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


# Register modules
app.include_router(hospitals_router, prefix="/api/hospitals", tags=["hospitals"])
app.include_router(geo_router, prefix="/api/geo", tags=["geolocation"])
app.include_router(reco_router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(voice_router, prefix="/api/voice", tags=["voice"])
app.include_router(insights_router, prefix="/api/insights", tags=["insights"])
