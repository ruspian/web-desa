"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Save,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// --- DUMMY DATA TRANSAKSI ---
const initialTransactions = [
  {
    id: 1,
    tanggal: "2025-11-18",
    uraian: "Belanja Material Semen (50 Sak)",
    kategori: "Pembangunan Jalan",
    tipe: "expense",
    nominal: 2500000,
    bukti: "kwitansi-001.jpg",
  },
  {
    id: 2,
    tanggal: "2025-11-15",
    uraian: "Pencairan Dana Desa Tahap 3",
    kategori: "Dana Desa",
    tipe: "income",
    nominal: 300000000,
    bukti: "transfer-001.jpg",
  },
  {
    id: 3,
    tanggal: "2025-11-10",
    uraian: "Honor Narasumber Pelatihan UMKM",
    kategori: "Pemberdayaan",
    tipe: "expense",
    nominal: 1500000,
    bukti: "kwitansi-002.jpg",
  },
  {
    id: 4,
    tanggal: "2025-11-05",
    uraian: "Belanja ATK Kantor Desa",
    kategori: "Operasional Kantor",
    tipe: "expense",
    nominal: 500000,
    bukti: "nota-001.jpg",
  },
];

// --- DUMMY DATA CHART (Bulanan) ---
const dataChart = [
  { bulan: "Jan", pendapatan: 400, belanja: 240 },
  { bulan: "Feb", pendapatan: 300, belanja: 139 },
  { bulan: "Mar", pendapatan: 200, belanja: 980 },
  { bulan: "Apr", pendapatan: 278, belanja: 390 },
  { bulan: "Mei", pendapatan: 189, belanja: 480 },
  { bulan: "Jun", pendapatan: 239, belanja: 380 },
];

export default function RealisasiPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tanggal: "",
    uraian: "",
    kategori: "",
    tipe: "expense",
    nominal: "",
  });

  // Helpers
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  // Filter Logic
  const filteredData = transactions.filter((item) => {
    const matchSearch = item.uraian
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchTipe = filterTipe === "Semua" || item.tipe === filterTipe;
    return matchSearch && matchTipe;
  });

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    const newTrans = {
      id: Date.now(),
      ...formData,
      nominal: parseInt(formData.nominal),
      bukti: "pending.jpg",
    };
    setTransactions([newTrans, ...transactions]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Realisasi & Transaksi
          </h1>
          <p className="text-gray-500 text-sm">
            Catatan kas harian (Buku Kas Umum).
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50">
            <Download size={18} /> Laporan PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} /> Catat Transaksi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KIRI: TABEL TRANSAKSI (List) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari uraian..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
            >
              <option value="Semua">Semua Transaksi</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          {/* List Cards */}
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 hover:border-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      item.tipe === "income"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.tipe === "income" ? (
                      <ArrowDownRight size={24} />
                    ) : (
                      <ArrowUpRight size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">
                      {item.uraian}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {item.kategori}
                      </span>
                      <span>• {item.tanggal}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                  <span
                    className={`font-mono font-bold ${
                      item.tipe === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.tipe === "income" ? "+" : "-"}{" "}
                    {formatRupiah(item.nominal)}
                  </span>
                  <button className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                    <FileText size={12} /> Lihat Bukti
                  </button>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                Belum ada transaksi tercatat.
              </div>
            )}
          </div>
        </div>

        {/* KANAN: CHART & STATS */}
        <div className="flex flex-col gap-6">
          {/* Mini Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} /> Tren Arus Kas
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataChart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="bulan"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`${value} Jt`, ""]}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  <Bar
                    dataKey="pendapatan"
                    name="Masuk"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="belanja"
                    name="Keluar"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Last Updated Info */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h4 className="text-sm font-medium text-slate-300 mb-1">
              Saldo Kas Desa
            </h4>
            <h2 className="text-3xl font-bold text-emerald-400 mb-4">
              Rp 1.250.400.000
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 p-2 rounded-lg w-fit">
              <Calendar size={14} />
              Update Terakhir: 20 Nov 2025
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL INPUT TRANSAKSI === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Catat Transaksi Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipe: "expense" })}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    formData.tipe === "expense"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipe: "income" })}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    formData.tipe === "income"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="label-input">Tanggal Transaksi</label>
                <input
                  type="date"
                  className="input-field"
                  required
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label-input">Uraian Kegiatan</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="Contoh: Beli Semen / Honor Tukang"
                  value={formData.uraian}
                  onChange={(e) =>
                    setFormData({ ...formData, uraian: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label-input">Kategori Anggaran</label>
                <select
                  className="input-field bg-white"
                  required
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                >
                  <option value="">-- Pilih Mata Anggaran --</option>
                  <option value="Pembangunan Jalan">
                    Bidang Pembangunan (Jalan)
                  </option>
                  <option value="Operasional Kantor">
                    Operasional Kantor Desa
                  </option>
                  <option value="Honorarium">Penghasilan Tetap (Siltap)</option>
                  <option value="Pemberdayaan">Pemberdayaan Masyarakat</option>
                  <option value="Dana Desa">Pendapatan Transfer (DD)</option>
                </select>
              </div>

              <div>
                <label className="label-input">Nominal (Rp)</label>
                <input
                  type="number"
                  className="input-field font-mono text-lg"
                  required
                  placeholder="0"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                />
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
                  Simpan Catatan
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
