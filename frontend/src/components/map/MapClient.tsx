"use client";

// Wrapper that lazy-loads the Leaflet map on the client only.
// Leaflet touches `window` at import time, so it must be dynamic.

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type HospitalMapType from "./HospitalMap";

const HospitalMap = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-paper-warm">
      <div className="text-xs text-ink-muted">Loading map…</div>
    </div>
  ),
});

export function MapClient(props: ComponentProps<typeof HospitalMapType>) {
  return <HospitalMap {...props} />;
}
