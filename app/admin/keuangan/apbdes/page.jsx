"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Save,
  X,
  PieChart,
} from "lucide-react";

// --- DUMMY DATA APBDES ---
const initialData = [
  // PENDAPATAN
  {
    id: 1,
    tahun: "2025",
    jenis: "income",
    kategori: "Dana Desa (DD)",
    anggaran: 850000000,
    realisasi: 425000000,
  },
  {
    id: 2,
    tahun: "2025",
    jenis: "income",
    kategori: "Alokasi Dana Desa (ADD)",
    anggaran: 450000000,
    realisasi: 225000000,
  },
  {
    id: 3,
    tahun: "2025",
    jenis: "income",
    kategori: "Pendapatan Asli Desa (PAD)",
    anggaran: 50000000,
    realisasi: 15000000,
  },

  // BELANJA
  {
    id: 4,
    tahun: "2025",
    jenis: "expense",
    kategori: "Bidang Penyelenggaraan Pemerintahan",
    anggaran: 350000000,
    realisasi: 150000000,
  },
  {
    id: 5,
    tahun: "2025",
    jenis: "expense",
    kategori: "Bidang Pelaksanaan Pembangunan",
    anggaran: 600000000,
    realisasi: 300000000,
  },
  {
    id: 6,
    tahun: "2025",
    jenis: "expense",
    kategori: "Bidang Pembinaan Kemasyarakatan",
    anggaran: 100000000,
    realisasi: 20000000,
  },
];

export default function AdminApbdesPage() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("income"); // income | expense
  const [year, setYear] = useState("2025");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    tahun: "2025",
    jenis: "income",
    kategori: "",
    anggaran: 0,
    realisasi: 0,
  });

  // Filter Data sesuai Tab & Tahun
  const filteredData = data.filter(
    (item) => item.jenis === activeTab && item.tahun === year
  );

  // Hitung Total (Summary)
  const totalIncome = data
    .filter((i) => i.jenis === "income" && i.tahun === year)
    .reduce((acc, curr) => acc + curr.anggaran, 0);
  const totalExpense = data
    .filter((i) => i.jenis === "expense" && i.tahun === year)
    .reduce((acc, curr) => acc + curr.anggaran, 0);
  const surplus = totalIncome - totalExpense;

  // Format Rupiah
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  // CRUD
  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: null,
        tahun: year,
        jenis: activeTab,
        kategori: "",
        anggaran: 0,
        realisasi: 0,
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
    if (confirm("Hapus data anggaran ini?"))
      setData(data.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Keuangan Desa (APBDes)
          </h1>
          <p className="text-gray-500 text-sm">
            Input Anggaran dan Realisasi untuk transparansi publik.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="2026">TA 2026</option>
            <option value="2025">TA 2025</option>
            <option value="2024">TA 2024</option>
          </select>
          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} /> Tambah Data
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">
              Total Pendapatan
            </p>
            <h3 className="text-xl font-bold text-emerald-600">
              {formatRupiah(totalIncome)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">
              Total Belanja
            </p>
            <h3 className="text-xl font-bold text-red-600">
              {formatRupiah(totalExpense)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl shadow-lg flex items-center justify-between text-white">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">
              Surplus / Defisit
            </p>
            <h3
              className={`text-xl font-bold ${
                surplus >= 0 ? "text-blue-400" : "text-red-400"
              }`}
            >
              {formatRupiah(surplus)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center">
            <Wallet size={20} />
          </div>
        </div>
      </div>

      {/* TABS & TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("income")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${
                      activeTab === "income"
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30"
                        : "text-gray-500 hover:bg-gray-50"
                    }
                `}
          >
            <TrendingUp size={18} /> Pendapatan Desa
          </button>
          <button
            onClick={() => setActiveTab("expense")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${
                      activeTab === "expense"
                        ? "text-red-600 border-b-2 border-red-600 bg-red-50/30"
                        : "text-gray-500 hover:bg-gray-50"
                    }
                `}
          >
            <TrendingDown size={18} /> Belanja Desa
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Uraian / Kategori</th>
                <th className="px-6 py-4 text-right">Anggaran (Pagu)</th>
                <th className="px-6 py-4 text-right">Realisasi (Terpakai)</th>
                <th className="px-6 py-4 text-center">% Capaian</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => {
                const persen =
                  item.anggaran > 0
                    ? Math.round((item.realisasi / item.anggaran) * 100)
                    : 0;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-600">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                      {formatRupiah(item.realisasi)}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              persen > 90
                                ? "bg-green-500"
                                : persen > 50
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                            style={{ width: `${persen}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">
                          {persen}%
                        </span>
                      </div>
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
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-bold text-gray-800">
              <tr>
                <td className="px-6 py-4">TOTAL</td>
                <td className="px-6 py-4 text-right">
                  {formatRupiah(
                    filteredData.reduce((acc, curr) => acc + curr.anggaran, 0)
                  )}
                </td>
                <td className="px-6 py-4 text-right text-emerald-700">
                  {formatRupiah(
                    filteredData.reduce((acc, curr) => acc + curr.realisasi, 0)
                  )}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Data Anggaran" : "Tambah Mata Anggaran"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Tahun Anggaran</label>
                  <input
                    type="text"
                    className="input-field bg-gray-100"
                    value={formData.tahun}
                    readOnly
                  />
                </div>
                <div>
                  <label className="label-input">Jenis</label>
                  <select
                    className="input-field bg-white"
                    value={formData.jenis}
                    onChange={(e) =>
                      setFormData({ ...formData, jenis: e.target.value })
                    }
                  >
                    <option value="income">Pendapatan</option>
                    <option value="expense">Belanja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-input">Uraian / Kategori</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="Contoh: Bidang Pembangunan Jalan"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label-input">Jumlah Anggaran (Pagu)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-400 font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    className="input-field pl-10 font-mono text-lg"
                    required
                    value={formData.anggaran}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anggaran: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label-input">Realisasi Saat Ini</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-400 font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    className="input-field pl-10 font-mono text-lg"
                    required
                    value={formData.realisasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        realisasi: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  *Update kolom ini setiap bulan untuk grafik progres.
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
