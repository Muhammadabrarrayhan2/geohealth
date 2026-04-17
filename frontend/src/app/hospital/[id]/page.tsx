"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Bed, Stethoscope, ShieldCheck, Ambulance,
  Activity, Siren, BadgeCheck, AlertTriangle,
} from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Badge, RatingStars, Card } from "@/components/ui/Primitives";
import { MapClient } from "@/components/map/MapClient";
import { api } from "@/lib/api";
import { specialtyLabel } from "@/lib/utils";
import type { Hospital } from "@/lib/types";

export default function HospitalDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.detail(id)
      .then(setHospital)
      .catch(() => setNotFoundFlag(true));
  }, [id]);

  if (notFoundFlag) notFound();
  if (!hospital) {
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded-full bg-ink/5" />
            <div className="h-40 rounded-2xl bg-ink/5" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 rounded-2xl bg-ink/5" />
              <div className="h-24 rounded-2xl bg-ink/5" />
              <div className="h-24 rounded-2xl bg-ink/5" />
            </div>
          </div>
        </main>
      </>
    );
  }

  const h = hospital;

  // Derive simple indicators for the UI
  const serviceIndicators = [
    { key: "emergency_24h", label: "24-hour Emergency", icon: Siren,      on: h.services.emergency_24h },
    { key: "icu",           label: "ICU Available",     icon: Activity,   on: h.services.icu },
    { key: "ambulance",     label: "Ambulance Service", icon: Ambulance,  on: h.services.ambulance },
    { key: "trauma_center", label: "Trauma Center",     icon: ShieldCheck,on: h.services.trauma_center },
    { key: "nicu",          label: "Neonatal ICU",      icon: Activity,   on: h.services.nicu },
    { key: "bpjs_accepted", label: "BPJS Accepted",     icon: BadgeCheck, on: h.services.bpjs_accepted },
  ];

  // Healthcare-score proxy: show capacity + rating + services as a visible "quality indicator"
  const completeness = Object.values(h.services).filter(Boolean).length / 6;
  const qualityScore = Math.round(
    (completeness * 0.4 + ((h.rating - 1) / 4) * 0.4 + Math.min(1, h.bed_capacity / 1500) * 0.2) * 100
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={14} /> Back to explore
        </Link>

        {/* Header */}
        <header className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {h.services.emergency_24h && <Badge tone="emergency">24h Emergency</Badge>}
              <Badge tone="neutral">{h.type}</Badge>
              <Badge tone="compass">{h.province}</Badge>
            </div>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] text-ink md:text-5xl">
              {h.name}
            </h1>
            <div className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>{h.address}</span>
            </div>
            <div className="mt-5 flex items-center gap-5">
              <RatingStars value={h.rating} size={16} />
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <Bed size={14} />
                {h.bed_capacity.toLocaleString()} beds
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
              {h.summary}
            </p>
          </div>

          {/* Service quality indicator card */}
          <Card className="p-6">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
              Service quality indicator
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="font-display text-5xl font-semibold leading-none tabular-nums text-ink">
                {qualityScore}
              </div>
              <div className="text-sm text-ink-muted">/ 100</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-compass-400 to-compass-700"
                style={{ width: `${qualityScore}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <MiniStat label="Rating" value={h.rating.toFixed(1)} />
              <MiniStat label="Services" value={`${Math.round(completeness * 6)}/6`} />
              <MiniStat label="Specs" value={String(h.specialties.length)} />
            </div>
            <div className="mt-4 text-[0.65rem] leading-relaxed text-ink-muted">
              Composite of rating, service completeness, and capacity. Indicative only.
            </div>
          </Card>
        </header>

        {/* Service indicators grid */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">Services & capabilities</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceIndicators.map(({ key, label, icon: Icon, on }) => (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                  on
                    ? "border-compass-200 bg-compass-50"
                    : "border-ink/10 bg-paper-warm/50 opacity-60"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  on ? "bg-compass-600 text-white" : "bg-ink/5 text-ink-muted"
                }`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{label}</div>
                  <div className="text-[0.7rem] text-ink-muted">
                    {on ? "Available" : "Not listed"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Specialties */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">Available specialties</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Specialist categories offered at this hospital. Confirm individual doctor availability with the hospital directly.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {h.specialties.map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-warm text-compass-700">
                  <Stethoscope size={15} />
                </div>
                <div className="text-sm font-medium text-ink">{specialtyLabel(s)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Map */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">Location</h2>
          <div className="mt-4 h-[400px] overflow-hidden rounded-2xl border border-ink/10 bg-paper-warm">
            <MapClient
              user={{ lat: h.lat, lng: h.lng }}
              hospitals={[h]}
              selectedId={h.id}
              focus={{ lat: h.lat, lng: h.lng, zoom: 15 }}
            />
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#8A6A0F]" />
          <div className="text-xs leading-relaxed text-ink-soft">
            <strong className="text-ink">Availability disclaimer.</strong>{" "}
            Specialty, service, and capacity information shown here is informational
            and may not reflect real-time availability. For current doctor schedules,
            bed availability, or emergency capacity, please contact the hospital directly.
            GeoHealth Compass is a decision-support tool, not a clinical or booking platform.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper-warm px-2 py-2.5">
      <div className="font-display text-lg font-semibold tabular-nums text-ink">{value}</div>
      <div className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
    </div>
  );
}
