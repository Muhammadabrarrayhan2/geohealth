# GeoHealth Compass — Backend

FastAPI modular monolith powering nationwide hospital discovery and
civic-health insights.

## Modules

```
app/
├── core/                     # config
├── data/                     # hospital seed (22 hospitals, 14 provinces)
└── modules/
    ├── geolocation/          # haversine + travel-time utilities
    ├── hospitals/            # list, search, nearby, detail
    ├── recommendation/       # weighted scoring (normal + emergency)
    ├── voice/                # deterministic EN+ID intent parser
    └── insights/             # Healthcare Access Index + regional gaps
```

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs auto-generated at `http://localhost:8000/docs`.

## Key endpoints

| Method | Path                                 | Purpose                              |
|--------|--------------------------------------|--------------------------------------|
| GET    | `/api/hospitals`                     | List with filters                    |
| GET    | `/api/hospitals/nearby?lat=&lng=`    | Nearby hospitals sorted by distance  |
| GET    | `/api/hospitals/specialties`         | Specialty catalog                    |
| GET    | `/api/hospitals/{id}`                | Hospital detail                      |
| GET    | `/api/recommendations/nearby`        | Top-N ranked hospitals               |
| GET    | `/api/recommendations/compare`       | Score 2–4 hospitals side-by-side     |
| POST   | `/api/voice/parse`                   | Transcript → structured filters      |
| GET    | `/api/insights/summary`              | National KPIs                        |
| GET    | `/api/insights/regional`             | HAI per province                     |
| GET    | `/api/insights/underserved`          | Provinces below HAI threshold        |
| GET    | `/api/insights/specialty-distribution` | Specialty coverage across dataset  |
