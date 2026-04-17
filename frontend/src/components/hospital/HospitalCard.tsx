"use client";

import Link from "next/link";
import { MapPin, Clock, Ambulance, Activity } from "lucide-react";
import { Badge, RatingStars } from "@/components/ui/Primitives";
import { cn, formatKm, specialtyLabel } from "@/lib/utils";
import type { Hospital } from "@/lib/types";

interface Props {
  hospital: Hospital;
  selected?: boolean;
  onClick?: () => void;
  onCompareToggle?: () => void;
  inCompare?: boolean;
}

export function HospitalCard({
  hospital: h,
  selected,
  onClick,
  onCompareToggle,
  inCompare,
}: Props) {
  const topSpecialties = h.specialties.slice(0, 3);
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-2xl border bg-paper p-4 transition",
        "hover:border-compass-300 hover:shadow-soft",
        selected
          ? "border-compass-500 shadow-panel ring-2 ring-compass-500/20"
          : "border-ink/8"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {h.services.emergency_24h && (
              <Badge tone="emergency" className="!text-[0.6rem] font-bold uppercase tracking-wider">
                24h ER
              </Badge>
            )}
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
              {h.type}
            </span>
          </div>
          <h3 className="mt-1.5 truncate font-display text-lg font-medium leading-snug text-ink">
            {h.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{h.city}, {h.province}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          {h.distance_km != null && (
            <div className="font-display text-2xl font-semibold leading-none text-compass-600 tabular-nums">
              {formatKm(h.distance_km)}
            </div>
          )}
          {h.travel_minutes != null && (
            <div className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-ink-muted">
              <Clock size={10} /> ~{h.travel_minutes} min
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">
        {h.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {topSpecialties.map((s) => (
          <Badge key={s} tone="compass">{specialtyLabel(s)}</Badge>
        ))}
        {h.specialties.length > 3 && (
          <Badge tone="neutral">+{h.specialties.length - 3} more</Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-3">
        <RatingStars value={h.rating} />
        <div className="flex items-center gap-3 text-[0.7rem] text-ink-muted">
          {h.services.icu && (
            <span className="inline-flex items-center gap-1"><Activity size={11} /> ICU</span>
          )}
          {h.services.ambulance && (
            <span className="inline-flex items-center gap-1"><Ambulance size={11} /> Ambulance</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/hospital/${h.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 rounded-full bg-ink py-2 text-center text-xs font-medium text-paper transition hover:bg-ink-soft"
        >
          View details
        </Link>
        {onCompareToggle && (
          <button
            onClick={(e) => { e.stopPropagation(); onCompareToggle(); }}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-medium transition",
              inCompare
                ? "bg-compass-600 text-white hover:bg-compass-700"
                : "border border-ink/15 text-ink hover:bg-paper-warm"
            )}
          >
            {inCompare ? "✓ Compared" : "Compare"}
          </button>
        )}
      </div>
    </div>
  );
}
