"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  X,
  User,
  MapPin,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import * as XLSX from "xlsx";
import { useToast } from "@/components/ui/Toast";

export default function AdminArsipSuratClient({ initialData, pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isExporting, setIsExporting] = useState(false);

  const [selectedSurat, setSelectedSurat] = useState(null);

  const filterStatus = searchParams.get("status") || "all";
  const filterTanggal = searchParams.get("tanggal") || "";

  // muat ulang saat pencarian berubah
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("query") || "")) {
      if (debouncedSearch) params.set("query", debouncedSearch);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // EXPORT EXCEL
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const queryParams = new URLSearchParams(searchParams).toString();
      const res = await fetch(`/api/export/arsip?${queryParams}`);

      if (!res.ok) throw new Error("Gagal mengambil data export");

      const { data } = await res.json();

      if (data.length === 0) {
        toast.warning("Tidak ada data untuk diexport.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Arsip Surat");

      XLSX.writeFile(workbook, `Arsip_Surat_${filterTanggal || "Semua"}.xlsx`);
      toast.success("Laporan berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal export excel");
    } finally {
      setIsExporting(false);
    }
  };

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
            Total Arsip:{" "}
            <span className="font-bold">{pagination.totalItems}</span> Dokumen
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors shadow-sm disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          Export Laporan
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari No. Surat atau Nama..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2.5 rounded-lg text-gray-500">
            <Calendar size={20} />
          </div>
          <input
            type="date"
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer text-gray-600 font-medium"
            value={filterTanggal}
            onChange={(e) => handleFilterChange("tanggal", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2.5 rounded-lg text-gray-500">
            <Filter size={20} />
          </div>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[150px] cursor-pointer text-gray-600"
            value={filterStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">Semua Status</option>
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
                <th className="px-6 py-4 border-b">Nomor Register</th>
                <th className="px-6 py-4 border-b">Tanggal</th>
                <th className="px-6 py-4 border-b">Pemohon</th>
                <th className="px-6 py-4 border-b">Jenis Surat</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-3 font-mono text-gray-600 text-xs">
                    {item.nomorSurat !== "-" ? (
                      item.nomorSurat
                    ) : (
                      <span className="italic text-gray-400">Belum ada no</span>
                    )}
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
                  <td className="px-6 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-3 text-center">
                    {/* TOMBOL AKSI YANG SEKARANG AKTIF */}
                    <button
                      onClick={() => setSelectedSurat(item)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {initialData.length === 0 && (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
              <FileText size={48} className="opacity-20 mb-4" />
              <p>Tidak ada arsip surat pada tanggal ini.</p>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm bg-white">
            <span className="text-gray-500">
              Halaman <b>{pagination.currentPage}</b> dari{" "}
              {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL SURAT*/}
      {selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Detail Arsip Surat
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  ID: {selectedSurat.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedSurat(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border ${
                  selectedSurat.status === "approved"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } flex items-start gap-3`}
              >
                {selectedSurat.status === "approved" ? (
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                ) : (
                  <XCircle className="text-red-600 mt-0.5" size={20} />
                )}
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      selectedSurat.status === "approved"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {selectedSurat.status === "approved"
                      ? "Surat Selesai & Disetujui"
                      : "Permohonan Ditolak"}
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      selectedSurat.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedSurat.status === "approved"
                      ? `Diproses pada tanggal ${selectedSurat.tanggal}`
                      : `Alasan: ${
                          selectedSurat.alasanTolak ||
                          "Tidak ada alasan spesifik."
                        }`}
                  </p>
                </div>
              </div>

              {/* Informasi Surat */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> Data Surat
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Nomor Surat</p>
                    <p className="text-sm font-mono font-bold text-gray-800">
                      {selectedSurat.nomorSurat}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jenis Surat</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedSurat.jenis}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Keperluan</p>
                    <p className="text-sm font-medium text-gray-800 italic">
                      &quot;{selectedSurat.keperluan}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Informasi Pemohon */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                  <User size={14} /> Data Pemohon
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Nama Lengkap</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedSurat.pemohon}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NIK</p>
                    <p className="text-sm font-mono font-bold text-gray-800">
                      {selectedSurat.nik}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Kontak</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedSurat.whatsapp}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedSurat(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
