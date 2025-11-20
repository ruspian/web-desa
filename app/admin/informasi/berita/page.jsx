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
  Eye,
  Filter,
  Calendar,
} from "lucide-react";
import Image from "next/image";

// --- DUMMY DATA BERITA ---
const initialPosts = [
  {
    id: 1,
    title: "Pembangunan Jalan Dusun Krajan Selesai Tepat Waktu",
    category: "Pembangunan",
    date: "2025-11-20",
    author: "Admin Desa",
    status: "published", // published, draft
    views: 1240,
    image:
      "https://images.unsplash.com/photo-1596627649633-b1f74349713c?w=200&q=80",
  },
  {
    id: 2,
    title: "Jadwal Posyandu Balita & Lansia Bulan November",
    category: "Kesehatan",
    date: "2025-11-18",
    author: "Bidan Desa",
    status: "published",
    views: 850,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&q=80",
  },
  {
    id: 3,
    title: "Draft: Rencana Anggaran 2026 (Internal Review)",
    category: "Pemerintahan",
    date: "2025-11-15",
    author: "Sekdes",
    status: "draft",
    views: 0,
    image: null,
  },
];

export default function AdminBeritaPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "Kegiatan",
    content: "",
    status: "published",
    image: null,
    author: "Admin Desa", // Nanti ambil dari session user
  });

  // Filter Logic
  const filteredPosts = posts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "Semua" || post.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // --- CRUD ---
  const handleDelete = (id) => {
    if (confirm("Yakin mau hapus berita ini?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const openModal = (post = null) => {
    if (post) {
      setFormData({ ...post, content: "Simulasi konten..." }); // Edit
    } else {
      setFormData({
        // New
        id: null,
        title: "",
        category: "Kegiatan",
        content: "",
        status: "published",
        image: null,
        author: "Admin Desa",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update
      setPosts(
        posts.map((p) =>
          p.id === formData.id
            ? { ...formData, date: p.date, views: p.views }
            : p
        )
      );
    } else {
      // Create
      const newPost = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        views: 0,
        image:
          "https://images.unsplash.com/photo-1516216628259-63eb6fd6932f?w=200&q=80", // Dummy Img
      };
      setPosts([newPost, ...posts]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kabar & Artikel</h1>
          <p className="text-gray-500 text-sm">
            Publikasikan kegiatan dan informasi desa ke website.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={20} /> Tulis Berita
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari judul berita..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer min-w-[150px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="published">Tayang</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* LIST BERITA */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center group hover:border-emerald-200 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg relative overflow-hidden shrink-0 border border-gray-200">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon size={24} />
                </div>
              )}
              {post.status === "draft" && (
                <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    DRAFT
                  </span>
                </div>
              )}
            </div>

            {/* Content Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} /> {post.date}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye size={12} /> {post.views} x
                </span>
              </div>

              <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-emerald-600 transition-colors cursor-pointer">
                {post.title}
              </h3>

              <p className="text-xs text-gray-500">Penulis: {post.author}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              <button
                onClick={() => openModal(post)}
                className="p-2.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                title="Edit"
              >
                <Edit size={18} />
                <span className="md:hidden text-sm font-bold">Edit</span>
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                title="Hapus"
              >
                <Trash2 size={18} />
                <span className="md:hidden text-sm font-bold">Hapus</span>
              </button>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 mb-2">Tidak ada berita ditemukan.</p>
            <button
              onClick={() => openModal()}
              className="text-emerald-600 font-bold hover:underline"
            >
              Tulis Berita Baru
            </button>
          </div>
        )}
      </div>

      {/* === MODAL EDITOR === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">
                {formData.id ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              {/* Title Input (Big) */}
              <div>
                <input
                  type="text"
                  className="w-full px-0 py-2 border-b-2 border-gray-200 text-3xl font-bold text-gray-800 placeholder-gray-300 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="Judul Berita..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label-input">Kategori</label>
                  <select
                    className="input-field bg-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Kegiatan</option>
                    <option>Pembangunan</option>
                    <option>Pemerintahan</option>
                    <option>Kesehatan</option>
                    <option>Ekonomi</option>
                    <option>Pengumuman</option>
                  </select>
                </div>

                <div>
                  <label className="label-input">Status Publikasi</label>
                  <select
                    className="input-field bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="published">Tayang (Public)</option>
                    <option value="draft">Simpan Draft (Private)</option>
                  </select>
                </div>

                <div>
                  <label className="label-input">Gambar Thumbnail</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 bg-gray-200 rounded overflow-hidden relative border border-gray-300">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Thumb"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon
                          size={16}
                          className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                      )}
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:underline">
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor Area (Simulasi WYSIWYG) */}
              <div className="flex flex-col h-64 border border-gray-200 rounded-xl overflow-hidden">
                {/* Toolbar Dummy */}
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
                  <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 text-xs font-bold">
                    B
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 text-xs italic">
                    I
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 text-xs underline">
                    U
                  </button>
                  <div className="w-px h-full bg-gray-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 text-xs">
                    H1
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 text-xs">
                    H2
                  </button>
                </div>
                <textarea
                  className="flex-1 p-4 outline-none resize-none text-gray-700 leading-relaxed"
                  placeholder="Mulai menulis cerita..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
              >
                <Save size={18} />{" "}
                {formData.status === "published" ? "Terbitkan" : "Simpan Draft"}
              </button>
            </div>
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
      `}</style>
    </div>
  );
}
