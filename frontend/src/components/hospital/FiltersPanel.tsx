"use client";

import { useEffect, useState } from "react";
import { Siren, Star, SlidersHorizontal } from "lucide-react";
import { cn, specialtyLabel } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Specialty } from "@/lib/types";

export interface FilterState {
  specialty?: string;
  radius_km: number;
  min_rating?: number;
  emergency_only: boolean;
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function FiltersPanel({ value, onChange }: Props) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    api.specialties().then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  const update = (patch: Partial<FilterState>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      {/* Emergency toggle — front and center */}
      <button
        onClick={() => update({ emergency_only: !value.emergency_only })}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition",
          value.emergency_only
            ? "border-coral-500 bg-coral-500/10"
            : "border-ink/10 hover:bg-paper-warm"
        )}
      >
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          value.emergency_only ? "bg-coral-500 text-white" : "bg-coral-500/10 text-coral-600"
        )}>
          <Siren size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink">Emergency-ready only</div>
          <div className="truncate text-xs text-ink-muted">
            24-hour ER · ICU · ambulance
          </div>
        </div>
        <div className={cn(
          "h-5 w-9 shrink-0 rounded-full p-0.5 transition",
          value.emergency_only ? "bg-coral-500" : "bg-ink/15"
        )}>
          <div className={cn(
            "h-4 w-4 rounded-full bg-white transition",
            value.emergency_only && "translate-x-4"
          )} />
        </div>
      </button>

      {/* Specialty */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <SlidersHorizontal size={12} /> Specialty / medical need
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => update({ specialty: undefined })}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              !value.specialty
                ? "bg-ink text-paper"
                : "border border-ink/15 text-ink-soft hover:bg-paper-warm"
            )}
          >
            Any
          </button>
          {specialties.map((s) => (
            <button
              key={s.value}
              onClick={() => update({ specialty: s.value })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                value.specialty === s.value
                  ? "bg-compass-600 text-white"
                  : "border border-ink/15 text-ink-soft hover:bg-paper-warm"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <div className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <span>Search radius</span>
          <span className="text-ink tabular-nums">{value.radius_km} km</span>
        </div>
        <input
          type="range"
          min={5} max={100} step={5}
          value={value.radius_km}
          onChange={(e) => update({ radius_km: Number(e.target.value) })}
          className="w-full accent-compass-600"
        />
        <div className="mt-1 flex justify-between text-[0.65rem] text-ink-muted">
          <span>5 km</span><span>100 km</span>
        </div>
      </div>

      {/* Minimum rating */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <Star size={12} /> Minimum rating
        </div>
        <div className="flex gap-1.5">
          {[undefined, 3.5, 4.0, 4.5].map((r, i) => (
            <button
              key={i}
              onClick={() => update({ min_rating: r })}
              className={cn(
                "flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition",
                value.min_rating === r
                  ? "border-compass-500 bg-compass-50 text-compass-700"
                  : "border-ink/10 text-ink-soft hover:bg-paper-warm"
              )}
            >
              {r == null ? "Any" : `${r.toFixed(1)}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
