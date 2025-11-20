"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileDown,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

// --- HELPER: FORMAT RUPIAH ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

// --- DUMMY DATA (Tahun Anggaran 2025) ---
const summary = {
  income: 1850000000, // 1.8 Milyar
  expense: 1650000000, // 1.6 Milyar (Surplus)
};

// Sumber Pendapatan
const dataIncome = [
  { name: "Dana Desa (DD)", value: 950000000, color: "#10b981" }, // Emerald
  { name: "Alokasi Dana Desa (ADD)", value: 550000000, color: "#3b82f6" }, // Blue
  { name: "Pendapatan Asli Desa (PAD)", value: 150000000, color: "#f59e0b" }, // Amber
  { name: "Bagi Hasil Pajak", value: 100000000, color: "#8b5cf6" }, // Violet
  { name: "Bantuan Keuangan", value: 100000000, color: "#ec4899" }, // Pink
];

// Belanja per Bidang (Realisasi)
const dataExpense = [
  {
    id: 1,
    category: "Bidang Penyelenggaraan Pemerintahan",
    budget: 550000000,
    realization: 250000000,
  },
  {
    id: 2,
    category: "Bidang Pelaksanaan Pembangunan",
    budget: 800000000,
    realization: 600000000,
  },
  {
    id: 3,
    category: "Bidang Pembinaan Kemasyarakatan",
    budget: 150000000,
    realization: 50000000,
  },
  {
    id: 4,
    category: "Bidang Pemberdayaan Masyarakat",
    budget: 100000000,
    realization: 25000000,
  },
  {
    id: 5,
    category: "Bidang Penanggulangan Bencana",
    budget: 50000000,
    realization: 10000000,
  },
];

export default function ApbdesPage() {
  const [year, setYear] = useState("2025");

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER & DOWNLOAD */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <Wallet size={16} />
              Transparansi Keuangan
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              APBDes Tahun {year}
            </h1>
            <p className="text-gray-500 mt-2">
              Laporan Anggaran Pendapatan dan Belanja Desa secara transparan dan
              akuntabel.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Year Selector */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
            </select>

            {/* Download Button */}
            <button className="px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <FileDown size={18} />
              <span className="hidden md:inline">Unduh Laporan</span>
            </button>
          </div>
        </div>

        {/* 1. SUMMARY CARDS (Big Numbers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pendapatan */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={100} className="text-green-600" />
            </div>
            <p className="text-gray-500 font-medium mb-2">Total Pendapatan</p>
            <h2 className="text-3xl font-bold text-green-600">
              {formatRupiah(summary.income)}
            </h2>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> Target tercapai 100%
            </p>
          </div>

          {/* Belanja */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingDown size={100} className="text-red-600" />
            </div>
            <p className="text-gray-500 font-medium mb-2">Total Belanja</p>
            <h2 className="text-3xl font-bold text-red-600">
              {formatRupiah(summary.expense)}
            </h2>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> Realisasi berjalan
            </p>
          </div>

          {/* Sisa (Surplus/Defisit) */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl relative overflow-hidden text-white">
            <p className="text-gray-400 font-medium mb-2">
              Sisa Anggaran (Surplus)
            </p>
            <h2 className="text-3xl font-bold text-blue-400">
              {formatRupiah(summary.income - summary.expense)}
            </h2>
            <p className="text-xs text-gray-400 mt-2">
              Akan masuk ke SILPA tahun berikutnya
            </p>
          </div>
        </div>

        {/* 2. CHARTS SECTION (Split View) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* LEFT: SUMBER DANA (Pie Chart) */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Sumber Pendapatan
            </h3>
            <div className="h-[300px] w-full relative grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataIncome}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataIncome.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatRupiah(value)}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-[-20px]">
                <span className="text-xs font-bold text-gray-400">SUMBER</span>
              </div>
            </div>
          </div>

          {/* RIGHT: REALISASI BELANJA (Progress Bars) */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Realisasi Belanja Desa
            </h3>
            <div className="space-y-8">
              {dataExpense.map((item) => {
                const percentage = Math.round(
                  (item.realization / item.budget) * 100
                );
                return (
                  <div key={item.id}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm md:text-base">
                          {item.category}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Terpakai:{" "}
                          <span className="font-semibold text-gray-700">
                            {formatRupiah(item.realization)}
                          </span>
                          {" / "}
                          Pagu: {formatRupiah(item.budget)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          percentage > 80 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          percentage > 75
                            ? "bg-green-500"
                            : percentage > 40
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <button className="text-green-600 font-semibold text-sm hover:text-green-700 flex items-center justify-center gap-1 mx-auto">
                Lihat Rincian Lengkap (PDF) <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. INFO TAMBAHAN / DISLAIMER */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="text-blue-600 shrink-0 mt-1" />
          <div className="text-sm text-blue-800">
            <h4 className="font-bold mb-1">Informasi Publik</h4>
            <p className="opacity-80 leading-relaxed">
              Data yang disajikan adalah data real-time berdasarkan Input Sistem
              Keuangan Desa (Siskeudes) yang telah diverifikasi oleh Sekretaris
              Desa. Masyarakat berhak mengetahui rincian penggunaan dana desa
              sesuai UU No. 6 Tahun 2014 tentang Desa.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
