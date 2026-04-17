import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-paper-warm/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo withWordmark />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              A student capstone project combining nationwide hospital
              discovery with civic-health intelligence for Indonesia.
              Informational decision-support only — not medical advice.
            </p>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Public utility
            </div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link href="/explore" className="hover:text-compass-600">Nearby hospitals</Link></li>
              <li><Link href="/explore" className="hover:text-compass-600">Specialty search</Link></li>
              <li><Link href="/explore" className="hover:text-compass-600">Voice-assisted search</Link></li>
              <li><Link href="/explore" className="hover:text-compass-600">Hospital comparison</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Civic insight
            </div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link href="/insights" className="hover:text-compass-600">Healthcare Access Index</Link></li>
              <li><Link href="/insights" className="hover:text-compass-600">Regional distribution</Link></li>
              <li><Link href="/insights" className="hover:text-compass-600">Underserved areas</Link></li>
              <li><Link href="/about" className="hover:text-compass-600">Methodology</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Project
            </div>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li><Link href="/about" className="hover:text-compass-600">About</Link></li>
              <li><a href="https://github.com" className="hover:text-compass-600">GitHub</a></li>
              <li><Link href="/about" className="hover:text-compass-600">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink/10 pt-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} GeoHealth Compass · Student capstone project · MIT License</div>
          <div className="italic">Hospital availability may vary — please confirm with the hospital directly.</div>
        </div>
      </div>
    </footer>
  );
}
