"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//  ICON MARKER
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

//  GESER KAMERA PETA
function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

// KLIK PETA
function LocationMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// KOMPONEN UTAMA
const MapEditor = ({ center, markers, selectedPos, onMapClick }) => {
  return (
    // Pembungkus div dengan position relative penting untuk layout Leaflet
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "1rem",
          zIndex: 10,
        }}
      >
        {/* Helper untuk update posisi kamera saat props center berubah */}
        <ChangeView center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Event Listener Klik */}
        <LocationMarker onMapClick={onMapClick} />

        {/* Marker yang sudah tersimpan di DB */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            // Gunakan parseFloat biar aman kalau data dari DB berupa string
            position={[parseFloat(marker.lat), parseFloat(marker.lng)]}
          >
            <Popup>
              <div className="text-center">
                <b className="text-sm">{marker.name}</b>
                <br />
                <span className="text-xs text-gray-500">{marker.category}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marker Sementara (Yang sedang diedit/tambah) */}
        {selectedPos && (
          <Marker position={selectedPos} opacity={0.7}>
            <Popup>Lokasi Baru</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapEditor;
