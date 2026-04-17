"use client";

import { useEffect, useState } from "react";
import { X, Scale, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { cn, formatKm, specialtyLabel } from "@/lib/utils";
import { RatingStars, Badge } from "@/components/ui/Primitives";
import type { HospitalScored, UserCoords } from "@/lib/types";

interface Props {
  ids: string[];
  user: UserCoords;
  specialty?: string;
  mode: "normal" | "emergency";
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function CompareDrawer({
  ids, user, specialty, mode, onClose, onRemove,
}: Props) {
  const [results, setResults] = useState<HospitalScored[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length < 2) { setResults(null); return; }
    setLoading(true);
    api.compare({ ids, lat: user.lat, lng: user.lng, specialty, mode })
      .then((r) => setResults(r.results))
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [ids.join(","), user.lat, user.lng, specialty, mode]);

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-ink/40 backdrop-blur-sm">
      <div
        className="w-full bg-paper rounded-t-3xl shadow-panel max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-compass-100 text-compass-700">
              <Scale size={16} />
            </div>
            <div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Hospital comparison
              </div>
              <div className="font-display text-lg text-ink">
                {ids.length} hospital{ids.length === 1 ? "" : "s"} selected
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-muted hover:bg-ink/5"
            aria-label="Close comparison"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {ids.length < 2 ? (
            <div className="py-12 text-center text-sm text-ink-muted">
              Select at least 2 hospitals to compare.
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-sm text-ink-muted">Scoring…</div>
          ) : !results ? (
            <div className="py-12 text-center text-sm text-ink-muted">
              Couldn't load comparison.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((h, idx) => (
                <div
                  key={h.id}
                  className={cn(
                    "rounded-2xl border p-4 transition",
                    idx === 0
                      ? "border-compass-500 bg-compass-50 shadow-soft"
                      : "border-ink/10 bg-paper"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {idx === 0 && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-compass-600 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
                          <Trophy size={10} /> Best match
                        </div>
                      )}
                      <h3 className="mt-1 font-display text-base font-medium leading-tight text-ink line-clamp-2">
                        {h.name}
                      </h3>
                      <div className="mt-1 text-[0.7rem] text-ink-muted">
                        {h.city}, {h.province}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(h.id)}
                      className="shrink-0 rounded-full p-1 text-ink-muted hover:bg-ink/5"
                      aria-label={`Remove ${h.name} from comparison`}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-3 rounded-xl bg-paper p-3 border border-ink/5">
                    <div className="flex items-baseline justify-between">
                      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                        Match score
                      </div>
                      <div className="font-display text-3xl font-semibold tabular-nums text-compass-700">
                        {h.score.toFixed(0)}
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/5">
                      <div
                        className="h-full rounded-full bg-compass-500"
                        style={{ width: `${h.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-ink-soft">
                    <Row label="Distance" value={formatKm(h.distance_km)} />
                    <Row label="Travel" value={`~${h.travel_minutes} min`} />
                    <Row label="Rating" value={<RatingStars value={h.rating} size={11} showNumeric={false} />} />
                    <Row label="Beds" value={h.bed_capacity.toLocaleString()} />
                    <Row label="24h ER" value={h.services.emergency_24h ? "Yes" : "No"} />
                    <Row label="Trauma" value={h.services.trauma_center ? "Yes" : "No"} />
                  </div>

                  <div className="mt-3 border-t border-ink/5 pt-3">
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-1.5">
                      Score breakdown
                    </div>
                    <div className="space-y-1">
                      {Object.entries(h.score_breakdown).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2 text-[0.7rem]">
                          <div className="w-24 shrink-0 text-ink-muted capitalize">
                            {k.replace(/_/g, " ")}
                          </div>
                          <div className="flex-1 h-1 rounded-full bg-ink/5 overflow-hidden">
                            <div
                              className="h-full bg-compass-400"
                              style={{ width: `${v * 100}%` }}
                            />
                          </div>
                          <div className="w-8 text-right tabular-nums text-ink-soft">
                            {v.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {h.specialties.slice(0, 4).map((s) => (
                      <Badge key={s} tone="compass">{specialtyLabel(s)}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
