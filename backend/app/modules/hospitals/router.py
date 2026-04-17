"""Hospital search and lookup endpoints."""
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.core.config import settings
from app.data.hospitals_seed import SPECIALTIES, SPECIALTY_LABELS
from app.modules.hospitals import service

router = APIRouter()


@router.get("")
def list_hospitals(
    city: Optional[str] = None,
    province: Optional[str] = None,
    specialty: Optional[str] = None,
    min_rating: Optional[float] = Query(default=None, ge=1.0, le=5.0),
    emergency_only: bool = False,
):
    """List hospitals with optional filters."""
    return service.list_hospitals(
        city=city,
        province=province,
        specialty=specialty,
        min_rating=min_rating,
        emergency_only=emergency_only,
    )


@router.get("/nearby")
def nearby_hospitals(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(default=settings.DEFAULT_NEARBY_RADIUS_KM, gt=0, le=1000),
    specialty: Optional[str] = None,
    min_rating: Optional[float] = Query(default=None, ge=1.0, le=5.0),
    emergency_only: bool = False,
    limit: int = Query(default=50, ge=1, le=100),
):
    """
    Return hospitals near the given coordinates, sorted by distance.

    If none are found within the initial radius (e.g. user is far from
    any seeded city), the radius auto-expands to cover the entire dataset
    so the map never renders empty. This keeps the MVP demo-friendly
    across any Indonesian location.
    """
    hospitals = service.get_nearby(
        lat, lng,
        radius_km=radius_km,
        specialty=specialty,
        min_rating=min_rating,
        emergency_only=emergency_only,
        limit=limit,
    )

    # Graceful fallback: if the filter radius returns nothing, widen it
    # rather than returning an empty list, so users always see something.
    if not hospitals:
        hospitals = service.get_nearby(
            lat, lng,
            radius_km=10_000,
            specialty=specialty,
            min_rating=min_rating,
            emergency_only=emergency_only,
            limit=limit,
        )

    return {
        "count": len(hospitals),
        "radius_km_used": radius_km,
        "results": hospitals,
    }


@router.get("/specialties")
def list_specialties():
    """Expose the specialty catalog with display labels."""
    return [
        {"value": s, "label": SPECIALTY_LABELS.get(s, s.title())}
        for s in SPECIALTIES
    ]


@router.get("/{hospital_id}")
def get_hospital_detail(hospital_id: str):
    hospital = service.get_by_id(hospital_id)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hospital
