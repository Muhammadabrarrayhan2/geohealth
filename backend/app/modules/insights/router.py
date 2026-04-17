"""Civic-health insights endpoints."""
from fastapi import APIRouter, Query

from app.modules.insights import service

router = APIRouter()


@router.get("/summary")
def national_summary():
    """Headline KPIs for the dashboard top."""
    return service.get_national_summary()


@router.get("/regional")
def regional_stats():
    """Per-province HAI + supporting metrics, sorted descending."""
    return service.compute_regional_stats()


@router.get("/underserved")
def underserved(threshold: float = Query(default=25.0, ge=0, le=100)):
    """Provinces below the HAI threshold — 'gap' indicators."""
    return service.get_underserved_areas(threshold=threshold)


@router.get("/specialty-distribution")
def specialty_distribution():
    """How specialties are distributed across the hospital dataset."""
    return service.get_specialty_distribution()
