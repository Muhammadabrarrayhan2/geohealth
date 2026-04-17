// Shared TypeScript types mirroring the FastAPI schemas.

export interface HospitalServices {
  emergency_24h: boolean;
  icu: boolean;
  ambulance: boolean;
  bpjs_accepted: boolean;
  trauma_center: boolean;
  nicu: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  short_name: string;
  type: string;
  city: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  specialties: string[];
  services: HospitalServices;
  bed_capacity: number;
  summary: string;
  distance_km?: number;
  travel_minutes?: number;
}

export interface HospitalScored extends Hospital {
  score: number;
  score_breakdown: Record<string, number>;
  mode_used: "normal" | "emergency";
}

export interface Specialty {
  value: string;
  label: string;
}

export interface RegionalStat {
  province: string;
  hospital_count: number;
  total_bed_capacity: number;
  avg_rating: number;
  specialty_breadth: number;
  healthcare_access_index: number;
  tier: "strong" | "moderate" | "underserved";
}

export interface NationalSummary {
  total_hospitals: number;
  total_bed_capacity: number;
  avg_rating: number;
  provinces_covered: number;
  emergency_capable_hospitals: number;
}

export interface SpecialtyDistribution {
  specialty: string;
  hospital_count: number;
}

export interface VoiceIntent {
  specialty: string | null;
  emergency: boolean;
  wants_nearest: boolean;
  confidence: number;
  matched_keywords: string[];
  raw_transcript: string;
}

export type UserCoords = { lat: number; lng: number };
