"use client";

import {
  Users,
  FileText,
  Wallet,
  Megaphone,
  ArrowUpRight,
  Calendar,
  TrendingUp,
  PlusCircle,
  FileCheck,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/formatRupiah";

export default function AdminDashboardClient({
  stats,
  chartData,
  recentActivity,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentYear = new Date().getFullYear();
  const selectedYear = searchParams.get("year") || currentYear;

  // Generate 5 tahun ke belakang
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleYearChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("year", e.target.value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Helper Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
            Menunggu
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/*  HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Ringkasan
          </h1>
          <p className="text-gray-500 text-sm">
            Pantau kinerja dan aktivitas desa secara real-time.
          </p>
        </div>
        <div className="flex gap-3">
          {/* FILTER TAHUN DINAMIS */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-2.5 text-gray-500"
              size={16}
            />
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-white border border-gray-200 text-gray-700 pl-10 pr-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none focus:ring-2 focus:ring-slate-900 appearance-none"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
          >
            Cetak Laporan
          </button>
        </div>
      </div>

      {/*  STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/kependudukan/penduduk"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> Aktif
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Penduduk</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.penduduk.toLocaleString()}
            </h3>
          </div>
        </Link>

        <Link
          href="/admin/layanan/buat-surat"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <FileText size={80} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            {stats.suratPending > 0 && (
              <span className="flex items-center text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full animate-pulse shadow-red-200 shadow-lg">
                Perlu Tindakan
              </span>
            )}
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium">
              Verifikasi Surat
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.suratPending}{" "}
              <span className="text-sm font-normal text-gray-400">
                Permohonan
              </span>
            </h3>
          </div>
        </Link>

        <Link
          href="/admin/keuangan/realisasi"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wallet size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Saldo Kas Desa</p>
            <h3
              className={`text-2xl font-bold ${
                stats.saldoKas < 0 ? "text-red-500" : "text-gray-800"
              }`}
            >
              {formatCurrency(stats.saldoKas)}
            </h3>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/layanan/pengaduan"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Megaphone size={24} />
            </div>
            {stats.aduanPending > 0 && (
              <span className="flex items-center text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                Baru
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Aduan Belum Dibaca
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.aduanPending}
            </h3>
          </div>
        </Link>
      </div>

      {/* CHARTS & WIDGETS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: CHART (Area Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={20} />
              Statistik Layanan Surat ({selectedYear})
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="masuk"
                  name="Masuk"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMasuk)"
                />
                <Area
                  type="monotone"
                  dataKey="selesai"
                  name="Selesai"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSelesai)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AKSI CEPAT */}
        <div className="flex flex-col gap-6">
          {/* CARD AKSI CEPAT */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl h-full">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">
              Akses Cepat
            </h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">
              Menu yang paling sering digunakan admin.
            </p>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Link
                href="/admin/layanan/approved"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors flex flex-col items-center gap-2 group"
              >
                <FileCheck
                  size={24}
                  className="text-emerald-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold">Verif Surat</span>
              </Link>
              <Link
                href="/admin/informasi/berita"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors flex flex-col items-center gap-2 group"
              >
                <PlusCircle
                  size={24}
                  className="text-yellow-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold">Tulis Berita</span>
              </Link>
              <Link
                href="/admin/kependudukan/penduduk"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors flex flex-col items-center gap-2 group"
              >
                <Users
                  size={24}
                  className="text-blue-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold">Cek Warga</span>
              </Link>
              <Link
                href="/admin/keuangan/transaksi"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors flex flex-col items-center gap-2 group"
              >
                <Wallet
                  size={24}
                  className="text-purple-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold">Input Kas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/*  TABEL AKTIFITAS TERBARU  */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Permohonan Surat Terbaru</h3>
          <Link
            href="/admin/layanan/surat"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">ID Request</th>
                <th className="px-6 py-4">Nama Warga</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentActivity.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {item.warga}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.jenis}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-700">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {recentActivity.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-400 text-sm"
                  >
                    Belum ada permohonan surat terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
