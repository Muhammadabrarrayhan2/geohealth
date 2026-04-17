import Link from "next/link";
import {
  Compass, Target, Map as MapIcon, Scale, Mic, AlertTriangle,
  ArrowRight, ShieldCheck, Activity,
} from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Primitives";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-compass-500/15 slow-spin opacity-50" />
          <div className="mx-auto max-w-4xl px-5 pb-14 pt-20 sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">
              <Compass size={12} className="text-compass-600" />
              About the project
            </div>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[0.98] text-ink md:text-6xl">
              A student project<br />
              for a <span className="italic text-compass-700">public</span> problem.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              GeoHealth Compass is a capstone-scale MVP that takes two questions
              seriously: <em>"which hospital should I go to?"</em> and
              <em> "does my region have fair access to care?"</em> — and answers them
              on the same map.
            </p>
          </div>
        </section>

        {/* Motivation */}
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <SectionHeading
            eyebrow="Motivation"
            title={<>Why healthcare accessibility matters.</>}
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              Finding the right hospital in Indonesia is harder than it should be.
              A person in urgent need might consult three different apps, a search
              engine, and a family group chat before making a decision — under
              time pressure and often under stress.
            </p>
            <p>
              At the same time, the <em>distribution</em> of healthcare across the
              archipelago is uneven in ways that are rarely visible to the public.
              Provincial-level differences in hospital density, specialty breadth,
              and service capability are real, but they're buried inside reports
              that most people will never read.
            </p>
            <p>
              GeoHealth Compass tries to do something modest but useful for both
              problems: put them in one interface, built with the same
              geospatial backbone, and explain the reasoning clearly.
            </p>
          </div>
        </section>

        {/* The three pillars */}
        <section className="border-y border-ink/10 bg-paper-warm/60">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <SectionHeading
              align="center"
              eyebrow="How it works"
              title="Three pillars, one platform."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Pillar
                icon={MapIcon}
                title="Geospatial discovery"
                desc="Your browser shares your location only locally. We compute great-circle distance with the haversine formula and sort candidates by proximity, travel-time estimate, and service fit."
              />
              <Pillar
                icon={Scale}
                title="Transparent scoring"
                desc="Every recommendation is a weighted composite of five factors — specialty, distance, rating, service completeness, and access. Emergency mode reweights toward urgency. You can see each factor's contribution."
              />
              <Pillar
                icon={Activity}
                title="Regional intelligence"
                desc="Provincial data is aggregated into a Healthcare Access Index. Underserved areas are called out explicitly, with honesty about dataset limits."
              />
            </div>
          </div>
        </section>

        {/* Recommendation methodology */}
        <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <SectionHeading
            eyebrow="Methodology"
            title={<>How the recommendation works.</>}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-compass-700">Normal mode</div>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  ["Specialty match", 35],
                  ["Distance", 30],
                  ["Service completeness", 15],
                  ["Rating", 10],
                  ["Healthcare access", 10],
                ].map(([l, w]) => (
                  <WeightRow key={l as string} label={l as string} weight={w as number} color="bg-compass-500" />
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-coral-600">Emergency mode</div>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  ["Emergency readiness", 40],
                  ["Distance", 35],
                  ["Service completeness", 15],
                  ["Rating", 5],
                  ["Healthcare access", 5],
                ].map(([l, w]) => (
                  <WeightRow key={l as string} label={l as string} weight={w as number} color="bg-coral-500" />
                ))}
              </div>
            </Card>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-muted">
            All factor scores are normalized to [0, 1] before weighting. Ratings
            from the 1.0–5.0 scale are linearly mapped to [0, 1]. Distance is
            capped at 50 km. Service completeness counts six standard indicators
            (24h ER, ICU, ambulance, BPJS, trauma, NICU). The final score is
            rescaled to 0–100 for readability.
          </p>
        </section>

        {/* Voice + accessibility */}
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <Card className="p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500 text-white">
                <Mic size={18} />
              </div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-coral-600">
                Accessibility · Voice-assisted search
              </div>
            </div>
            <h3 className="mt-5 font-display text-3xl font-medium leading-tight text-ink">
              Speech is the fastest accessibility affordance we have.
            </h3>
            <p className="mt-4 text-ink-soft leading-relaxed">
              The voice feature uses your browser's built-in speech recognition
              to transcribe a short command, then maps keywords to the same
              filter and recommendation system available through the UI. It
              recognizes common phrasings in both English and Bahasa Indonesia.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-paper-warm px-4 py-3 text-sm italic text-ink-soft">"Find the nearest emergency hospital"</div>
              <div className="rounded-2xl bg-paper-warm px-4 py-3 text-sm italic text-ink-soft">"Cari rumah sakit anak terdekat"</div>
              <div className="rounded-2xl bg-paper-warm px-4 py-3 text-sm italic text-ink-soft">"I need a cardiology hospital near me"</div>
              <div className="rounded-2xl bg-paper-warm px-4 py-3 text-sm italic text-ink-soft">"Rumah sakit UGD paling dekat"</div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-ink-muted">
              Important: voice search is <em>not</em> a chatbot, triage assistant,
              or symptom checker. It is an accessibility-first input method for
              the same search you could perform by tapping filters — designed
              for elderly users, users with motor impairments, and users in
              urgent physical conditions.
            </p>
          </Card>
        </section>

        {/* Data + limits */}
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <SectionHeading
            eyebrow="Honest about limits"
            title="What this project is — and isn't."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-compass-700">
                <ShieldCheck size={12} /> This platform IS
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <Check>A decision-support tool for hospital discovery</Check>
                <Check>A visualization of regional access patterns</Check>
                <Check>An accessibility-oriented voice search interface</Check>
                <Check>A transparent, explainable recommendation engine</Check>
                <Check>A student capstone MVP built for public value</Check>
              </ul>
            </Card>
            <Card className="p-6 bg-ink text-paper">
              <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-coral-400">
                <AlertTriangle size={12} /> This platform is NOT
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
                <Cross>A medical diagnosis or triage system</Cross>
                <Cross>A hospital booking or appointment platform</Cross>
                <Cross>A source of real-time bed availability</Cross>
                <Cross>An authoritative clinical directory</Cross>
                <Cross>A substitute for calling emergency services (118/119)</Cross>
              </ul>
            </Card>
          </div>
          <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-xs leading-relaxed text-ink-soft">
            <strong className="text-ink">Disclaimer.</strong>{" "}
            Hospital specialties, services, and availability may vary and should
            be confirmed directly with each hospital before making care
            decisions. Ratings and indicators shown are illustrative and should
            not be treated as clinical quality assessments. In a real emergency,
            call 118 (ambulance) or 119 (national emergency) immediately.
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <div className="rounded-3xl border border-ink/10 bg-paper p-10 text-center">
            <Target size={24} className="mx-auto text-compass-600" />
            <h2 className="mt-4 font-display text-3xl font-medium text-ink">
              Try the compass.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted">
              Start on the explore page, or read the numbers behind the map.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/explore" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink-soft">
                Explore hospitals <ArrowRight size={15} />
              </Link>
              <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-3 text-sm font-medium text-ink hover:bg-paper-warm">
                See insights
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Pillar({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-compass-50 text-compass-700">
        <Icon size={18} />
      </div>
      <h3 className="mt-5 font-display text-xl font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
    </Card>
  );
}

function WeightRow({ label, weight, color }: { label: string; weight: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 shrink-0 text-ink-soft">{label}</div>
      <div className="flex-1 h-1.5 rounded-full bg-ink/5 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${weight}%` }} />
      </div>
      <div className="w-10 text-right tabular-nums font-medium text-ink">{weight}%</div>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 inline-block h-1 w-4 rounded-full bg-compass-500" />
      <span>{children}</span>
    </li>
  );
}

function Cross({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 inline-block h-1 w-4 rounded-full bg-coral-500" />
      <span>{children}</span>
    </li>
  );
}
