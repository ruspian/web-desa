"use client"; // Wajib client component

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Wajib import CSS Leaflet
import L from "leaflet";

// Fix Icon Marker Default Leaflet yang suka error di Next.js
// Kita pake CDN icon gambar biar simpel
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

// Koordinat Pusat Desa (Contoh: Sekitar Wonogiri)
const CENTER_POS = [-7.8011945, 110.9596655];

const PetaDesa = () => {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white relative z-0">
      <MapContainer
        center={CENTER_POS}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Layer Peta (Pake OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker Kantor Desa */}
        <Marker position={CENTER_POS} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <b className="text-base">Kantor Desa Makmur Jaya</b>
              <br />
              Pusat Pelayanan Warga
            </div>
          </Popup>
        </Marker>

        {/* Contoh Marker Lain (Sekolah) */}
        <Marker position={[-7.805, 110.965]} icon={defaultIcon}>
          <Popup>SD Negeri 1 Makmur Jaya</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PetaDesa;
