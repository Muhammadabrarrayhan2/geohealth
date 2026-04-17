"""
Geolocation utilities.

Pure functions — no I/O. Used by other modules to compute
distances and travel estimates between user and hospitals.
"""
import math

EARTH_RADIUS_KM = 6371.0


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Great-circle distance between two (lat, lng) points in kilometers.

    Uses the haversine formula — accurate for short-to-medium distances
    and does not require any external geocoding service.
    """
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)

    a = (math.sin(dphi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c


def estimate_travel_minutes(distance_km: float, avg_speed_kmh: float = 30.0) -> int:
    """
    Rough travel-time estimate for urban Indonesia.

    30 km/h is a conservative average accounting for traffic in cities
    like Jakarta, Surabaya, Bandung. Returned as whole minutes.
    """
    if distance_km <= 0:
        return 0
    return max(1, round((distance_km / avg_speed_kmh) * 60))
