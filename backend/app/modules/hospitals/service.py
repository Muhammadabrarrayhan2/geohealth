"""
Hospital data access + search/filter logic.

The service layer is intentionally lightweight — it queries the
in-memory seed and applies filters. In a production version this
would back onto PostgreSQL (or PostgreSQL + PostGIS for spatial
operations), but the interface stays the same.
"""
from typing import Optional

from app.data.hospitals_seed import HOSPITALS, get_hospital_by_id
from app.modules.geolocation.service import haversine_km, estimate_travel_minutes


def list_hospitals(
    *,
    city: Optional[str] = None,
    province: Optional[str] = None,
    specialty: Optional[str] = None,
    min_rating: Optional[float] = None,
    emergency_only: bool = False,
) -> list[dict]:
    """Return hospitals filtered by the provided criteria."""
    result = list(HOSPITALS)

    if city:
        result = [h for h in result if h["city"].lower() == city.lower()]
    if province:
        result = [h for h in result if h["province"].lower() == province.lower()]
    if specialty:
        result = [h for h in result if specialty in h["specialties"]]
    if min_rating is not None:
        result = [h for h in result if h["rating"] >= min_rating]
    if emergency_only:
        result = [h for h in result if h["services"]["emergency_24h"]]

    return result


def get_nearby(
    user_lat: float,
    user_lng: float,
    *,
    radius_km: float = 25.0,
    specialty: Optional[str] = None,
    min_rating: Optional[float] = None,
    emergency_only: bool = False,
    limit: int = 50,
) -> list[dict]:
    """
    Return hospitals within `radius_km` of the user, with distance
    and travel-time attached. Results are sorted ascending by distance.
    """
    pool = list_hospitals(
        specialty=specialty,
        min_rating=min_rating,
        emergency_only=emergency_only,
    )

    enriched = []
    for h in pool:
        d = haversine_km(user_lat, user_lng, h["lat"], h["lng"])
        if d <= radius_km:
            item = {
                **h,
                "distance_km": round(d, 2),
                "travel_minutes": estimate_travel_minutes(d),
            }
            enriched.append(item)

    enriched.sort(key=lambda x: x["distance_km"])
    return enriched[:limit]


def get_by_id(hospital_id: str) -> dict | None:
    return get_hospital_by_id(hospital_id)
