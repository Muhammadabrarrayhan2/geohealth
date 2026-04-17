"""
Civic health insights.

This module powers the 'Side 2' of GeoHealth Compass: regional
accessibility intelligence. It aggregates the hospital dataset
by province to produce:

    - Healthcare Access Index (HAI)    — composite score per region
    - Hospital distribution summary    — count, capacity, ratings
    - Gap indicators                   — which provinces are underserved

Methodology notes (for defensibility in academic review):
    HAI is a normalized composite of four factors per province:

        1. Hospital density per province (count)
        2. Aggregate bed capacity
        3. Average hospital rating
        4. Specialty coverage breadth (# distinct specialties available)

    Each factor is min-max normalized across provinces in the dataset,
    then combined with equal weights to produce a score in [0, 100].

    In a production deployment, this would be normalized against
    province population (data source: BPS / Kemenkes) to produce a
    true per-capita access measure. For this MVP we use dataset-internal
    normalization, which is honest about its scope.
"""
from collections import defaultdict
from statistics import mean

from app.data.hospitals_seed import HOSPITALS


HAI_WEIGHTS = {
    "density": 0.30,
    "capacity": 0.30,
    "rating": 0.20,
    "specialty_breadth": 0.20,
}


def _min_max(values: dict[str, float]) -> dict[str, float]:
    """Min-max normalize a dict of numeric values. Handles flat inputs."""
    if not values:
        return {}
    vmin = min(values.values())
    vmax = max(values.values())
    if vmax == vmin:
        return {k: 0.5 for k in values}   # flat → neutral
    return {k: (v - vmin) / (vmax - vmin) for k, v in values.items()}


def _log_min_max(values: dict[str, float]) -> dict[str, float]:
    """
    Log-transformed min-max normalization for count-based factors.

    Rationale: hospital count and bed capacity follow a heavy-tailed
    distribution across Indonesian provinces — Jakarta has far more
    hospitals than every other province. A linear min-max would push
    nearly every non-Jakarta province close to 0. Log-transforming
    before normalizing compresses the outlier and produces a more
    honest relative spread that matches intuition.
    """
    import math
    if not values:
        return {}
    logged = {k: math.log1p(v) for k, v in values.items()}
    return _min_max(logged)


def compute_regional_stats() -> list[dict]:
    """
    Aggregate hospital data by province and compute the Healthcare
    Access Index (HAI) for each one.
    """
    # --- 1. Aggregate raw values per province ---
    by_province: dict[str, list[dict]] = defaultdict(list)
    for h in HOSPITALS:
        by_province[h["province"]].append(h)

    raw_density: dict[str, float] = {}
    raw_capacity: dict[str, float] = {}
    raw_rating: dict[str, float] = {}
    raw_breadth: dict[str, float] = {}

    for province, hs in by_province.items():
        raw_density[province] = len(hs)
        raw_capacity[province] = sum(h["bed_capacity"] for h in hs)
        raw_rating[province] = mean(h["rating"] for h in hs)
        distinct_specialties = set()
        for h in hs:
            distinct_specialties.update(h["specialties"])
        raw_breadth[province] = len(distinct_specialties)

    # --- 2. Normalize each factor across provinces ---
    # Count-based factors use log-min-max so Jakarta's outlier scale
    # doesn't crush the rest of the country into "underserved". Rating
    # and breadth are bounded and stay linear.
    n_density = _log_min_max(raw_density)
    n_capacity = _log_min_max(raw_capacity)
    n_rating = _min_max(raw_rating)
    n_breadth = _min_max(raw_breadth)

    # --- 3. Combine into weighted HAI ---
    results = []
    for province in by_province.keys():
        hai = (
            n_density[province] * HAI_WEIGHTS["density"]
            + n_capacity[province] * HAI_WEIGHTS["capacity"]
            + n_rating[province] * HAI_WEIGHTS["rating"]
            + n_breadth[province] * HAI_WEIGHTS["specialty_breadth"]
        ) * 100

        # Tier labels — drive the color coding on the insights page.
        # Calibrated against Indonesia's hospital-distribution reality:
        # even moderately-resourced provinces should register as
        # "moderate", not "underserved". "Underserved" is reserved for
        # genuinely low-access regions.
        if hai >= 55:
            tier = "strong"
        elif hai >= 25:
            tier = "moderate"
        else:
            tier = "underserved"

        results.append({
            "province": province,
            "hospital_count": int(raw_density[province]),
            "total_bed_capacity": int(raw_capacity[province]),
            "avg_rating": round(raw_rating[province], 2),
            "specialty_breadth": int(raw_breadth[province]),
            "healthcare_access_index": round(hai, 1),
            "tier": tier,
        })

    results.sort(key=lambda x: x["healthcare_access_index"], reverse=True)
    return results


def get_underserved_areas(threshold: float = 25.0) -> list[dict]:
    """Return provinces whose HAI falls below the threshold."""
    return [
        r for r in compute_regional_stats()
        if r["healthcare_access_index"] < threshold
    ]


def get_specialty_distribution() -> list[dict]:
    """Count hospitals offering each specialty across the whole dataset."""
    counts: dict[str, int] = defaultdict(int)
    for h in HOSPITALS:
        for s in h["specialties"]:
            counts[s] += 1
    return [
        {"specialty": s, "hospital_count": c}
        for s, c in sorted(counts.items(), key=lambda x: -x[1])
    ]


def get_national_summary() -> dict:
    """Headline KPIs for the top of the dashboard."""
    total = len(HOSPITALS)
    total_beds = sum(h["bed_capacity"] for h in HOSPITALS)
    avg_rating = round(mean(h["rating"] for h in HOSPITALS), 2)
    provinces_covered = len({h["province"] for h in HOSPITALS})
    er_count = sum(1 for h in HOSPITALS if h["services"]["emergency_24h"])
    return {
        "total_hospitals": total,
        "total_bed_capacity": total_beds,
        "avg_rating": avg_rating,
        "provinces_covered": provinces_covered,
        "emergency_capable_hospitals": er_count,
    }
