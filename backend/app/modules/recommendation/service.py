"""
Hospital recommendation engine.

Weighted scoring system with two operational modes:

    NORMAL mode       — emphasis on specialty match and convenience.
    EMERGENCY mode    — emphasis on emergency readiness and speed.

All factor scores are normalized to [0, 1] before being multiplied by
their weights. Final score is rescaled to [0, 100] for readability.
"""
from typing import Optional

from app.modules.geolocation.service import haversine_km, estimate_travel_minutes
from app.data.hospitals_seed import HOSPITALS


# ---------- Weighting profiles ----------

NORMAL_WEIGHTS = {
    "specialty_match": 0.35,
    "distance": 0.30,
    "rating": 0.10,
    "service_completeness": 0.15,
    "healthcare_access": 0.10,
}

EMERGENCY_WEIGHTS = {
    "emergency_readiness": 0.40,
    "distance": 0.35,
    "service_completeness": 0.15,
    "rating": 0.05,
    "healthcare_access": 0.05,
}

# Services considered when computing service completeness.
SERVICE_KEYS = ["emergency_24h", "icu", "ambulance",
                "bpjs_accepted", "trauma_center", "nicu"]

# Max expected usable distance (km). Beyond this, distance score = 0.
DISTANCE_CAP_KM = 50.0


# ---------- Factor normalizers ----------

def _normalize_rating(rating: float) -> float:
    """Map rating in [1.0, 5.0] → [0, 1]."""
    return max(0.0, min(1.0, (rating - 1.0) / 4.0))


def _normalize_distance(distance_km: float) -> float:
    """Closer is better. Linear decay, capped at DISTANCE_CAP_KM."""
    if distance_km <= 0:
        return 1.0
    if distance_km >= DISTANCE_CAP_KM:
        return 0.0
    return 1.0 - (distance_km / DISTANCE_CAP_KM)


def _specialty_match(hospital: dict, specialty: Optional[str]) -> float:
    """1.0 if hospital offers the requested specialty, else 0.3."""
    if not specialty:
        # With no specialty filter, don't penalize; treat as neutral.
        return 0.7
    return 1.0 if specialty in hospital["specialties"] else 0.3


def _service_completeness(hospital: dict) -> float:
    """Share of standard service indicators this hospital provides."""
    present = sum(1 for k in SERVICE_KEYS if hospital["services"].get(k))
    return present / len(SERVICE_KEYS)


def _emergency_readiness(hospital: dict) -> float:
    """
    Composite of emergency-critical capabilities.
    Weights: 24h ER is the biggest component, then ICU, trauma, ambulance.
    """
    s = hospital["services"]
    components = [
        (s.get("emergency_24h", False), 0.40),
        (s.get("icu", False), 0.25),
        (s.get("trauma_center", False), 0.20),
        (s.get("ambulance", False), 0.15),
    ]
    return sum(w for present, w in components if present)


def _healthcare_access(hospital: dict) -> float:
    """
    Proxy for a hospital's contribution to local healthcare access.

    Uses bed capacity scaled against a national reference ceiling
    (1500 beds ≈ largest in our dataset). Larger capacity → higher
    systemic contribution to regional access.
    """
    return min(1.0, hospital.get("bed_capacity", 0) / 1500.0)


# ---------- Scoring ----------

def score_hospital(
    hospital: dict,
    user_lat: float,
    user_lng: float,
    specialty: Optional[str] = None,
    mode: str = "normal",
) -> dict:
    """Compute factor scores + weighted total for a single hospital."""
    distance_km = haversine_km(user_lat, user_lng,
                               hospital["lat"], hospital["lng"])

    factors = {
        "specialty_match": _specialty_match(hospital, specialty),
        "distance": _normalize_distance(distance_km),
        "rating": _normalize_rating(hospital["rating"]),
        "service_completeness": _service_completeness(hospital),
        "emergency_readiness": _emergency_readiness(hospital),
        "healthcare_access": _healthcare_access(hospital),
    }

    weights = EMERGENCY_WEIGHTS if mode == "emergency" else NORMAL_WEIGHTS
    total = sum(factors[key] * weight for key, weight in weights.items())

    return {
        **hospital,
        "distance_km": round(distance_km, 2),
        "travel_minutes": estimate_travel_minutes(distance_km),
        "score": round(total * 100, 1),   # 0–100 for UI readability
        "score_breakdown": {k: round(factors[k], 3) for k in weights.keys()},
        "mode_used": mode,
    }


def recommend(
    user_lat: float,
    user_lng: float,
    *,
    specialty: Optional[str] = None,
    mode: str = "normal",
    radius_km: float = 50.0,
    limit: int = 5,
) -> list[dict]:
    """Return the top-N hospitals ranked by the weighted scoring system."""
    candidates = []
    for h in HOSPITALS:
        distance_km = haversine_km(user_lat, user_lng, h["lat"], h["lng"])
        if distance_km > radius_km:
            continue
        # Emergency mode should only consider emergency-capable hospitals.
        if mode == "emergency" and not h["services"].get("emergency_24h"):
            continue
        candidates.append(score_hospital(h, user_lat, user_lng, specialty, mode))

    # Fallback: if strict filtering returned nothing, search wider so the
    # user always gets a useful recommendation rather than an empty state.
    if not candidates:
        for h in HOSPITALS:
            if mode == "emergency" and not h["services"].get("emergency_24h"):
                continue
            candidates.append(score_hospital(h, user_lat, user_lng, specialty, mode))

    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates[:limit]
