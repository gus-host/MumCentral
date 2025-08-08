"use client";

// components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const Map: React.FC = () => {
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
      center={[9.082, 8.6753]}
      zoom={10}
      scrollWheelZoom={false}
      className="h-[600px]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[9.082, 8.6753]}>
        <Popup>Marker in London</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
