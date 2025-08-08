"use client";

// components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix the default marker icon issue
delete (L.Icon.Default.prototype as { _getIconUrl?: string })?._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

/** Child component that moves the map when latLng changes */
function MapUpdater({
  latLng,
  zoom = 10,
  animate = true,
}: {
  latLng?: { lat: number; lng: number } | null;
  zoom?: number;
  animate?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!latLng) return;
    const target = [latLng?.lat, latLng?.lng] as [number, number];

    // choose flyTo for smooth animation, or setView for immediate jump:
    if (animate) {
      map.flyTo(target, zoom, { animate: true, duration: 0.8 });
    } else {
      map.setView(target, zoom);
    }
  }, [latLng?.lat, latLng?.lng, zoom, animate, map]);

  return null;
}

export default function Map({
  latLng,
}: {
  latLng: { lat: number; lng: number };
}) {
  const lat = latLng?.lat;
  const lng = latLng?.lng;

  useEffect(() => {
    // Fix the default marker icon issue
    delete (L.Icon.Default.prototype as { _getIconUrl?: string })?._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[lat as number, lng as number]}
      zoom={10}
      scrollWheelZoom={false}
      className="h-[600px]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* this component will update the visible view whenever latLng prop changes */}
      <MapUpdater latLng={latLng} />
      <Marker position={[lat as number, lng as number]}>
        <Popup>Marker in London</Popup>
      </Marker>
    </MapContainer>
  );
}
