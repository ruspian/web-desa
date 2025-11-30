"use client";

import { useState } from "react";
import {
  Search,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  User,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

export default function PublicCekStatusPengaduanClient() {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const toast = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketId) return toast.error("Masukkan Nomor Tiket dulu!");

    setLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const res = await fetch("/api/cek-pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });

      if (res.status === 404) {
        setResult("not-found");
      } else if (!res.ok) {
        throw new Error("Gagal mengambil data");
      } else {
        const json = await res.json();
        setResult(json.data);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  // Helper Status UI
  const getStatusUI = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: <Clock size={20} />,
          text: "Menunggu Verifikasi",
        };
      case "process":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <Loader2 size={20} className="animate-spin" />,
          text: "Sedang Ditindaklanjuti",
        };
      case "done":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle size={20} />,
          text: "Selesai / Ditangani",
        };
      case "rejected":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <XCircle size={20} />,
          text: "Laporan Ditolak",
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: <AlertTriangle size={20} />,
          text: "Status Tidak Diketahui",
        };
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Lacak Laporan Anda
        </h1>
        <p className="text-gray-500">
          Masukkan Nomor Tiket yang Anda dapatkan saat mengirim pengaduan untuk
          melihat progres tindak lanjut.
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg mb-10 relative z-10">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Ticket
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Contoh: ADU-20251120-XXXX"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase tracking-wide"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search size={18} />
            )}{" "}
            Lacak
          </button>
        </form>
      </div>

      {/* HASIL PENCARIAN */}
      <div className="transition-all duration-500">
        {/* NOT FOUND */}
        {!loading && hasSearched && result === "not-found" && (
          <div className="text-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              Nomor Tiket tidak ditemukan. Mohon periksa kembali.
            </p>
          </div>
        )}

        {/* FOUND DATA */}
        {!loading && hasSearched && typeof result === "object" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fade-in-up">
            {/* Status Header */}
            <div
              className={`p-6 flex items-center gap-4 border-b ${
                getStatusUI(result.status).bg
              } ${getStatusUI(result.status).border}`}
            >
              <div
                className={`p-3 bg-white rounded-full shadow-sm ${
                  getStatusUI(result.status).color
                }`}
              >
                {getStatusUI(result.status).icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                  Status Laporan
                </p>
                <h2
                  className={`text-xl font-bold ${
                    getStatusUI(result.status).color
                  }`}
                >
                  {getStatusUI(result.status).text}
                </h2>
              </div>
            </div>

            {/* Detail Laporan */}
            <div className="p-8 space-y-8">
              {/* Info Dasar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Tiket ID
                  </label>
                  <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    {result.tiketId}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Tanggal Lapor
                  </label>
                  <span className="font-medium text-gray-800">
                    {result.tanggal}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Pelapor
                  </label>
                  <span className="font-medium text-gray-800 flex items-center gap-2">
                    <User size={14} /> {result.nama}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Kategori
                  </label>
                  <span className="font-medium text-emerald-600">
                    {result.kategori}
                  </span>
                </div>
              </div>

              {/* Isi & Lokasi */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" /> {result.lokasi}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  &quot;{result.isi}&quot;
                </p>

                {/* Bukti Foto */}
                {result.foto && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                      Bukti Foto:
                    </p>
                    <div className="relative h-48 w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={result.foto}
                        alt="Bukti"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tanggapan Admin */}
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-slate-200 rounded-full"></div>
                <div className="pl-6">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-blue-500" />{" "}
                    Tanggapan Petugas
                  </h4>
                  {result.tanggapan ? (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900 leading-relaxed text-sm">
                      {result.tanggapan}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      Belum ada tanggapan dari petugas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
