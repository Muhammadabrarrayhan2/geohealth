// Thin API client wrapping fetch. All network calls live here so pages
// stay focused on presentation + state.

import type {
  Hospital, HospitalScored, Specialty,
  RegionalStat, NationalSummary, SpecialtyDistribution, VoiceIntent,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ---------- Hospitals ----------
export const api = {
  specialties: () =>
    request<Specialty[]>("/api/hospitals/specialties"),

  nearby: (params: {
    lat: number; lng: number;
    radius_km?: number;
    specialty?: string;
    min_rating?: number;
    emergency_only?: boolean;
  }) => {
    const q = new URLSearchParams();
    q.set("lat", String(params.lat));
    q.set("lng", String(params.lng));
    if (params.radius_km) q.set("radius_km", String(params.radius_km));
    if (params.specialty) q.set("specialty", params.specialty);
    if (params.min_rating != null) q.set("min_rating", String(params.min_rating));
    if (params.emergency_only) q.set("emergency_only", "true");
    return request<{ count: number; radius_km_used: number; results: Hospital[] }>(
      `/api/hospitals/nearby?${q.toString()}`
    );
  },

  detail: (id: string) => request<Hospital>(`/api/hospitals/${id}`),

  // ---------- Recommendations ----------
  recommend: (params: {
    lat: number; lng: number;
    specialty?: string;
    mode?: "normal" | "emergency";
    limit?: number;
  }) => {
    const q = new URLSearchParams();
    q.set("lat", String(params.lat));
    q.set("lng", String(params.lng));
    if (params.specialty) q.set("specialty", params.specialty);
    if (params.mode) q.set("mode", params.mode);
    if (params.limit) q.set("limit", String(params.limit));
    return request<{
      mode: string;
      weights_used: Record<string, number>;
      count: number;
      results: HospitalScored[];
    }>(`/api/recommendations/nearby?${q.toString()}`);
  },

  compare: (params: {
    ids: string[];
    lat: number; lng: number;
    specialty?: string;
    mode?: "normal" | "emergency";
  }) => {
    const q = new URLSearchParams();
    q.set("ids", params.ids.join(","));
    q.set("lat", String(params.lat));
    q.set("lng", String(params.lng));
    if (params.specialty) q.set("specialty", params.specialty);
    if (params.mode) q.set("mode", params.mode);
    return request<{
      mode: string;
      weights_used: Record<string, number>;
      results: HospitalScored[];
    }>(`/api/recommendations/compare?${q.toString()}`);
  },

  // ---------- Voice ----------
  parseVoice: (transcript: string) =>
    request<VoiceIntent>("/api/voice/parse", {
      method: "POST",
      body: JSON.stringify({ transcript }),
    }),

  // ---------- Insights ----------
  summary: () => request<NationalSummary>("/api/insights/summary"),
  regional: () => request<RegionalStat[]>("/api/insights/regional"),
  underserved: (threshold = 33) =>
    request<RegionalStat[]>(`/api/insights/underserved?threshold=${threshold}`),
  specialtyDistribution: () =>
    request<SpecialtyDistribution[]>("/api/insights/specialty-distribution"),
};
