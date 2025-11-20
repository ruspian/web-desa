"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Save,
  X,
  Palette,
  UserCircle,
} from "lucide-react";

// --- DUMMY DATA ---
const initialData = [
  {
    id: 1,
    nama: "Badan Permusyawaratan Desa",
    singkatan: "BPD",
    ketua: "Bpk. Sutrisno, S.Pd",
    anggota: 9,
    warna: "blue", // blue, green, red, orange, purple, pink
    deskripsi:
      "Lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa.",
  },
  {
    id: 2,
    nama: "Pemberdayaan Kesejahteraan Keluarga",
    singkatan: "PKK",
    ketua: "Ibu Siti Aminah",
    anggota: 25,
    warna: "pink",
    deskripsi:
      "Gerakan nasional dalam pembangunan masyarakat yang tumbuh dari bawah.",
  },
  {
    id: 3,
    nama: "Karang Taruna Tunas Bangsa",
    singkatan: "KT",
    ketua: "Dimas Anggara",
    anggota: 40,
    warna: "indigo",
    deskripsi:
      "Wadah pengembangan generasi muda yang tumbuh atas dasar kesadaran sosial.",
  },
  {
    id: 4,
    nama: "Lembaga Pemberdayaan Masyarakat",
    singkatan: "LPM",
    ketua: "Ibu Hartini",
    anggota: 12,
    warna: "orange",
    deskripsi:
      "Mitra pemerintah desa dalam menampung dan menyalurkan aspirasi masyarakat.",
  },
];

export default function AdminLembagaPage() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    singkatan: "",
    ketua: "",
    anggota: 0,
    warna: "blue",
    deskripsi: "",
  });

  // Filter
  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.singkatan.toLowerCase().includes(search.toLowerCase())
  );

  // CRUD Helper
  const handleDelete = (id) => {
    if (confirm("Hapus lembaga ini?")) setData(data.filter((i) => i.id !== id));
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: null,
        nama: "",
        singkatan: "",
        ketua: "",
        anggota: 0,
        warna: "blue",
        deskripsi: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      setData(data.map((d) => (d.id === formData.id ? formData : d)));
    } else {
      setData([...data, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  // Helper buat Styling Warna Dinamis
  const getColorClass = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-emerald-100 text-emerald-600 border-emerald-200",
      red: "bg-red-100 text-red-600 border-red-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      pink: "bg-pink-100 text-pink-600 border-pink-200",
      indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lembaga Desa</h1>
          <p className="text-gray-500 text-sm">
            Kelola profil mitra kerja pemerintah desa (BPD, LPM, PKK, dll).
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
        >
          <Plus size={20} /> Tambah Lembaga
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
        <Search className="absolute left-6 top-7 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama lembaga..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              {/* Icon Box dengan Warna Dinamis */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl tracking-wider border-2 ${getColorClass(
                  item.warna
                )}`}
              >
                {item.singkatan}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {item.nama}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
              {item.deskripsi}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <UserCircle size={16} className="text-gray-400" />
                {item.ketua}
              </div>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 flex items-center gap-1">
                <Users size={12} /> {item.anggota} Anggota
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Lembaga" : "Tambah Lembaga Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="label-input">Nama Lembaga</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.nama}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Contoh: Karang Taruna"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Singkatan</label>
                  <input
                    type="text"
                    className="input-field font-bold uppercase"
                    value={formData.singkatan}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, singkatan: e.target.value })
                    }
                    placeholder="KT"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="label-input">Tema Warna</label>
                  <select
                    className="input-field bg-white capitalize"
                    value={formData.warna}
                    onChange={(e) =>
                      setFormData({ ...formData, warna: e.target.value })
                    }
                  >
                    <option value="blue">Biru (BPD)</option>
                    <option value="pink">Pink (PKK)</option>
                    <option value="orange">Orange (LPM)</option>
                    <option value="green">Hijau (Linmas)</option>
                    <option value="indigo">Indigo (Karang Taruna)</option>
                    <option value="red">Merah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Nama Ketua</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.ketua}
                    onChange={(e) =>
                      setFormData({ ...formData, ketua: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">Jml. Anggota</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.anggota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anggota: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label-input">Deskripsi / Tugas Pokok</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  placeholder="Jelaskan fungsi lembaga ini..."
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Batal
              </button>
              <button onClick={handleSave} className="btn-primary">
                <Save size={18} /> Simpan
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
          @apply w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm;
        }
        .btn-primary {
          @apply px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2;
        }
        .btn-secondary {
          @apply px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200;
        }
      `}</style>
    </div>
  );
}
