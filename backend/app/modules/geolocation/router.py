"""Geolocation endpoints — mostly utility/health for the module."""
from fastapi import APIRouter
from pydantic import BaseModel

from app.modules.geolocation.service import haversine_km, estimate_travel_minutes

router = APIRouter()


class DistanceRequest(BaseModel):
    lat1: float
    lng1: float
    lat2: float
    lng2: float


@router.post("/distance")
def compute_distance(req: DistanceRequest):
    km = haversine_km(req.lat1, req.lng1, req.lat2, req.lng2)
    return {
        "distance_km": round(km, 2),
        "estimated_travel_minutes": estimate_travel_minutes(km),
    }
