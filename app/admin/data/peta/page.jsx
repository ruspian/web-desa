"use client";

import { useState } from "react";
import dynamic from "next/dynamic"; // Wajib buat Leaflet
import { Save, MapPin, Plus, Trash2, Edit, Info } from "lucide-react";

// Import MapEditor secara Dynamic (Client Side Only)
const MapEditor = dynamic(() => import("@/components/MapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 rounded-2xl">
      Tunggu Sebentar...
    </div>
  ),
});

// Dummy Data Awal
const initialLocations = [
  {
    id: 1,
    name: "Kantor Desa Makmur Jaya",
    category: "Pemerintahan",
    lat: -7.8011945,
    lng: 110.9596655,
  },
  {
    id: 2,
    name: "SD Negeri 1",
    category: "Pendidikan",
    lat: -7.805,
    lng: 110.965,
  },
  { id: 3, name: "Masjid Raya", category: "Ibadah", lat: -7.802, lng: 110.96 },
];

export default function AdminPetaPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [center, setCenter] = useState([-7.8011945, 110.9596655]); // Pusat Peta Default

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "Fasilitas Umum",
    lat: "",
    lng: "",
  });

  // Handle klik di peta
  const handleMapClick = (latlng) => {
    setFormData({
      ...formData,
      lat: latlng.lat.toFixed(7), // Ambil 7 angka di belakang koma biar presisi
      lng: latlng.lng.toFixed(7),
    });
  };

  // Handle Input Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simpan Data
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng)
      return alert("Silakan klik titik di peta untuk menentukan lokasi!");

    if (formData.id) {
      // Update
      setLocations(
        locations.map((loc) =>
          loc.id === formData.id
            ? {
                ...formData,
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng),
              }
            : loc
        )
      );
    } else {
      // Create
      const newLoc = {
        ...formData,
        id: Date.now(),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
      };
      setLocations([...locations, newLoc]);
    }
    // Reset Form
    setFormData({
      id: null,
      name: "",
      category: "Fasilitas Umum",
      lat: "",
      lng: "",
    });
  };

  // Edit Data
  const handleEdit = (item) => {
    setFormData({
      ...item,
      lat: item.lat.toString(),
      lng: item.lng.toString(),
    });
    setCenter([item.lat, item.lng]); // Pindah kamera peta ke lokasi yang diedit
  };

  // Hapus Data
  const handleDelete = (id) => {
    if (confirm("Hapus lokasi ini?")) {
      setLocations(locations.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Peta Digital Desa
          </h1>
          <p className="text-gray-500 text-sm">
            Tandai lokasi kantor desa, sekolah, wisata, dan fasilitas umum.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* KOLOM KIRI: MAP EDITOR (Gede) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm relative flex flex-col h-full min-h-[400px]">
          <div className="absolute top-4 right-4 z-400 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-medium shadow-md border border-gray-200">
            Klik peta untuk mengambil koordinat
          </div>
          <MapEditor
            center={center}
            markers={locations}
            selectedPos={
              formData.lat
                ? [parseFloat(formData.lat), parseFloat(formData.lng)]
                : null
            }
            onMapClick={handleMapClick}
          />
        </div>

        {/* KOLOM KANAN: FORM & LIST */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          {/* 1. FORM INPUT */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              {formData.id ? (
                <Edit size={18} className="text-blue-500" />
              ) : (
                <Plus size={18} className="text-green-500" />
              )}
              {formData.id ? "Edit Lokasi" : "Tambah Lokasi Baru"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Nama Lokasi
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  placeholder="Contoh: Balai Desa"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                >
                  <option>Pemerintahan</option>
                  <option>Pendidikan</option>
                  <option>Ibadah</option>
                  <option>Wisata</option>
                  <option>Fasilitas Umum</option>
                  <option>Kesehatan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="lat"
                    value={formData.lat}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600"
                    placeholder="-7.xxxx"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="lng"
                    value={formData.lng}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600"
                    placeholder="110.xxxx"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                {formData.id && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        id: null,
                        name: "",
                        category: "Fasilitas Umum",
                        lat: "",
                        lng: "",
                      })
                    }
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex justify-center items-center gap-2"
                >
                  <Save size={16} /> Simpan
                </button>
              </div>
            </form>
          </div>

          {/* 2. LIST LOCATION (Scrollable) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-700 text-sm">
                Daftar Lokasi ({locations.length})
              </h3>
            </div>
            <div className="overflow-y-auto p-2 space-y-1 flex-1">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-gray-100 transition-all"
                >
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => handleEdit(loc)}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-gray-500">{loc.category}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {loc.lat}, {loc.lng}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(loc)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
