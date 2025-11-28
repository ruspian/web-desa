"use client";

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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatRupiah";

// Warna Chart untuk Pie
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function PublicApbdesClient({
  summary,
  dataIncome,
  dataExpense,
  selectedYear,
  yearsList,
}) {
  const router = useRouter();

  // Handle Ganti Tahun
  const handleYearChange = (e) => {
    router.push(`/pemerintahan/transparansi?tahun=${e.target.value}`);
  };

  return (
    <div className="container mx-auto px-6">
      {/* HEADER & DOWNLOAD */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <Wallet size={16} />
            Transparansi Keuangan
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            APBDes Tahun {selectedYear}
          </h1>
          <p className="text-gray-500 mt-2">
            Laporan Anggaran Pendapatan dan Belanja Desa secara transparan dan
            akuntabel.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer"
          >
            {yearsList.map((yr) => (
              <option key={yr} value={yr}>
                Tahun {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TOTAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Pendapatan */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-green-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={100} className="text-green-600" />
          </div>
          <p className="text-gray-500 font-medium mb-2">Total Pendapatan</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-green-600">
            {formatCurrency(summary.income)}
          </h2>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> Target Anggaran
          </p>
        </div>

        {/* Belanja */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-red-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingDown size={100} className="text-red-600" />
          </div>
          <p className="text-gray-500 font-medium mb-2">Total Belanja</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-red-600">
            {formatCurrency(summary.expense)}
          </h2>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> Rencana Pengeluaran
          </p>
        </div>

        {/* Sisa  */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl relative overflow-hidden text-white">
          <p className="text-gray-400 font-medium mb-2">Surplus / Defisit</p>
          <h2
            className={`text-2xl lg:text-3xl font-bold ${
              summary.surplus >= 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {formatCurrency(summary.surplus)}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            {summary.surplus >= 0
              ? "Estimasi Sisa Lebih (SILPA)"
              : "Defisit Anggaran"}
          </p>
        </div>
      </div>

      {/* CHARTS SECTION  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* SUMBER DANA  */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Sumber Pendapatan
          </h3>
          {dataIncome.length > 0 ? (
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
                    {dataIncome.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-[-20px]">
                <span className="text-xs font-bold text-gray-400">SUMBER</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
              Belum ada data pendapatan.
            </div>
          )}
        </div>

        {/* REALISASI BELANJA */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Progres Realisasi Belanja
          </h3>
          <div className="space-y-8">
            {dataExpense.length > 0 ? (
              dataExpense.map((item) => {
                const percentage =
                  item.budget > 0
                    ? Math.round((item.realization / item.budget) * 100)
                    : 0;
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
                            {formatCurrency(item.realization)}
                          </span>
                          {" / "}
                          Pagu: {formatCurrency(item.budget)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          percentage > 90
                            ? "text-green-600"
                            : percentage > 50
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          percentage > 90
                            ? "bg-green-500"
                            : percentage > 50
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-400 italic">
                Belum ada data belanja untuk tahun ini.
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              *Data diperbarui secara real-time dari sistem keuangan desa.
            </p>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="text-blue-600 shrink-0 mt-1" />
        <div className="text-sm text-blue-800">
          <h4 className="font-bold mb-1">Informasi Publik</h4>
          <p className="opacity-80 leading-relaxed">
            Data yang disajikan adalah data real-time berdasarkan Input Sistem
            Keuangan Desa yang telah diverifikasi. Masyarakat berhak mengetahui
            rincian penggunaan dana desa sesuai UU No. 6 Tahun 2014 tentang
            Desa.
          </p>
        </div>
      </div>
    </div>
  );
}
