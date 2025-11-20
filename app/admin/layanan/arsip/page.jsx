"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- DUMMY DATA ARSIP (Data yang statusnya sudah 'approved' atau 'rejected') ---
const initialArchive = [
  {
    id: "SRT-2025-001",
    tanggal: "2025-11-01",
    pemohon: "Budi Santoso",
    nik: "3312010101900001",
    jenis: "Surat Keterangan Usaha",
    status: "approved",
    admin: "Admin Desa",
  },
  {
    id: "SRT-2025-002",
    tanggal: "2025-11-02",
    pemohon: "Siti Aminah",
    nik: "3312010505950002",
    jenis: "Surat Pengantar SKCK",
    status: "approved",
    admin: "Sekdes",
  },
  {
    id: "SRT-2025-003",
    tanggal: "2025-11-03",
    pemohon: "Joko Susilo",
    nik: "3312999999999999",
    jenis: "Surat Keterangan Domisili",
    status: "rejected",
    admin: "Admin Desa",
  },
  {
    id: "SRT-2025-004",
    tanggal: "2025-11-05",
    pemohon: "Dewi Sartika",
    nik: "3312011212000004",
    jenis: "Surat Keterangan Tidak Mampu",
    status: "approved",
    admin: "Kaur Umum",
  },
  {
    id: "SRT-2025-005",
    tanggal: "2025-11-10",
    pemohon: "Rudi Hartono",
    nik: "3312010101500005",
    jenis: "Surat Kematian",
    status: "approved",
    admin: "Sekdes",
  },
];

export default function ArsipSuratPage() {
  const [data, setData] = useState(initialArchive);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterBulan, setFilterBulan] = useState("2025-11"); // Default bulan ini

  // Filter Logic
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.pemohon.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search);
    const matchStatus =
      filterStatus === "Semua" ? true : item.status === filterStatus;
    // Filter Bulan (Format YYYY-MM)
    const matchBulan = item.tanggal.startsWith(filterBulan);

    return matchSearch && matchStatus && matchBulan;
  });

  // Helper Badge
  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
          <CheckCircle size={12} /> Selesai
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
        <XCircle size={12} /> Ditolak
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Arsip Layanan Surat
          </h1>
          <p className="text-gray-500 text-sm">
            Riwayat pembuatan surat yang telah selesai diproses.
          </p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={18} /> Export Laporan (Excel)
        </button>
      </div>

      {/* TOOLBAR (Filter & Search) */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari No. Surat atau Nama Pemohon..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Bulan */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2.5 rounded-lg text-gray-500">
            <Calendar size={20} />
          </div>
          <input
            type="month"
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer text-gray-600 font-medium"
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2.5 rounded-lg text-gray-500">
            <Filter size={20} />
          </div>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[150px] cursor-pointer text-gray-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="approved">Selesai (Approved)</option>
            <option value="rejected">Ditolak (Rejected)</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200">
                  Nomor Register
                </th>
                <th className="px-6 py-4 border-b border-gray-200">Tanggal</th>
                <th className="px-6 py-4 border-b border-gray-200">Pemohon</th>
                <th className="px-6 py-4 border-b border-gray-200">
                  Jenis Surat
                </th>
                <th className="px-6 py-4 border-b border-gray-200">
                  Diproses Oleh
                </th>
                <th className="px-6 py-4 border-b border-gray-200 text-center">
                  Status
                </th>
                <th className="px-6 py-4 border-b border-gray-200 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-3 font-mono text-gray-600 text-xs">
                    {item.id}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.tanggal}</td>
                  <td className="px-6 py-3">
                    <div className="font-bold text-gray-800">
                      {item.pemohon}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {item.nik}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-700 font-medium">
                    {item.jenis}
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">
                    {item.admin}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Lihat Detail Arsip"
                      onClick={() =>
                        alert(
                          "Fitur Detail Arsip: Menampilkan ulang data surat untuk dicetak kembali."
                        )
                      }
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
              <FileText size={48} className="opacity-20 mb-4" />
              <p>Tidak ada arsip surat pada periode ini.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm bg-white">
          <span className="text-gray-500">
            Total Arsip: <strong>{filteredData.length}</strong> Dokumen
          </span>
          <div className="flex gap-2">
            <button
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
