"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileUp,
  FileDown,
  Save,
  X,
  Gift,
  AlertCircle,
} from "lucide-react";

// --- DUMMY DATA PENERIMA BANSOS ---
const initialBansos = [
  {
    id: 1,
    nik: "3312010101900001",
    nama: "Budi Santoso",
    dusun: "Krajan",
    jenis: "BLT Dana Desa",
    periode: "2025",
    nominal: 300000,
    status: "Aktif",
  },
  {
    id: 2,
    nik: "3312010505950002",
    nama: "Siti Aminah",
    dusun: "Sukamaju",
    jenis: "PKH",
    periode: "2025",
    nominal: 0, // Dinamis
    status: "Aktif",
  },
  {
    id: 3,
    nik: "3312010101500005",
    nama: "Mbah Surip",
    dusun: "Sumber",
    jenis: "BPNT / Sembako",
    periode: "2025",
    nominal: 200000,
    status: "Non-Aktif",
  },
];

export default function AdminBansosPage() {
  const [data, setData] = useState(initialBansos);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    nik: "",
    nama: "",
    dusun: "Krajan",
    jenis: "BLT Dana Desa",
    periode: "2025",
    nominal: 0,
    status: "Aktif",
  });

  // Filter Logic
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search);
    const matchJenis = filterJenis === "Semua" || item.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  // Format Rupiah
  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // --- CRUD ---
  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: null,
        nik: "",
        nama: "",
        dusun: "Krajan",
        jenis: "BLT Dana Desa",
        periode: "2025",
        nominal: 300000,
        status: "Aktif",
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

  const handleDelete = (id) => {
    if (confirm("Hapus data penerima ini?"))
      setData(data.filter((d) => d.id !== id));
  };

  // Helper Badge Warna
  const getBadgeColor = (jenis) => {
    switch (jenis) {
      case "BLT Dana Desa":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PKH":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "BPNT / Sembako":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Data Bantuan Sosial
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola data penerima manfaat (KPM) BLT, PKH, dan BPNT.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-green-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-colors">
            <FileUp size={18} /> Import Excel
          </button>
          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} /> Tambah Penerima
          </button>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-200 text-emerald-700 rounded-lg flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-bold uppercase">
              BLT Dana Desa
            </p>
            <p className="text-lg font-bold text-emerald-900">
              {
                data.filter(
                  (i) => i.jenis === "BLT Dana Desa" && i.status === "Aktif"
                ).length
              }{" "}
              KPM
            </p>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase">
              PKH (Pusat)
            </p>
            <p className="text-lg font-bold text-blue-900">
              {
                data.filter((i) => i.jenis === "PKH" && i.status === "Aktif")
                  .length
              }{" "}
              KPM
            </p>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-200 text-orange-700 rounded-lg flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <p className="text-xs text-orange-600 font-bold uppercase">
              BPNT / Sembako
            </p>
            <p className="text-lg font-bold text-orange-900">
              {
                data.filter(
                  (i) => i.jenis === "BPNT / Sembako" && i.status === "Aktif"
                ).length
              }{" "}
              KPM
            </p>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari NIK atau Nama KPM..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[180px]"
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
          >
            <option value="Semua">Semua Bantuan</option>
            <option value="BLT Dana Desa">BLT Dana Desa</option>
            <option value="PKH">PKH</option>
            <option value="BPNT / Sembako">BPNT / Sembako</option>
            <option value="BST Kemensos">BST Kemensos</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Penerima (KPM)</th>
                <th className="px-6 py-4">Jenis Bantuan</th>
                <th className="px-6 py-4">Periode</th>
                <th className="px-6 py-4">Nominal/Bulan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{item.nama}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {item.nik}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Dusun {item.dusun}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold border ${getBadgeColor(
                        item.jenis
                      )}`}
                    >
                      {item.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {item.periode}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-700">
                    {item.nominal > 0 ? formatRupiah(item.nominal) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "Aktif" ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                        Non-Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Data KPM" : "Tambah Penerima Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-input">NIK (Sesuai KTP)</label>
                  <input
                    type="text"
                    className="input-field font-mono"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-input">Nama Lengkap</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-input">Dusun</label>
                  <select
                    className="input-field bg-white"
                    value={formData.dusun}
                    onChange={(e) =>
                      setFormData({ ...formData, dusun: e.target.value })
                    }
                  >
                    <option>Krajan</option>
                    <option>Sukamaju</option>
                    <option>Sumber</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 my-2 pt-2"></div>

              <div>
                <label className="label-input">Jenis Bantuan</label>
                <select
                  className="input-field bg-white"
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis: e.target.value })
                  }
                >
                  <option>BLT Dana Desa</option>
                  <option>PKH</option>
                  <option>BPNT / Sembako</option>
                  <option>BST Kemensos</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Tahun Periode</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.periode}
                    onChange={(e) =>
                      setFormData({ ...formData, periode: e.target.value })
                    }
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
                    <option>Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-input">Nominal per Bulan (Rp)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nominal: parseInt(e.target.value),
                    })
                  }
                  placeholder="0 jika barang"
                />
                <p className="text-xs text-gray-400 mt-1">
                  *Isi 0 jika bantuan berupa barang/sembako
                </p>
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
                  Simpan Data
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
