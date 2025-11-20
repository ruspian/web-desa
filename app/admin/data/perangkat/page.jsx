"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  ShieldCheck,
  Save,
  X,
  Upload,
  Camera,
} from "lucide-react";
import Image from "next/image";

// --- DUMMY DATA ---
const initialData = [
  {
    id: 1,
    nama: "H. Budi Santoso, S.IP",
    nip: "19750101 200001 1 001",
    jabatan: "Kepala Desa",
    noHp: "081234567890",
    status: "Aktif",
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    id: 2,
    nama: "Siti Aminah, S.Kom",
    nip: "19800505 201001 2 005",
    jabatan: "Sekretaris Desa",
    noHp: "081298765432",
    status: "Aktif",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    id: 3,
    nama: "Ahmad Fauzi",
    nip: "19850817 201501 1 002",
    jabatan: "Kaur Keuangan",
    noHp: "085678912345",
    status: "Aktif",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    id: 4,
    nama: "Supriyadi",
    nip: "-",
    jabatan: "Kepala Dusun I",
    noHp: "081345678901",
    status: "Cuti",
    foto: null, // Simulasi gak ada foto
  },
];

export default function AdminPerangkatPage() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    nip: "",
    jabatan: "Kepala Seksi",
    noHp: "",
    status: "Aktif",
    foto: null,
  });

  // Filter
  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  // CRUD
  const handleDelete = (id) => {
    if (confirm("Hapus data perangkat ini?"))
      setData(data.filter((i) => i.id !== id));
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: null,
        nama: "",
        nip: "",
        jabatan: "Staf",
        noHp: "",
        status: "Aktif",
        foto: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      setData(data.map((d) => (d.id === formData.id ? formData : d)));
    } else {
      setData([
        ...data,
        {
          ...formData,
          id: Date.now(),
          // Dummy foto default kalau gak upload
          foto:
            formData.foto ||
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
        },
      ]);
    }
    setIsModalOpen(false);
  };

  // Jabatan Options
  const jabatanOptions = [
    "Kepala Desa",
    "Sekretaris Desa",
    "Kaur Keuangan",
    "Kaur Umum & Tata Usaha",
    "Kaur Perencanaan",
    "Kasi Pemerintahan",
    "Kasi Kesejahteraan",
    "Kasi Pelayanan",
    "Kepala Dusun",
    "Staf",
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perangkat Desa</h1>
          <p className="text-gray-500 text-sm">
            Kelola data struktural, jabatan, dan profil pegawai.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
        >
          <Plus size={20} /> Tambah Pegawai
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
        <Search className="absolute left-6 top-6.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama atau jabatan..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredData.map((item) => {
          const isKades = item.jabatan === "Kepala Desa";
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden group transition-all hover:-translate-y-1 ${
                isKades
                  ? "border-2 border-yellow-400 ring-4 ring-yellow-400/10"
                  : "border border-gray-100"
              }`}
            >
              {/* Foto Profil */}
              <div className="h-64 relative bg-gray-100 overflow-hidden">
                {item.foto ? (
                  <Image
                    src={item.foto}
                    alt={item.nama}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <User size={64} />
                    <span className="text-xs mt-2">Tidak ada foto</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm
                                ${
                                  item.status === "Aktif"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-500 text-white"
                                }
                            `}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Kades Badge */}
                {isKades && (
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-400 text-yellow-900 text-center text-xs font-bold py-1">
                    PEMIMPIN DESA
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="mb-4">
                  <p
                    className={`text-xs font-bold uppercase mb-1 tracking-wider ${
                      isKades ? "text-yellow-600" : "text-emerald-600"
                    }`}
                  >
                    {item.jabatan}
                  </p>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    NIP: {item.nip || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-gray-50 p-2 rounded-lg">
                  <Phone size={14} />
                  <span>{item.noHp}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openModal(item)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Pegawai" : "Tambah Pegawai Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Upload Foto */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 group cursor-pointer">
                  {formData.foto ? (
                    <Image
                      src={formData.foto}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={24} />
                  </div>
                </div>
              </div>

              <div>
                <label className="label-input">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.nama}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">NIP / NIAP</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.nip}
                    onChange={(e) =>
                      setFormData({ ...formData, nip: e.target.value })
                    }
                    placeholder="Kosongkan jika belum ada"
                  />
                </div>
                <div>
                  <label className="label-input">Status</label>
                  <select
                    className="input-field bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Aktif</option>
                    <option>Cuti</option>
                    <option>Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-input">Jabatan Struktural</label>
                <select
                  className="input-field bg-white"
                  value={formData.jabatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatan: e.target.value })
                  }
                >
                  {jabatanOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-input">Nomor WhatsApp</label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                />
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
                <Save size={18} /> Simpan Data
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
