# GeoHealth Compass — Frontend

Next.js 14 app (App Router) with Tailwind CSS, Leaflet, Recharts.

## Run locally

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Visit `http://localhost:3000`. The backend must be running at
`http://localhost:8000` (or whatever `NEXT_PUBLIC_API_BASE` points to).

## Structure

```
src/
├── app/
│   ├── page.tsx                # Landing
│   ├── explore/page.tsx        # Map + filters + voice + compare
│   ├── hospital/[id]/page.tsx  # Hospital detail
│   ├── insights/page.tsx       # Civic dashboard
│   ├── about/page.tsx          # Methodology + disclaimers
│   ├── layout.tsx              # Fonts, Leaflet CSS, <html>
│   └── globals.css             # Tailwind + custom animations
├── components/
│   ├── layout/     # Nav, Footer, Logo
│   ├── ui/         # Button, Card, Badge, RatingStars, SectionHeading
│   ├── hospital/   # HospitalCard, FiltersPanel, VoiceSearchButton, CompareDrawer, LocationBanner
│   └── map/        # HospitalMap (Leaflet), MapClient (dynamic wrapper)
└── lib/
    ├── api.ts      # Typed fetch client
    ├── types.ts    # Shared types
    └── utils.ts    # cn(), formatters, specialtyLabel()
```

## Design notes

- **Typography**: Fraunces (display) + Inter Tight (body) for a distinctive
  civic-tech serif/sans pair — intentionally not Inter/Space Grotesk.
- **Palette**: Teal-cyan primary (`compass`), warm coral accent, paper/cream
  background with deep ink text. Chosen to feel trustworthy and warm rather
  than sterile medical blue.
- **Map**: CARTO Voyager tiles render cleanly under rounded corners.
- **Voice**: Web Speech API with typed fallback; never stores audio.
