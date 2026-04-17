"""Pydantic schemas for hospital responses."""
from pydantic import BaseModel


class HospitalServices(BaseModel):
    emergency_24h: bool
    icu: bool
    ambulance: bool
    bpjs_accepted: bool
    trauma_center: bool
    nicu: bool


class HospitalBase(BaseModel):
    id: str
    name: str
    short_name: str
    type: str
    city: str
    province: str
    address: str
    lat: float
    lng: float
    rating: float
    specialties: list[str]
    services: HospitalServices
    bed_capacity: int
    summary: str


class HospitalWithDistance(HospitalBase):
    distance_km: float | None = None
    travel_minutes: int | None = None


class HospitalScored(HospitalWithDistance):
    """Hospital with a recommendation score attached."""
    score: float
    score_breakdown: dict
