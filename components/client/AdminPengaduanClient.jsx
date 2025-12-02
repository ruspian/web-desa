"use client";

import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Send,
  MapPin,
  User,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import ConfirmModal from "../ui/confirmModal";
import Pagination from "../ui/pagination";

export default function AdminPengaduanClient({
  initialData,
  pagination,
  stats,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // State Filter & Search
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const currentStatus = searchParams.get("status") || "all";

  // State Modal Detail & Process
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // State Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const openModal = (item) => {
    setSelectedItem(item);
    setResponseText(item.tanggapan || "");
    setNewStatus(item.status);
  };

  const handleSaveResponse = async () => {
    if (!newStatus) return toast.error("Pilih status terbaru!");

    setIsProcessing(true);
    try {
      const res = await fetch("/api/pengaduan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.id,
          status: newStatus,
          tanggapan: responseText,
        }),
      });

      if (!res.ok) throw new Error("Gagal update pengaduan");

      toast.success("Tanggapan & Status berhasil diperbarui!");
      router.refresh();
      setSelectedItem(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pengaduan?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Pengaduan dihapus");
      router.refresh();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
            <AlertTriangle size={12} /> Menunggu
          </span>
        );
      case "process":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-200">
            <Clock size={12} /> Diproses
          </span>
        );
      case "done":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 border border-green-200">
            <CheckCircle size={12} /> Selesai
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
      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-red-200 text-red-700 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 uppercase">
              Laporan Baru
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.pending}{" "}
              <span className="text-xs font-normal text-gray-500">
                Belum dibaca
              </span>
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase">
              Sedang Diproses
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.process}{" "}
              <span className="text-xs font-normal text-gray-500">
                Tindak lanjut
              </span>
            </p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-green-200 text-green-700 rounded-lg flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-green-600 uppercase">
              Selesai
            </p>
            <p className="text-xl font-bold text-gray-800">
              {stats.done}{" "}
              <span className="text-xs font-normal text-gray-500">
                Kasus ditutup
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari No. Tiket atau isi laporan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[150px] cursor-pointer text-gray-600"
            value={currentStatus}
            onChange={(e) => handleFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="process">Diproses</option>
            <option value="done">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-350px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Tiket & Tanggal</th>
                <th className="px-6 py-4">Pelapor</th>
                <th className="px-6 py-4">Kategori & Lokasi</th>
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
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                      {item.ticket}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.tanggal}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.isAnonim ? (
                        <User size={16} className="text-gray-400" />
                      ) : (
                        <User size={16} className="text-blue-500" />
                      )}
                      <span
                        className={`font-bold ${
                          item.isAnonim
                            ? "text-gray-500 italic"
                            : "text-gray-800"
                        }`}
                      >
                        {item.nama}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-emerald-600 uppercase">
                      {item.kategori}
                    </span>
                    <div className="text-gray-600 text-xs flex items-center gap-1 mt-0.5 truncate w-40">
                      <MapPin size={12} /> {item.lokasi}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                        title="Tindak Lanjut"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {initialData.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Tidak ada laporan ditemukan.
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100">
            <Pagination
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Pengaduan?"
        message="Data laporan ini akan dihapus permanen."
      />

      {/* === MODAL DETAIL & RESPON === */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Detail Pengaduan #{selectedItem.ticket}
                </h3>
                <p className="text-xs text-slate-500">{selectedItem.tanggal}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                {/* KIRI: DETAIL */}
                <div className="space-y-6 border-r border-gray-100 pr-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Isi Laporan
                    </h4>
                    <p className="text-gray-800 leading-relaxed">
                      &quot;{selectedItem.isi}&quot;
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Pelapor
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedItem.nama}{" "}
                        {selectedItem.isAnonim && "(Dirahasiakan)"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Lokasi
                      </label>
                      <p className="font-medium text-gray-900">
                        {selectedItem.lokasi}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Bukti Foto
                    </label>
                    <div className="relative h-48 w-full bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
                      {selectedItem.foto ? (
                        <Image
                          src={selectedItem.foto}
                          alt="Bukti"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          Tidak ada foto dilampirkan
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* KANAN: RESPON */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-600" />{" "}
                    Tindak Lanjut
                  </h4>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Update Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "process", "done", "rejected"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setNewStatus(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize ${
                            newStatus === s
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {s === "pending"
                            ? "Menunggu"
                            : s === "process"
                            ? "Diproses"
                            : s === "done"
                            ? "Selesai"
                            : "Tolak"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Tanggapan Admin
                    </label>
                    <textarea
                      rows={6}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                      placeholder="Tulis tanggapan resmi untuk pelapor..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    ></textarea>
                    <p className="text-[10px] text-gray-400 mt-2">
                      Tanggapan ini akan bisa dibaca oleh pelapor di halaman
                      publik.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveResponse}
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}{" "}
                    Kirim Tanggapan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
