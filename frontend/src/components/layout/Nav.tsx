"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="GeoHealth Compass home">
          <Logo withWordmark />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-ink text-paper"
                    : "text-ink-muted hover:text-ink hover:bg-ink/5"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/explore"
            className="ml-2 rounded-full bg-compass-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-compass-700"
          >
            Find hospitals →
          </Link>
        </nav>
        {/* mobile — show only the CTA */}
        <Link
          href="/explore"
          className="rounded-full bg-compass-600 px-3.5 py-2 text-xs font-medium text-white md:hidden"
        >
          Explore →
        </Link>
      </div>
    </header>
  );
}
