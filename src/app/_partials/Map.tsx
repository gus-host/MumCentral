// components/MapPicker.tsx
"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import type { LatLngLiteral } from "leaflet";

export function MapPicker() {
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 6.5244,
    lng: 3.3792,
  });

  function onChange(lng: LatLngLiteral) {
    setPosition(lng);
  }

  // A client-only hook that listens for click events on the map
  function LocationHandler() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onChange(e.latlng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
      className="rounded-md overflow-hidden"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationHandler />
      <Marker
        // icon={}
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const latlng = marker.getLatLng();
            setPosition(latlng);
            onChange(latlng);
          },
        }}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
