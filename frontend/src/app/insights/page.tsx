"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, LabelList,
} from "recharts";
import {
  Building2, Activity, Users, Sparkles, Map as MapIcon, AlertTriangle,
  ArrowUpRight, ArrowDownRight, MinusCircle,
} from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Primitives";
import { api } from "@/lib/api";
import { specialtyLabel } from "@/lib/utils";
import type { NationalSummary, RegionalStat, SpecialtyDistribution } from "@/lib/types";

export default function InsightsPage() {
  const [summary, setSummary] = useState<NationalSummary | null>(null);
  const [regional, setRegional] = useState<RegionalStat[]>([]);
  const [specDist, setSpecDist] = useState<SpecialtyDistribution[]>([]);

  useEffect(() => {
    Promise.all([api.summary(), api.regional(), api.specialtyDistribution()])
      .then(([s, r, d]) => { setSummary(s); setRegional(r); setSpecDist(d); })
      .catch(() => {});
  }, []);

  const underserved = regional.filter((r) => r.tier === "underserved");
  const strong = regional.filter((r) => r.tier === "strong");

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* Header */}
        <div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-coral-600">
            Civic health intelligence
          </div>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-ink md:text-5xl">
            The healthcare access map of <span className="italic text-compass-700">Indonesia</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            A provincial view of hospital density, capacity, quality, and
            specialty breadth — turned into a single composite index so gaps
            become visible at a glance.
          </p>
        </div>

        {/* KPI strip */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KPI
            icon={Building2}
            label="Hospitals mapped"
            value={summary?.total_hospitals ?? "—"}
            tone="compass"
          />
          <KPI
            icon={MapIcon}
            label="Provinces covered"
            value={summary?.provinces_covered ?? "—"}
            tone="compass"
          />
          <KPI
            icon={Users}
            label="Total bed capacity"
            value={summary?.total_bed_capacity?.toLocaleString() ?? "—"}
            tone="neutral"
          />
          <KPI
            icon={Activity}
            label="Avg. rating"
            value={summary?.avg_rating.toFixed(2) ?? "—"}
            tone="amber"
          />
          <KPI
            icon={Sparkles}
            label="24h ER capable"
            value={summary?.emergency_capable_hospitals ?? "—"}
            tone="coral"
          />
        </div>

        {/* Two-column: HAI ranking + tier breakdown */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
                  Healthcare Access Index · by province
                </div>
                <h2 className="mt-1 font-display text-2xl font-medium text-ink">
                  Who has access — and who doesn't.
                </h2>
              </div>
              <div className="hidden gap-3 text-[0.65rem] uppercase tracking-[0.14em] md:flex">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-compass-500" />Strong</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Moderate</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral-500" />Underserved</span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {regional.map((r) => (
                <div key={r.province} className="group">
                  <div className="flex items-center gap-3">
                    <div className="w-44 shrink-0 truncate text-sm text-ink">{r.province}</div>
                    <div className="relative flex-1 h-6 overflow-hidden rounded-full bg-ink/5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          r.tier === "strong" ? "bg-compass-500"
                          : r.tier === "moderate" ? "bg-amber-400"
                          : "bg-coral-500"
                        }`}
                        style={{ width: `${r.healthcare_access_index}%` }}
                      />
                      <div className="absolute inset-0 flex items-center px-3 text-[0.7rem] font-medium text-ink opacity-0 transition group-hover:opacity-100">
                        {r.hospital_count} hospitals · {r.total_bed_capacity.toLocaleString()} beds · {r.specialty_breadth} specialties
                      </div>
                    </div>
                    <div className="w-14 text-right font-display text-base font-semibold tabular-nums text-ink">
                      {r.healthcare_access_index.toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-ink/5 pt-4 text-[0.7rem] leading-relaxed text-ink-muted">
              HAI is a min-max-normalized composite of hospital density (30%),
              bed capacity (30%), average rating (20%), and specialty breadth (20%).
              Normalized across provinces in the dataset. See the About page for the full methodology.
            </div>
          </Card>

          {/* Tier cards */}
          <div className="space-y-4">
            <TierCard
              tone="compass"
              icon={ArrowUpRight}
              title="Stronger access"
              count={strong.length}
              items={strong.slice(0, 4)}
              subtitle="At or above the 55 HAI threshold"
            />
            <TierCard
              tone="coral"
              icon={ArrowDownRight}
              title="Underserved"
              count={underserved.length}
              items={underserved}
              subtitle="Below the 25 HAI threshold"
            />
            <Card className="p-5">
              <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <MinusCircle size={12} /> Interpretation
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                These tiers are <strong>relative to this dataset</strong>, not a
                national census. A "moderate" region here may still serve its
                population well — and a "strong" region may still have rural
                pockets that are underserved. This is a starting point for
                conversation, not a conclusion.
              </p>
            </Card>
          </div>
        </section>

        {/* Specialty distribution chart */}
        <section className="mt-12">
          <Card className="p-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
                  Specialty coverage
                </div>
                <h2 className="mt-1 font-display text-2xl font-medium text-ink">
                  Which services are most widely available?
                </h2>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={specDist.map((d) => ({
                    name: specialtyLabel(d.specialty),
                    count: d.hospital_count,
                  }))}
                  margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(11,31,42,0.08)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#4A6778", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(11,31,42,0.1)" }}
                    tickLine={false}
                    angle={-22}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: "#4A6778", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(11,31,42,0.1)",
                      fontSize: 12,
                    }}
                    cursor={{ fill: "rgba(16,138,127,0.06)" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {specDist.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === 0 ? "#108A7F" : i < 3 ? "#2FA296" : "#8DD1C8"}
                      />
                    ))}
                    <LabelList dataKey="count" position="top" style={{ fill: "#0B1F2A", fontSize: 11, fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-[0.7rem] text-ink-muted">
              Number of hospitals in the dataset offering each specialty.
            </div>
          </Card>
        </section>

        {/* Hospital type + capacity scatter */}
        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
              Capacity distribution
            </div>
            <h3 className="mt-1 font-display text-xl font-medium text-ink">
              Bed capacity per province
            </h3>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={[...regional].sort((a, b) => b.total_bed_capacity - a.total_bed_capacity).slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(11,31,42,0.08)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#4A6778", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="province"
                    tick={{ fill: "#0B1F2A", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid rgba(11,31,42,0.1)" }}
                    cursor={{ fill: "rgba(16,138,127,0.06)" }}
                  />
                  <Bar dataKey="total_bed_capacity" fill="#0B6E66" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-coral-600">
              Gap focus
            </div>
            <h3 className="mt-1 font-display text-xl font-medium text-ink">
              What underservice looks like, concretely
            </h3>
            <div className="mt-4 space-y-3">
              {underserved.length === 0 ? (
                <div className="text-sm text-ink-muted">No provinces currently below the underserved threshold in this dataset.</div>
              ) : underserved.map((r) => (
                <div key={r.province} className="flex items-center gap-3 rounded-2xl border border-coral-500/20 bg-coral-500/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral-500/15 text-coral-600">
                    <AlertTriangle size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink">{r.province}</div>
                    <div className="text-[0.7rem] text-ink-muted">
                      {r.hospital_count} hospitals · {r.specialty_breadth} distinct specialties
                    </div>
                  </div>
                  <div className="font-display text-xl font-semibold tabular-nums text-coral-600">
                    {r.healthcare_access_index.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#8A6A0F]" />
          <div className="text-xs leading-relaxed text-ink-soft">
            <strong className="text-ink">Dataset scope.</strong>{" "}
            These insights are computed from the hospitals represented in this
            MVP and are not normalized against province population. A
            production deployment would combine Kemenkes facility data with
            BPS population statistics for a true per-capita access measure.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function KPI({
  icon: Icon, label, value, tone,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  tone: "compass" | "coral" | "amber" | "neutral";
}) {
  const toneMap = {
    compass: "bg-compass-50 text-compass-700 border-compass-100",
    coral:   "bg-coral-500/10 text-coral-600 border-coral-500/20",
    amber:   "bg-amber-400/15 text-[#8A6A0F] border-amber-400/30",
    neutral: "bg-paper-warm text-ink border-ink/10",
  };
  return (
    <Card className="p-5">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border ${toneMap[tone]}`}>
        <Icon size={16} />
      </div>
      <div className="font-display text-3xl font-semibold tabular-nums leading-none text-ink">
        {value}
      </div>
      <div className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
    </Card>
  );
}

function TierCard({
  tone, icon: Icon, title, subtitle, count, items,
}: {
  tone: "compass" | "coral";
  icon: any;
  title: string;
  subtitle: string;
  count: number;
  items: RegionalStat[];
}) {
  const accent = tone === "compass"
    ? { bg: "bg-compass-50", text: "text-compass-700", border: "border-compass-200", pill: "bg-compass-600" }
    : { bg: "bg-coral-500/10", text: "text-coral-600", border: "border-coral-500/30", pill: "bg-coral-500" };
  return (
    <Card className={`p-5 ${accent.bg} ${accent.border} border`}>
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${accent.pill} text-white`}>
          <Icon size={14} />
        </div>
        <div className={`text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${accent.text}`}>
          {title}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-4xl font-semibold tabular-nums text-ink">{count}</div>
        <div className="text-xs text-ink-muted">provinces</div>
      </div>
      <div className="mt-1 text-[0.7rem] text-ink-muted">{subtitle}</div>
      <div className="mt-3 space-y-1.5">
        {items.map((r) => (
          <div key={r.province} className="flex items-center justify-between text-xs">
            <span className="text-ink">{r.province}</span>
            <span className="tabular-nums font-medium text-ink">{r.healthcare_access_index.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
