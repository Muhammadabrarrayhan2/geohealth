// General-purpose utilities.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number of kilometers for display. */
export function formatKm(km?: number): string {
  if (km == null) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Format a rating as "4.6 / 5" consistently across the app. */
export function formatRating(r: number): string {
  return `${r.toFixed(1)} / 5`;
}

/** Humanize a specialty code → pretty label. */
const SPECIALTY_LABELS: Record<string, string> = {
  emergency: "Emergency",
  pediatrics: "Pediatrics",
  maternity: "Maternity",
  cardiology: "Cardiology",
  neurology: "Neurology",
  oncology: "Oncology",
  orthopedics: "Orthopedics",
  internal_medicine: "Internal Medicine",
  surgery: "Surgery",
  radiology: "Radiology",
};

export function specialtyLabel(code: string): string {
  return SPECIALTY_LABELS[code] ?? code;
}

/** Indonesia's approximate geographic center — used as a fallback
 *  location when the browser denies geolocation. Biased slightly toward
 *  Jakarta since that's where most users will be. */
export const DEFAULT_LOCATION = { lat: -6.2, lng: 106.816666 };
