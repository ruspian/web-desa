"use client";

import {
  Users,
  FileText,
  Wallet,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";

// --- DUMMY DATA GRAFIK SURAT (Trend Bulanan) ---
const dataSurat = [
  { name: "Jan", masuk: 12, selesai: 10 },
  { name: "Feb", masuk: 19, selesai: 15 },
  { name: "Mar", masuk: 15, selesai: 15 },
  { name: "Apr", masuk: 22, selesai: 20 },
  { name: "Mei", masuk: 28, selesai: 25 },
  { name: "Jun", masuk: 35, selesai: 32 },
];

// --- DUMMY DATA RECENT ACTIVITY (Surat Masuk Terakhir) ---
const recentRequests = [
  {
    id: "REQ-001",
    warga: "Budi Santoso",
    jenis: "Surat Pengantar SKCK",
    tanggal: "Hari ini, 08:30",
    status: "pending",
  },
  {
    id: "REQ-002",
    warga: "Siti Aminah",
    jenis: "Ket. Tidak Mampu",
    tanggal: "Kemarin, 14:00",
    status: "approved",
  },
  {
    id: "REQ-003",
    warga: "Joko Susilo",
    jenis: "Ket. Domisili",
    tanggal: "19 Nov 2025",
    status: "rejected",
  },
  {
    id: "REQ-004",
    warga: "Rina Wati",
    jenis: "Ket. Usaha",
    tanggal: "18 Nov 2025",
    status: "approved",
  },
];

export default function DashboardPage() {
  // Helper Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700">
            Menunggu
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER SECTION */}
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
          <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Calendar size={16} /> Filter Tanggal
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20">
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS (Grid 4 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Penduduk */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +12%
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Penduduk</p>
            <h3 className="text-3xl font-bold text-gray-800">3,450</h3>
          </div>
        </div>

        {/* Card 2: Surat Pending (Urgent) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <FileText size={80} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <FileText size={24} />
            </div>
            {/* Badge Merah kalau ada yang pending */}
            <span className="flex items-center text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full animate-pulse">
              Perlu Tindakan
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium">
              Verifikasi Surat
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              5{" "}
              <span className="text-sm font-normal text-gray-400">
                Permohonan
              </span>
            </h3>
          </div>
        </div>

        {/* Card 3: Anggaran */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Wallet size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Sisa Anggaran (SILPA)
            </p>
            <h3 className="text-3xl font-bold text-gray-800">25%</h3>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4: Pengaduan */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Megaphone size={24} />
            </div>
            <span className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Bulan Ini
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Aduan Masuk</p>
            <h3 className="text-3xl font-bold text-gray-800">8</h3>
          </div>
        </div>
      </div>

      {/* 3. CHARTS & WIDGETS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART: Statistik Layanan Surat (Area Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Statistik Layanan Surat</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1 text-gray-600 outline-none cursor-pointer hover:bg-gray-100">
              <option>6 Bulan Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dataSurat}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMasuk)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WIDGET: Pengumuman / Quick Action */}
        <div className="flex flex-col gap-6">
          {/* Quick Action */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">
              Akses Cepat
            </h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">
              Menu yang paling sering digunakan admin.
            </p>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Link
                href="/admin/surat"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors"
              >
                <FileText size={20} className="mx-auto mb-2 text-emerald-400" />
                <span className="text-xs font-bold">Verif Surat</span>
              </Link>
              <Link
                href="/admin/berita"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors"
              >
                <Megaphone size={20} className="mx-auto mb-2 text-yellow-400" />
                <span className="text-xs font-bold">Tulis Berita</span>
              </Link>
              <Link
                href="/admin/penduduk"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors"
              >
                <Users size={20} className="mx-auto mb-2 text-blue-400" />
                <span className="text-xs font-bold">Cek Warga</span>
              </Link>
              <Link
                href="/admin/apbdes"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl text-center transition-colors"
              >
                <Wallet size={20} className="mx-auto mb-2 text-purple-400" />
                <span className="text-xs font-bold">Input APBDes</span>
              </Link>
            </div>
          </div>

          {/* Mini Info */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Server Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Database</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Storage</span>
                <span className="text-xs font-bold text-gray-700">
                  45% Used
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Permohonan Surat Terbaru</h3>
          <Link
            href="/admin/surat"
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
              {recentRequests.map((item) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
