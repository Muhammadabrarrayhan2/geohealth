"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles, Scale, Siren } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { FiltersPanel, type FilterState } from "@/components/hospital/FiltersPanel";
import { HospitalCard } from "@/components/hospital/HospitalCard";
import { VoiceSearchButton } from "@/components/hospital/VoiceSearchButton";
import { CompareDrawer } from "@/components/hospital/CompareDrawer";
import { LocationBanner } from "@/components/hospital/LocationBanner";
import { MapClient } from "@/components/map/MapClient";
import { api } from "@/lib/api";
import { DEFAULT_LOCATION } from "@/lib/utils";
import type { Hospital, HospitalScored, UserCoords } from "@/lib/types";

type LocStatus = "idle" | "asking" | "granted" | "denied" | "fallback";

export default function ExplorePage() {
  // --- Location state ---
  const [user, setUser] = useState<UserCoords>(DEFAULT_LOCATION);
  const [locStatus, setLocStatus] = useState<LocStatus>("idle");

  // --- Filter state ---
  const [filters, setFilters] = useState<FilterState>({
    radius_km: 25,
    emergency_only: false,
  });

  // --- Data ---
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [recommendations, setRecommendations] = useState<HospitalScored[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // --- Compare state ---
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  // --- Ask for geolocation once on mount ---
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocStatus("denied");
      return;
    }
    setLocStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  // --- Fetch hospitals whenever location/filters change ---
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.nearby({
        lat: user.lat, lng: user.lng,
        radius_km: filters.radius_km,
        specialty: filters.specialty,
        min_rating: filters.min_rating,
        emergency_only: filters.emergency_only,
      }),
      api.recommend({
        lat: user.lat, lng: user.lng,
        specialty: filters.specialty,
        mode: filters.emergency_only ? "emergency" : "normal",
        limit: 3,
      }),
    ])
      .then(([near, reco]) => {
        if (cancelled) return;
        setHospitals(near.results);
        setRecommendations(reco.results);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user.lat, user.lng, filters.radius_km, filters.specialty,
      filters.min_rating, filters.emergency_only]);

  // --- Voice intent → filter updates ---
  const handleVoiceIntent = useCallback((intent: any) => {
    setFilters((f) => ({
      ...f,
      specialty: intent.specialty ?? f.specialty,
      emergency_only: intent.emergency || f.emergency_only,
    }));
  }, []);

  // --- Compare toggling ---
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev; // cap at 4
      return [...prev, id];
    });
  };

  const focusHospital = (id: string) => {
    setSelectedId(id);
    const h = hospitals.find((x) => x.id === id);
    if (h) setMapFocus({ lat: h.lat, lng: h.lng, zoom: 14 });
  };

  const recoMode: "normal" | "emergency" = filters.emergency_only ? "emergency" : "normal";
  const topPick = recommendations[0];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
              Explore
            </div>
            <h1 className="mt-1 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Hospitals near you
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Live geolocation · {hospitals.length} results within {filters.radius_km} km
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VoiceSearchButton onIntent={handleVoiceIntent} />
            {compareIds.length > 0 && (
              <button
                onClick={() => setCompareOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-compass-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-compass-700"
              >
                <Scale size={15} /> Compare ({compareIds.length})
              </button>
            )}
          </div>
        </div>

        <LocationBanner
          status={locStatus}
          onLocated={(c) => { setUser(c); setLocStatus("granted"); }}
        />

        {/* Main 3-column layout */}
        <div className="grid gap-5 lg:grid-cols-[280px_1fr_380px]">

          {/* Left — filters */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-20 rounded-2xl border border-ink/8 bg-paper p-5">
              <div className="mb-4 font-display text-lg font-medium text-ink">Filters</div>
              <FiltersPanel value={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Center — Recommendations + Map */}
          <section className="order-1 space-y-5 lg:order-2">
            {/* Top-pick card */}
            {topPick && (
              <div className={`rounded-2xl p-5 border ${
                recoMode === "emergency"
                  ? "bg-coral-500/5 border-coral-500/30"
                  : "bg-compass-50 border-compass-200"
              }`}>
                <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em]">
                  {recoMode === "emergency" ? (
                    <span className="inline-flex items-center gap-1.5 text-coral-600">
                      <Siren size={12} /> Emergency-ready pick for you
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-compass-700">
                      <Sparkles size={12} /> Recommended for you
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-medium leading-tight text-ink">
                      {topPick.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {topPick.city}, {topPick.province} · {topPick.distance_km?.toFixed(1)} km · ~{topPick.travel_minutes} min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-4xl font-semibold leading-none tabular-nums text-compass-700">
                      {topPick.score.toFixed(0)}
                    </div>
                    <div className="mt-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                      Match score
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => focusHospital(topPick.id)}
                    className="rounded-full border border-ink/15 bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper-warm"
                  >
                    Show on map
                  </button>
                  <a
                    href={`/hospital/${topPick.id}`}
                    className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper hover:bg-ink-soft"
                  >
                    View details →
                  </a>
                </div>
              </div>
            )}

            {/* Map */}
            <div className="h-[520px] overflow-hidden rounded-2xl border border-ink/10 bg-paper-warm shadow-soft">
              <MapClient
                user={user}
                hospitals={hospitals}
                selectedId={selectedId}
                onSelect={focusHospital}
                focus={mapFocus}
              />
            </div>

            {/* Additional recommendations */}
            {recommendations.length > 1 && (
              <div>
                <div className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  Other strong matches
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {recommendations.slice(1, 3).map((h) => (
                    <div key={h.id} className="rounded-2xl border border-ink/8 bg-paper p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-display text-base font-medium text-ink">
                            {h.name}
                          </div>
                          <div className="mt-0.5 text-[0.7rem] text-ink-muted">
                            {h.city} · {h.distance_km?.toFixed(1)} km
                          </div>
                        </div>
                        <div className="shrink-0 font-display text-2xl font-semibold tabular-nums text-compass-600">
                          {h.score.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right — Hospital list */}
          <aside className="order-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-display text-lg font-medium text-ink">
                {loading ? "Loading…" : `${hospitals.length} hospitals`}
              </div>
              <div className="text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                Sorted by distance
              </div>
            </div>
            <div className="max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto pr-1">
              {hospitals.length === 0 && !loading && (
                <div className="rounded-2xl border border-dashed border-ink/15 p-6 text-center text-sm text-ink-muted">
                  No hospitals matched these filters. Try widening the radius or clearing filters.
                </div>
              )}
              {hospitals.map((h) => (
                <HospitalCard
                  key={h.id}
                  hospital={h}
                  selected={selectedId === h.id}
                  onClick={() => focusHospital(h.id)}
                  onCompareToggle={() => toggleCompare(h.id)}
                  inCompare={compareIds.includes(h.id)}
                />
              ))}
            </div>
          </aside>
        </div>
      </main>

      {compareOpen && (
        <CompareDrawer
          ids={compareIds}
          user={user}
          specialty={filters.specialty}
          mode={recoMode}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => {
            const next = compareIds.filter((x) => x !== id);
            setCompareIds(next);
            if (next.length < 2) setCompareOpen(false);
          }}
        />
      )}

      <Footer />
    </>
  );
}
