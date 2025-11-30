"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Loader2,
  ArrowRightCircle,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";
import Pagination from "../ui/pagination";
import RejectedModal from "../RejectedModal";

export default function AdminVarivikasiSuratClient({
  initialData,
  stats,
  pagination,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const currentStatus = searchParams.get("status") || "all";
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileBalasan, setFileBalasan] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("query") || "")) {
      if (debouncedSearch) params.set("query", debouncedSearch);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterStatus = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status !== "all") params.set("status", status);
    else params.delete("status");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // HANDLE PROSES
  const handleProcessRequest = (request) => {
    setSelectedRequest(null);
    // Arahkan ke halaman Buat Surat dengan membawa ID Request
    router.push(`/admin/layanan/buat-surat?requestId=${request.id}`);
  };

  // HANDLE REJECT
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectedReason) return toast.error("Alasan penolakan wajib diisi!");

    setIsProcessing(true);
    try {
      const res = await fetch("/api/surat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRequest.id, // Ambil ID dari state selectedRequest
          status: "REJECTED",
          alasan: rejectedReason,
        }),
      });

      if (!res.ok) throw new Error("Gagal menolak surat");

      toast.success("Permohonan berhasil ditolak.");
      router.refresh();

      // Tutup semua modal
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectedReason("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setFileBalasan(null);
  };

  const openRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
            <Clock size={12} /> Menunggu
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 border border-green-200">
            <CheckCircle size={12} /> Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 border border-red-200">
            <XCircle size={12} /> Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Perlu Tindakan</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.pending}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Disetujui</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.approved}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Permohonan
            </p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap ${
                currentStatus === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status === "all" ? "Semua" : status}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau jenis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-350px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Tanggal & ID</th>
                <th className="px-6 py-4">Pemohon</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 font-mono mb-1">
                      {item.id.slice(-8)}...
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {item.tanggal}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{item.nama}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {item.nik}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {item.jenisSurat}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedRequest(item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-medium text-xs transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      <Eye size={14} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Pagination
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/*MODAL DETAIL & VERIFIKASI*/}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Detail Permohonan
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {selectedRequest.id}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                {/*  DATA TEXT */}
                <div className="space-y-6">
                  {/* Info Jenis Surat, Nama, NIK  */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">
                      Jenis Permohonan
                    </h4>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedRequest.jenisSurat}
                    </p>
                  </div>
                  <div>
                    <label className="label-detail">Nama Pemohon</label>
                    <p className="value-detail">{selectedRequest.nama}</p>
                  </div>
                  <div>
                    <label className="label-detail">NIK</label>
                    <p className="value-detail font-mono">
                      {selectedRequest.nik}
                    </p>
                  </div>
                  <div>
                    <label className="label-detail">Keperluan</label>
                    <p className="value-detail italic">
                      &quot;{selectedRequest.keperluan}&quot;
                    </p>
                  </div>

                  {/* Tampilkan Data Dinamis  */}
                  {selectedRequest.extraData &&
                    Object.keys(selectedRequest.extraData).length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                          Data Tambahan
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {Object.entries(selectedRequest.extraData).map(
                            ([key, value]) =>
                              !key.startsWith("_") && (
                                <li key={key} className="grid grid-cols-3">
                                  <span className="text-gray-500 capitalize col-span-1">
                                    {key.replace(/_/g, " ")}:
                                  </span>
                                  <span className="font-medium text-gray-800 col-span-2">
                                    {value}
                                  </span>
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    )}
                </div>

                {/* LAMPIRAN */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Lampiran Dokumen
                  </h4>
                  {/* KTP & KK  */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden group">
                    <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 flex justify-between">
                      <span>Foto KTP</span>
                      <a
                        href={selectedRequest.lampiran.ktp}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        Buka
                      </a>
                    </div>
                    <div className="h-40 w-full relative bg-gray-200">
                      {selectedRequest.lampiran.ktp ? (
                        <Image
                          src={selectedRequest.lampiran.ktp}
                          alt="KTP"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          Tidak ada lampiran
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden group">
                    <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 flex justify-between">
                      <span>Foto KK</span>
                      <a
                        href={selectedRequest.lampiran.kk}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        Buka
                      </a>
                    </div>
                    <div className="h-40 w-full relative bg-gray-200">
                      {selectedRequest.lampiran.kk ? (
                        <Image
                          src={selectedRequest.lampiran.kk}
                          alt="KK"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          Tidak ada lampiran
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS  */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl shrink-0">
              {selectedRequest.status === "pending" ? (
                <>
                  <button
                    onClick={openRejectModal}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}{" "}
                    Tolak
                  </button>

                  {/*  PROSES & BUAT */}
                  <button
                    onClick={() => handleProcessRequest(selectedRequest)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-colors"
                  >
                    <ArrowRightCircle size={18} /> Proses & Buat Surat
                  </button>
                </>
              ) : (
                <div className="text-sm font-medium text-gray-500 italic">
                  Surat ini sudah diproses.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isRejectModalOpen && (
        <RejectedModal
          handleRejectSubmit={handleRejectSubmit}
          closeModal={() => setIsRejectModalOpen(false)}
          rejectedReason={rejectedReason}
          setRejectedReason={setRejectedReason}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
