"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Hospital, UserCoords } from "@/lib/types";
import { formatKm } from "@/lib/utils";

// Custom Leaflet markers — the default PNG-based pins don't fit our
// civic-health aesthetic. We build them as divIcons using inline SVG.

const hospitalIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:34px;height:34px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:#0B6E66;box-shadow:0 4px 14px rgba(8,84,78,0.45);
        display:flex;align-items:center;justify-content:center;
        border:2px solid #FAFBF8;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAFBF8" stroke-width="3">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
    </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const emergencyIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:36px;height:36px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:#E8694A;box-shadow:0 4px 16px rgba(201,81,58,0.55);
        display:flex;align-items:center;justify-content:center;
        border:2px solid #FAFBF8;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAFBF8" stroke-width="3">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
    </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:44px;height:44px;">
      <div style="position:absolute;inset:-6px;border-radius:50%;
        background:rgba(16,138,127,0.2);"></div>
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:#108A7F;box-shadow:0 6px 20px rgba(8,84,78,0.6);
        display:flex;align-items:center;justify-content:center;
        border:3px solid #FAFBF8;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAFBF8" stroke-width="3">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
    </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function FlyTo({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

interface Props {
  user: UserCoords;
  hospitals: Hospital[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  focus?: { lat: number; lng: number; zoom?: number } | null;
}

export default function HospitalMap({
  user, hospitals, selectedId, onSelect, focus,
}: Props) {
  const center: [number, number] = useMemo(
    () => [user.lat, user.lng], [user.lat, user.lng]
  );

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full rounded-2xl"
    >
      {/* A clean, low-saturation tile style that fits our palette. */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a> · OSM'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* User's location — a soft pulsing dot */}
      <CircleMarker
        center={center}
        radius={8}
        pathOptions={{
          color: "#108A7F",
          fillColor: "#108A7F",
          fillOpacity: 0.9,
          weight: 3,
        }}
      >
        <Popup>
          <div className="text-xs">
            <div className="font-semibold">You are here</div>
            <div className="text-gray-500">{user.lat.toFixed(4)}, {user.lng.toFixed(4)}</div>
          </div>
        </Popup>
      </CircleMarker>

      {hospitals.map((h) => {
        const icon = selectedId === h.id
          ? selectedIcon
          : (h.services.emergency_24h ? emergencyIcon : hospitalIcon);
        return (
          <Marker
            key={h.id}
            position={[h.lat, h.lng]}
            icon={icon}
            eventHandlers={{ click: () => onSelect?.(h.id) }}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-[180px]">
                <div className="font-semibold text-sm text-[#0B1F2A]">{h.name}</div>
                <div className="text-gray-500">{h.city}, {h.province}</div>
                <div className="flex items-center justify-between pt-1">
                  <span>⭐ {h.rating.toFixed(1)} / 5</span>
                  {h.distance_km != null && <span>{formatKm(h.distance_km)}</span>}
                </div>
                <a
                  href={`/hospital/${h.id}`}
                  className="mt-1 block rounded-full bg-[#0B6E66] px-2 py-1 text-center text-white text-[0.7rem]"
                >
                  View details →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {focus && <FlyTo center={[focus.lat, focus.lng]} zoom={focus.zoom} />}
    </MapContainer>
  );
}
