"use client";

import { cn } from "@/lib/utils";

/** The GeoHealth Compass mark — a compass needle inside a soft-ring. */
export function Logo({
  className,
  size = 32,
  withWordmark = false,
}: {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="GeoHealth Compass logo"
      >
        {/* outer ring */}
        <circle cx="20" cy="20" r="18" stroke="#0B1F2A" strokeWidth="1.2" />
        {/* subtle tick marks */}
        <g stroke="#0B1F2A" strokeWidth="1" opacity="0.5">
          <line x1="20" y1="3" x2="20" y2="6.5" />
          <line x1="20" y1="33.5" x2="20" y2="37" />
          <line x1="3" y1="20" x2="6.5" y2="20" />
          <line x1="33.5" y1="20" x2="37" y2="20" />
        </g>
        {/* needle — north teal, south coral */}
        <path d="M20 8 L23 20 L20 22 L17 20 Z" fill="#108A7F" />
        <path d="M20 22 L23 20 L20 32 L17 20 Z" fill="#E8694A" />
        {/* cross-shape health center dot */}
        <circle cx="20" cy="20" r="1.7" fill="#FAFBF8" stroke="#0B1F2A" strokeWidth="0.8" />
      </svg>
      {withWordmark && (
        <div className="leading-tight">
          <div className="font-display text-[1.15rem] font-semibold tracking-tight text-ink">
            GeoHealth <span className="italic text-compass-600">Compass</span>
          </div>
          <div className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">
            Civic Health Intelligence
          </div>
        </div>
      )}
    </div>
  );
}
