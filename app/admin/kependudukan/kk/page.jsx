"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  X,
  Save,
  MapPin,
} from "lucide-react";

// --- DUMMY DATA KK (Beserta Anggotanya) ---
const initialKK = [
  {
    id: 1,
    noKK: "3312012005150001",
    kepalaKeluarga: "Budi Santoso",
    dusun: "Krajan",
    rt: "01",
    rw: "01",
    anggota: [
      {
        nik: "3312010101900001",
        nama: "Budi Santoso",
        hubungan: "Kepala Keluarga",
      },
      { nik: "3312010505950002", nama: "Siti Aminah", hubungan: "Istri" },
      { nik: "3312012012200003", nama: "Rudi Santoso", hubungan: "Anak" },
    ],
  },
  {
    id: 2,
    noKK: "3312012005150002",
    kepalaKeluarga: "Joko Susilo",
    dusun: "Sukamaju",
    rt: "02",
    rw: "03",
    anggota: [
      {
        nik: "3312011010800003",
        nama: "Joko Susilo",
        hubungan: "Kepala Keluarga",
      },
      { nik: "3312011212000004", nama: "Dewi Sartika", hubungan: "Istri" },
    ],
  },
];

export default function KartuKeluargaPage() {
  const [dataKK, setDataKK] = useState(initialKK);
  const [search, setSearch] = useState("");
  const [filterDusun, setFilterDusun] = useState("Semua");

  // State Modals
  const [modalType, setModalType] = useState(null); // 'form' or 'detail' or null
  const [selectedKK, setSelectedKK] = useState(null); // Buat detail anggota
  const [formData, setFormData] = useState({
    id: null,
    noKK: "",
    kepalaKeluarga: "",
    dusun: "Krajan",
    rt: "",
    rw: "",
  });

  // Filter Logic
  const filteredData = dataKK.filter((item) => {
    const matchSearch =
      item.kepalaKeluarga.toLowerCase().includes(search.toLowerCase()) ||
      item.noKK.includes(search);
    const matchDusun = filterDusun === "Semua" || item.dusun === filterDusun;
    return matchSearch && matchDusun;
  });

  // --- CRUD HANDLERS ---
  const openFormModal = (item = null) => {
    if (item) {
      setFormData({ ...item }); // Edit
    } else {
      setFormData({
        id: null,
        noKK: "",
        kepalaKeluarga: "",
        dusun: "Krajan",
        rt: "",
        rw: "",
      }); // New
    }
    setModalType("form");
  };

  const openDetailModal = (item) => {
    setSelectedKK(item);
    setModalType("detail");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update
      setDataKK(
        dataKK.map((kk) =>
          kk.id === formData.id ? { ...kk, ...formData } : kk
        )
      );
    } else {
      // Create
      const newKK = {
        ...formData,
        id: Date.now(),
        anggota: [], // Default kosong kalau buat baru manual
      };
      setDataKK([...dataKK, newKK]);
    }
    setModalType(null);
  };

  const handleDelete = (id) => {
    if (
      confirm(
        "Hapus Kartu Keluarga ini? Semua anggota keluarga akan terlepas dari KK."
      )
    ) {
      setDataKK(dataKK.filter((kk) => kk.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kartu Keluarga (KK)
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola data kepala keluarga dan pengelompokan warga.
          </p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={18} /> Buat KK Baru
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari No. KK atau Kepala Keluarga..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[180px]"
            value={filterDusun}
            onChange={(e) => setFilterDusun(e.target.value)}
          >
            <option value="Semua">Semua Dusun</option>
            <option value="Krajan">Dusun Krajan</option>
            <option value="Sukamaju">Dusun Sukamaju</option>
            <option value="Sumber">Dusun Sumber</option>
          </select>
        </div>
      </div>

      {/* TABLE KK */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 border-b">Nomor KK</th>
                <th className="px-6 py-4 border-b">Kepala Keluarga</th>
                <th className="px-6 py-4 border-b">Alamat</th>
                <th className="px-6 py-4 border-b text-center">Anggota</th>
                <th className="px-6 py-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">
                    {item.noKK}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {item.kepalaKeluarga}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-emerald-500" />
                      {item.dusun}, RT {item.rt} / RW {item.rw}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                      <Users size={12} />{" "}
                      {item.anggota ? item.anggota.length : 0} Jiwa
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openDetailModal(item)}
                        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="Lihat Anggota Keluarga"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openFormModal(item)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit KK"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Data tidak ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* === MODAL FORM (ADD/EDIT) === */}
      {modalType === "form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Kartu Keluarga" : "Buat KK Baru"}
              </h3>
              <button onClick={() => setModalType(null)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-text">Nomor KK</label>
                <input
                  type="text"
                  className="input-field font-mono"
                  maxLength={16}
                  value={formData.noKK}
                  onChange={(e) =>
                    setFormData({ ...formData, noKK: e.target.value })
                  }
                  placeholder="16 Digit Angka"
                />
              </div>
              <div>
                <label className="label-text">Kepala Keluarga</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.kepalaKeluarga}
                  onChange={(e) =>
                    setFormData({ ...formData, kepalaKeluarga: e.target.value })
                  }
                  placeholder="Nama Lengkap"
                />
              </div>
              <div>
                <label className="label-text">Dusun</label>
                <select
                  className="input-field bg-white"
                  value={formData.dusun}
                  onChange={(e) =>
                    setFormData({ ...formData, dusun: e.target.value })
                  }
                >
                  <option value="Krajan">Krajan</option>
                  <option value="Sukamaju">Sukamaju</option>
                  <option value="Sumber">Sumber</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">RT</label>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={formData.rt}
                    onChange={(e) =>
                      setFormData({ ...formData, rt: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-text">RW</label>
                  <input
                    type="text"
                    className="input-field text-center"
                    value={formData.rw}
                    onChange={(e) =>
                      setFormData({ ...formData, rw: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setModalType(null)}
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

      {/* === MODAL DETAIL ANGGOTA === */}
      {modalType === "detail" && selectedKK && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[80vh]">
            <div className="p-6 bg-slate-900 text-white rounded-t-2xl flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Anggota Keluarga</h3>
                <p className="text-slate-400 text-sm font-mono mt-1">
                  NO. KK: {selectedKK.noKK}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                  <span className="bg-emerald-600 px-2 py-0.5 rounded text-white">
                    {selectedKK.kepalaKeluarga}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedKK.dusun} RT {selectedKK.rt}/{selectedKK.rw}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">NIK</th>
                    <th className="px-6 py-3">Nama Lengkap</th>
                    <th className="px-6 py-3">Hubungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {selectedKK.anggota &&
                    selectedKK.anggota.map((member, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-3 font-mono text-gray-600">
                          {member.nik}
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {member.nama}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-bold 
                                              ${
                                                member.hubungan ===
                                                "Kepala Keluarga"
                                                  ? "bg-emerald-100 text-emerald-700"
                                                  : "bg-gray-100 text-gray-600"
                                              }
                                          `}
                          >
                            {member.hubungan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {(!selectedKK.anggota || selectedKK.anggota.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400">
                        Belum ada anggota terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 text-right rounded-b-2xl">
              <button
                onClick={() => setModalType(null)}
                className="btn-secondary text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-text {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-800;
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
