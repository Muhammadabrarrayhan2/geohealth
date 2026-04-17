"""Recommendation endpoints."""
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.data.hospitals_seed import get_hospital_by_id
from app.modules.recommendation.service import (
    recommend,
    score_hospital,
    NORMAL_WEIGHTS,
    EMERGENCY_WEIGHTS,
)

router = APIRouter()


@router.get("/nearby")
def recommended_nearby(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    specialty: Optional[str] = None,
    mode: str = Query(default="normal", pattern="^(normal|emergency)$"),
    limit: int = Query(default=5, ge=1, le=20),
    radius_km: float = Query(default=50.0, gt=0, le=1000),
):
    """
    Weighted-score recommendations near the user.

    - `mode=normal` prioritizes specialty match + distance.
    - `mode=emergency` prioritizes emergency readiness + distance.
    """
    results = recommend(
        lat, lng,
        specialty=specialty,
        mode=mode,
        radius_km=radius_km,
        limit=limit,
    )
    return {
        "mode": mode,
        "weights_used": EMERGENCY_WEIGHTS if mode == "emergency" else NORMAL_WEIGHTS,
        "count": len(results),
        "results": results,
    }


@router.get("/compare")
def compare_hospitals(
    ids: str = Query(..., description="Comma-separated hospital IDs"),
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    specialty: Optional[str] = None,
    mode: str = Query(default="normal", pattern="^(normal|emergency)$"),
):
    """
    Score a user-selected set of hospitals side-by-side.

    Useful for the 'Compare hospitals' feature — the user can pick 2–4
    candidates and see the same recommendation logic applied across them.
    """
    id_list = [i.strip() for i in ids.split(",") if i.strip()]
    if not (2 <= len(id_list) <= 4):
        raise HTTPException(
            status_code=400,
            detail="Compare 2 to 4 hospitals by passing their ids as comma-separated.",
        )

    scored = []
    for hid in id_list:
        h = get_hospital_by_id(hid)
        if not h:
            raise HTTPException(status_code=404, detail=f"Hospital '{hid}' not found")
        scored.append(score_hospital(h, lat, lng, specialty, mode))

    scored.sort(key=lambda x: x["score"], reverse=True)
    return {
        "mode": mode,
        "weights_used": EMERGENCY_WEIGHTS if mode == "emergency" else NORMAL_WEIGHTS,
        "results": scored,
    }
