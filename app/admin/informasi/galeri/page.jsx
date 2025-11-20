"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Image as ImageIcon,
  X,
  Save,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";

// --- DUMMY DATA GALERI ---
const initialGallery = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1516216628259-63eb6fd6932f?w=400&q=80",
    caption: "Panen Raya Padi Musim Kedua",
    category: "Pertanian",
    date: "20 Nov 2025",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80",
    caption: "Kirab Budaya HUT RI",
    category: "Kegiatan",
    date: "17 Aug 2025",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    caption: "Rapat Koordinasi Perangkat Desa",
    category: "Pemerintahan",
    date: "10 Nov 2025",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1599639668854-51760526b430?w=400&q=80",
    caption: "Produk UMKM Keripik Pisang",
    category: "Ekonomi",
    date: "05 Nov 2025",
  },
];

export default function AdminGaleriPage() {
  const [photos, setPhotos] = useState(initialGallery);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    caption: "",
    category: "Kegiatan",
    src: null,
  });

  // Filter Logic
  const filteredPhotos = photos.filter((item) => {
    const matchSearch = item.caption
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCat = filterCat === "Semua" || item.category === filterCat;
    return matchSearch && matchCat;
  });

  // --- CRUD ---
  const handleDelete = (id) => {
    if (confirm("Hapus foto ini dari galeri?")) {
      setPhotos(photos.filter((p) => p.id !== id));
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ id: null, caption: "", category: "Kegiatan", src: null });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Logic save (create/update)
    if (formData.id) {
      setPhotos(photos.map((p) => (p.id === formData.id ? formData : p)));
    } else {
      setPhotos([
        {
          ...formData,
          id: Date.now(),
          date: new Date().toLocaleDateString("id-ID"),
          src:
            formData.src ||
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", // Dummy Image
        },
        ...photos,
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Galeri Dokumentasi
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola foto dan video kegiatan desa.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={20} /> Upload Foto
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari caption foto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer min-w-[180px]"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Kegiatan">Kegiatan Desa</option>
            <option value="Pemerintahan">Pemerintahan</option>
            <option value="Pembangunan">Pembangunan</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Ekonomi">Ekonomi</option>
          </select>
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Upload Placeholder (Shortcut) */}
        <div
          onClick={() => openModal()}
          className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-all group"
        >
          <div className="p-4 bg-gray-100 rounded-full group-hover:bg-white mb-2 transition-colors">
            <UploadCloud size={24} />
          </div>
          <span className="text-xs font-bold">Upload Baru</span>
        </div>

        {/* Gallery Items */}
        {filteredPhotos.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all"
          >
            {/* Image */}
            <Image
              src={item.src}
              alt={item.caption}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay Info (Bottom) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                {item.category}
              </span>
              <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                {item.caption}
              </p>
              <p className="text-gray-400 text-[10px] mt-1">{item.date}</p>
            </div>

            {/* Action Buttons (Top Right) */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2.5 group-hover:translate-y-0 duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(item);
                }}
                className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-lg shadow-sm backdrop-blur-sm"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-lg shadow-sm backdrop-blur-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
          <p>Tidak ada foto ditemukan.</p>
        </div>
      )}

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Foto" : "Upload Foto Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden group">
                {formData.src ? (
                  <Image
                    src={formData.src}
                    alt="Preview"
                    fill
                    className="object-cover opacity-50 group-hover:opacity-40"
                  />
                ) : null}

                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <UploadCloud size={24} className="text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    Klik untuk upload
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="label-input">Kategori Album</label>
                <select
                  className="input-field bg-white"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option>Kegiatan</option>
                  <option>Pemerintahan</option>
                  <option>Pembangunan</option>
                  <option>Pertanian</option>
                  <option>Ekonomi</option>
                </select>
              </div>

              <div>
                <label className="label-input">Caption / Keterangan</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData({ ...formData, caption: e.target.value })
                  }
                  placeholder="Jelaskan momen yang ada di foto..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan Galeri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-input {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm;
        }
        .btn-primary {
          @apply flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20;
        }
        .btn-secondary {
          @apply flex-1 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200;
        }
      `}</style>
    </div>
  );
}
