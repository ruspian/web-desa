"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  Save,
  MapPin,
  Star,
  Filter,
} from "lucide-react";
import Image from "next/image";

// --- DUMMY DATA ---
const initialData = [
  {
    id: 1,
    title: "Air Terjun Bidadari",
    category: "Wisata",
    desc: "Destinasi wisata alam tersembunyi dengan air jernih.",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=200&q=80",
    location: "Dusun Utara",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Kopi Robusta Makmur",
    category: "Pertanian",
    desc: "Kopi petik merah asli petani lokal kualitas ekspor.",
    image:
      "https://images.unsplash.com/photo-1559525839-b184a4d6c5f7?w=200&q=80",
    location: "Kelompok Tani Subur",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Kerajinan Anyaman Bambu",
    category: "Ekonomi Kreatif",
    desc: "Produk kerajinan tangan berkualitas buatan ibu-ibu PKK.",
    image:
      "https://images.unsplash.com/photo-1519160558534-579f5106e43f?w=200&q=80",
    location: "Sentra UMKM",
    rating: 4.7,
  },
];

export default function AdminPotensiPage() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "Wisata",
    desc: "",
    image: null,
    location: "",
    rating: 5.0,
  });

  // Filter Logic
  const filteredData = data.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Semua" || item.category === filter;
    return matchSearch && matchFilter;
  });

  // CRUD Functions
  const handleDelete = (id) => {
    if (confirm("Hapus data potensi ini?"))
      setData(data.filter((i) => i.id !== id));
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: null,
        title: "",
        category: "Wisata",
        desc: "",
        image: null,
        location: "",
        rating: 5.0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update
      setData(data.map((d) => (d.id === formData.id ? formData : d)));
    } else {
      // Create
      setData([
        ...data,
        {
          ...formData,
          id: Date.now(),
          image:
            formData.image ||
            "https://images.unsplash.com/photo-1599639668854-51760526b430?w=200&q=80", // Dummy Img
        },
      ]);
    }
    setIsModalOpen(false);
  };

  // Badge Color Helper
  const getBadgeColor = (cat) => {
    switch (cat) {
      case "Wisata":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pertanian":
        return "bg-green-100 text-green-700 border-green-200";
      case "Ekonomi Kreatif":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Potensi & Produk Desa
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola data wisata, UMKM, dan hasil bumi unggulan.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
        >
          <Plus size={20} /> Tambah Potensi
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama potensi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[150px]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Wisata">Wisata</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Ekonomi Kreatif">Ekonomi Kreatif</option>
            <option value="Seni Budaya">Seni Budaya</option>
          </select>
        </div>
      </div>

      {/* CONTENT GRID / LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 group hover:border-emerald-200 transition-all"
          >
            {/* Image Thumbnail */}
            <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl relative overflow-hidden shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon size={32} />
                </div>
              )}
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />{" "}
                {item.rating}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin size={14} /> {item.location}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
              <button
                onClick={() => openModal(item)}
                className="flex-1 md:flex-none p-2.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 md:flex-none p-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <p>Belum ada data potensi.</p>
          </div>
        )}
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Potensi" : "Tambah Potensi Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nama Potensi / Produk
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Curug Indah / Keripik Singkong"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Kategori
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Wisata</option>
                    <option>Pertanian</option>
                    <option>Ekonomi Kreatif</option>
                    <option>Seni Budaya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Lokasi / Pemilik
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Dusun X / Pak Budi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Foto Utama
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
                  <ImageIcon size={24} className="mb-2" />
                  <span className="text-xs">Klik untuk upload (Max 2MB)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="Jelaskan keunggulan potensi ini..."
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2"
              >
                <Save size={18} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
