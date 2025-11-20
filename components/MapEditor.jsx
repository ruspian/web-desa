"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix Icon Marker Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Komponen buat nangkep klik user di peta
function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng); // Kirim koordinat ke parent
    },
  });
  return null;
}

export default function MapEditor({
  center,
  markers,
  selectedPos,
  onMapClick,
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Event Listener Klik Peta */}
      <LocationMarker onLocationSelect={onMapClick} />

      {/* Marker yang sudah tersimpan */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <b>{marker.name}</b>
            <br />
            {marker.category}
          </Popup>
        </Marker>
      ))}

      {/* Marker Sementara (Yang lagi diklik/diedit) */}
      {selectedPos && (
        <Marker position={selectedPos} icon={defaultIcon} opacity={0.7}>
          <Popup>Lokasi Baru (Geser/Klik peta untuk ubah)</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
