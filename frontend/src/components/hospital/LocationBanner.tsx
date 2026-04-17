"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import type { UserCoords } from "@/lib/types";

// A small set of fallback cities — if the user denies geolocation, they
// can still anchor the map to a real Indonesian city without typing a
// coordinate. Demo-friendly without a full geocoder.
const FALLBACK_CITIES: Array<{ name: string; lat: number; lng: number }> = [
  { name: "Jakarta",   lat: -6.2,   lng: 106.816666 },
  { name: "Bandung",   lat: -6.9175, lng: 107.6191 },
  { name: "Surabaya",  lat: -7.2575, lng: 112.7521 },
  { name: "Yogyakarta",lat: -7.7956, lng: 110.3695 },
  { name: "Medan",     lat: 3.5952,  lng: 98.6722 },
  { name: "Denpasar",  lat: -8.6705, lng: 115.2126 },
  { name: "Makassar",  lat: -5.1477, lng: 119.4327 },
  { name: "Semarang",  lat: -6.9667, lng: 110.4167 },
];

interface Props {
  onLocated: (c: UserCoords) => void;
  status: "idle" | "asking" | "granted" | "denied" | "fallback";
}

export function LocationBanner({ onLocated, status }: Props) {
  const [selectedCity, setSelectedCity] = useState("");

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => onLocated({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {/* handled by parent state */},
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  if (status === "granted") return null;

  return (
    <div className="mb-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/30 text-[#8A6A0F]">
          <MapPin size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink">
            {status === "denied"
              ? "Location access blocked"
              : "Share your location to see nearby hospitals"}
          </div>
          <div className="mt-0.5 text-xs text-ink-muted">
            Your location is used only in the browser to compute distance. It is never stored.
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={requestLocation}
              className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper hover:bg-ink-soft"
            >
              Use my location
            </button>
            <span className="text-xs text-ink-muted">or pick a city:</span>
            <select
              value={selectedCity}
              onChange={(e) => {
                const c = FALLBACK_CITIES.find((x) => x.name === e.target.value);
                if (c) { onLocated({ lat: c.lat, lng: c.lng }); setSelectedCity(c.name); }
              }}
              className="rounded-full border border-ink/15 bg-paper px-3 py-1.5 text-xs text-ink"
            >
              <option value="">Select…</option>
              {FALLBACK_CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
