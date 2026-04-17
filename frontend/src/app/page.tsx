import Link from "next/link";
import {
  Compass, Map, Stethoscope, Mic, Siren, LineChart, ArrowRight,
  ShieldCheck, Navigation, Activity, Building2,
} from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Primitives";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TwoSided />
        <PublicBenefits />
        <CivicIntelligence />
        <Feature />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft compass-ring background ornament */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-48 h-[720px] w-[720px] rounded-full border border-compass-500/20 slow-spin opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-coral-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-28 top-28 h-2 w-2 rounded-full bg-compass-500"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-24 pt-16 sm:px-8 md:pb-32 md:pt-20 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative">
          <div className="rise rise-1 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">
            <Compass size={12} className="text-compass-600" />
            Civic Health Intelligence for Indonesia
          </div>
          <h1 className="rise rise-2 mt-6 font-display text-5xl font-medium leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-[5.2rem]">
            Find the right
            <br />
            <span className="italic text-compass-700">hospital</span>,<br />
            understand the
            <br />
            <span className="italic text-coral-500">map</span> of health.
          </h1>
          <p className="rise rise-3 mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            GeoHealth Compass is a nationwide geospatial platform that helps
            people discover nearby hospitals with confidence, while making
            regional healthcare access visible to everyone — not just
            policymakers.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-ink-soft"
            >
              <Navigation size={15} /> Find hospitals near me
              <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-3 text-sm font-medium text-ink hover:bg-paper-warm"
            >
              <LineChart size={15} /> See healthcare access insights
            </Link>
          </div>

          <dl className="rise rise-4 mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-ink/10 pt-6">
            <Stat n="22" label="Hospitals mapped" />
            <Stat n="14" label="Provinces covered" />
            <Stat n="10" label="Medical specialties" />
          </dl>
        </div>

        {/* Right-side visual panel: a stylized "compass dashboard" */}
        <div className="relative">
          <div className="rise rise-3 relative rounded-3xl border border-ink/10 bg-paper p-6 shadow-panel">
            <div className="flex items-center justify-between border-b border-ink/5 pb-4">
              <div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Live preview
                </div>
                <div className="mt-0.5 font-display text-lg font-medium text-ink">
                  Nearby results
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-compass-50 px-2.5 py-1 text-[0.7rem] font-medium text-compass-700">
                <span className="h-1.5 w-1.5 rounded-full bg-compass-500" />
                Geolocated
              </span>
            </div>

            {/* stylized result list */}
            <div className="mt-4 space-y-3">
              {[
                { name: "RSCM Jakarta",            dist: "2.1 km", rating: "4.6", er: true, tag: "Top match" },
                { name: "RS Harapan Kita",         dist: "3.7 km", rating: "4.7", er: true, tag: "Cardiology" },
                { name: "RSUP Fatmawati",          dist: "5.9 km", rating: "4.3", er: true, tag: "Trauma" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-ink/5 bg-paper-warm/50 px-3.5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {r.er && (
                        <span className="inline-flex rounded-full bg-coral-500 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-white">
                          24h ER
                        </span>
                      )}
                      <span className="text-[0.65rem] text-ink-muted">{r.tag}</span>
                    </div>
                    <div className="mt-0.5 truncate text-sm font-medium text-ink">{r.name}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-display text-base font-semibold tabular-nums text-compass-700">{r.dist}</div>
                    <div className="text-[0.65rem] text-ink-muted">⭐ {r.rating} / 5</div>
                  </div>
                </div>
              ))}
            </div>

            {/* mini "voice search" affordance */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-compass-200 bg-compass-50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-compass-600 text-white">
                <Mic size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-compass-700">
                  Voice search
                </div>
                <div className="truncate text-xs text-ink-soft italic">
                  "Find the nearest emergency hospital"
                </div>
              </div>
            </div>
          </div>

          {/* small floating chip — adds depth */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-ink/10 bg-paper p-3 shadow-soft md:block">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20">
                <Activity size={14} className="text-amber-400" />
              </div>
              <div>
                <div className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
                  Healthcare Access Index
                </div>
                <div className="font-display text-sm font-medium text-ink">
                  DKI Jakarta · 92.4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-medium leading-none text-ink">{n}</div>
      <div className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
    </div>
  );
}

// ---------- Two-sided ----------
function TwoSided() {
  return (
    <section className="border-y border-ink/10 bg-paper-warm/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="A two-sided platform"
          title={<>Useful for a person.<br />Useful for a <span className="italic text-compass-700">nation</span>.</>}
          description="One platform, two complementary purposes — individual decision support and civic-health awareness, powered by the same geospatial backbone."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Card className="p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-compass-600 text-white">
                <Stethoscope size={18} />
              </div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
                Side 1 · Public utility
              </div>
            </div>
            <h3 className="mt-5 font-display text-3xl font-medium leading-tight text-ink">
              Faster, better decisions when it matters most.
            </h3>
            <p className="mt-3 text-ink-muted leading-relaxed">
              When you need care, you shouldn't be searching half-a-dozen
              websites. GeoHealth Compass unifies nearby hospitals, specialties,
              ratings, and service indicators in one trustworthy view.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-soft">
              <Li>Nearby hospital discovery with accurate distance</Li>
              <Li>Best option by specialty or medical need</Li>
              <Li>Emergency-ready hospital finder</Li>
              <Li>Voice-assisted search for accessibility</Li>
            </ul>
          </Card>

          <Card className="p-8 bg-ink text-paper">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500 text-white">
                <LineChart size={18} />
              </div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-coral-400">
                Side 2 · Civic health intelligence
              </div>
            </div>
            <h3 className="mt-5 font-display text-3xl font-medium leading-tight text-paper">
              Making the healthcare map <span className="italic">visible</span>.
            </h3>
            <p className="mt-3 text-paper/70 leading-relaxed">
              Understanding where care is concentrated — and where it's missing
              — is the first step toward closing regional gaps. We turn
              dataset-level patterns into a narrative anyone can read.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-paper/80">
              <Li light>Healthcare Access Index by province</Li>
              <Li light>Regional service coverage comparison</Li>
              <Li light>Underserved area indicators</Li>
              <Li light>Specialty distribution across regions</Li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Li({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-1.5 inline-block h-1 w-4 rounded-full ${light ? "bg-compass-300" : "bg-compass-500"}`} />
      <span>{children}</span>
    </li>
  );
}

// ---------- Public benefits grid ----------
function PublicBenefits() {
  const items = [
    { icon: Navigation,   title: "Nearby discovery",      desc: "See the nearest hospitals on a live map, ranked by distance and travel time." },
    { icon: Stethoscope,  title: "Specialty matching",    desc: "Filter by what you need — cardiology, pediatrics, maternity, oncology, and more." },
    { icon: Siren,        title: "Emergency mode",        desc: "A dedicated scoring profile prioritizes 24-hour ER, ICU, and trauma readiness." },
    { icon: Mic,          title: "Voice-assisted search", desc: "Speak instead of type — useful in urgent situations or for accessibility." },
    { icon: Building2,    title: "Side-by-side compare",  desc: "Put 2–4 candidates next to each other and see the tradeoffs explained." },
    { icon: ShieldCheck,  title: "Transparent scoring",   desc: "Every recommendation shows its factor breakdown — no black boxes." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Public utility"
        title={<>Built for the <span className="italic">moment</span> you need it.</>}
        description="Designed for ordinary people in ordinary and urgent situations — the features that matter, no more, no less."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group rounded-2xl border border-ink/8 bg-paper p-6 transition hover:border-compass-300 hover:shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-compass-50 text-compass-700 transition group-hover:bg-compass-600 group-hover:text-white">
              <Icon size={18} />
            </div>
            <h3 className="mt-5 font-display text-xl font-medium text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Civic intelligence feature ----------
function CivicIntelligence() {
  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-ink text-paper">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] bg-grid-faint bg-[size:28px_28px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-paper/70">
              <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
              Healthcare Access Index
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] text-paper md:text-5xl">
              Not every region has the same access to care.
            </h2>
            <p className="mt-5 max-w-lg text-paper/70 leading-relaxed">
              We aggregate hospital density, bed capacity, rating, and specialty
              breadth per province into a single, honest composite score. The
              result isn't a verdict — it's a starting point for better
              conversations about inequality.
            </p>
            <Link
              href="/insights"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink hover:bg-paper-warm"
            >
              Open the insights dashboard <ArrowRight size={15} />
            </Link>
          </div>

          {/* Stylized province ranking */}
          <div className="rounded-3xl border border-paper/10 bg-ink-soft/60 p-6">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper/50">
              Sample province ranking
            </div>
            <div className="mt-4 space-y-3">
              {[
                { p: "DKI Jakarta",          s: 92, tier: "strong" },
                { p: "Jawa Timur",           s: 78, tier: "strong" },
                { p: "Jawa Barat",           s: 64, tier: "moderate" },
                { p: "Sumatera Utara",       s: 42, tier: "moderate" },
                { p: "Nusa Tenggara Timur",  s: 22, tier: "underserved" },
                { p: "Papua",                s: 18, tier: "underserved" },
              ].map((r) => (
                <div key={r.p} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 text-sm text-paper/80">{r.p}</div>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-paper/10">
                    <div
                      className={`h-full rounded-full ${
                        r.tier === "strong" ? "bg-compass-400"
                        : r.tier === "moderate" ? "bg-amber-400"
                        : "bg-coral-500"
                      }`}
                      style={{ width: `${r.s}%` }}
                    />
                  </div>
                  <div className="w-10 text-right font-display text-sm tabular-nums text-paper">
                    {r.s}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.14em] text-paper/50">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-compass-400" /> Strong</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Moderate</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral-500" /> Underserved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Voice + methodology feature ----------
function Feature() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="rounded-3xl border border-ink/10 bg-paper p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500 text-white">
              <Mic size={18} />
            </div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-coral-600">
              Accessibility
            </div>
          </div>
          <h3 className="mt-5 font-display text-3xl font-medium leading-tight text-ink">
            Voice search for when typing isn't an option.
          </h3>
          <p className="mt-3 text-ink-muted leading-relaxed">
            For elderly users, users with motor impairments, or anyone in a
            physically weakened state, typing a search is a barrier. A single
            microphone tap parses intent in English or Bahasa Indonesia and
            applies the right filters.
          </p>
          <div className="mt-5 space-y-2 text-sm text-ink-soft">
            <div className="rounded-xl bg-paper-warm px-3 py-2 italic">"Find the nearest emergency hospital"</div>
            <div className="rounded-xl bg-paper-warm px-3 py-2 italic">"Cari rumah sakit jantung terdekat"</div>
            <div className="rounded-xl bg-paper-warm px-3 py-2 italic">"Show nearby pediatric hospitals"</div>
          </div>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-paper p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-compass-600 text-white">
              <ShieldCheck size={18} />
            </div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-700">
              Transparent methodology
            </div>
          </div>
          <h3 className="mt-5 font-display text-3xl font-medium leading-tight text-ink">
            Every score is explainable.
          </h3>
          <p className="mt-3 text-ink-muted leading-relaxed">
            Our recommendation engine uses a weighted composite of five factors
            — distance, specialty match, rating, service completeness, and
            healthcare access. Switching to emergency mode reweights toward
            urgency. You can see the breakdown on every result.
          </p>
          <div className="mt-5 space-y-2 text-xs text-ink-soft">
            {[
              ["Specialty match", 35],
              ["Distance", 30],
              ["Service completeness", 15],
              ["Rating", 10],
              ["Healthcare access", 10],
            ].map(([label, w]) => (
              <div key={label as string} className="flex items-center gap-3">
                <div className="w-40 shrink-0">{label}</div>
                <div className="flex-1 h-1.5 rounded-full bg-ink/5 overflow-hidden">
                  <div className="h-full bg-compass-500" style={{ width: `${w as number}%` }} />
                </div>
                <div className="w-10 text-right tabular-nums font-medium text-ink">{w}%</div>
              </div>
            ))}
            <div className="pt-2 text-[0.7rem] text-ink-muted italic">
              Normal mode weights shown. Emergency mode reprioritizes toward emergency readiness and distance.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- CTA ----------
function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-compass-700 px-8 py-16 text-paper md:px-16 md:py-20">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full border border-paper/15"
        />
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-paper/10"
        />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-paper/70">
            <Map size={12} /> Open the compass
          </div>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] md:text-5xl">
            Start with your location.<br />End with a decision you trust.
          </h2>
          <p className="mt-4 text-paper/70 md:text-lg">
            A clean, accessible, honest view of the healthcare around you —
            and around everyone else.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink hover:bg-paper-warm"
            >
              <Navigation size={15} /> Find hospitals near me
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-sm font-medium text-paper hover:bg-paper/10"
            >
              <LineChart size={15} /> Explore insights
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
