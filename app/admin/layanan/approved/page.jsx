"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Printer,
  Search,
  Filter,
  Download,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

// --- DUMMY DATA REQUEST SURAT ---
const initialRequests = [
  {
    id: "REQ-2025-001",
    nik: "3312010101900001",
    nama: "Budi Santoso",
    jenisSurat: "Surat Keterangan Usaha (SKU)",
    tanggal: "20 Nov 2025, 09:00",
    status: "pending", // pending, approved, rejected
    keperluan: "Persyaratan pengajuan KUR BRI",
    whatsapp: "081234567890",
    lampiran: {
      ktp: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80", // Dummy Image
      kk: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
    },
  },
  {
    id: "REQ-2025-002",
    nik: "3312010505950002",
    nama: "Siti Aminah",
    jenisSurat: "Surat Pengantar SKCK",
    tanggal: "19 Nov 2025, 14:30",
    status: "approved",
    keperluan: "Melamar Pekerjaan di Pabrik Garmen",
    whatsapp: "081298765432",
    lampiran: { ktp: null, kk: null },
  },
  {
    id: "REQ-2025-003",
    nik: "3312999999999999",
    nama: "Joko Susilo",
    jenisSurat: "Surat Keterangan Domisili",
    tanggal: "18 Nov 2025, 10:15",
    status: "rejected",
    keperluan: "Pindah Kontrakan",
    alasanTolak: "Foto KTP buram tidak terbaca.",
    whatsapp: "085678912345",
    lampiran: { ktp: null, kk: null },
  },
];

export default function VerifikasiSuratPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Statistik
  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    total: requests.length,
  };

  // Filter Logic
  const filteredData = requests.filter((item) => {
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.jenisSurat.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // --- ACTIONS ---
  const handleProcess = (id, newStatus, reason = "") => {
    const updatedData = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus, alasanTolak: reason } : req
    );
    setRequests(updatedData);
    setSelectedRequest(null); // Tutup modal

    // Simulasi Kirim WA Notifikasi
    alert(
      `Surat berhasil diubah statusnya menjadi: ${
        newStatus === "approved" ? "Disetujui" : "Ditolak"
      }`
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className=" gap-1 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20">
            <Clock size={12} /> Menunggu Verifikasi
          </span>
        );
      case "approved":
        return (
          <span className="gap-1 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">
            <CheckCircle size={12} /> Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="gap-1 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">
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
            <p className="text-sm text-gray-500 font-medium">
              Selesai Bulan Ini
            </p>
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

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                filterStatus === status
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
            placeholder="Cari nama pemohon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Tanggal & ID</th>
                <th className="px-6 py-4">Pemohon</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-slate-500">
                      {item.id}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
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
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Tidak ada data permohonan.
            </div>
          )}
        </div>
      </div>

      {/* === MODAL DETAIL & VERIFIKASI === */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Verifikasi Permohonan
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedRequest.id} • {selectedRequest.tanggal}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body (Split View) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                {/* KIRI: DATA TEXT */}
                <div className="space-y-6">
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
                  <div>
                    <label className="label-detail">Kontak WhatsApp</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-green-600">
                        {selectedRequest.whatsapp}
                      </span>
                      <a
                        href={`https://wa.me/${selectedRequest.whatsapp}`}
                        target="_blank"
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Chat WA
                      </a>
                    </div>
                  </div>

                  {selectedRequest.status === "rejected" && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-4">
                      <h4 className="text-xs font-bold text-red-600 uppercase mb-1">
                        Alasan Penolakan
                      </h4>
                      <p className="text-red-800 text-sm">
                        {selectedRequest.alasanTolak}
                      </p>
                    </div>
                  )}
                </div>

                {/* KANAN: LAMPIRAN (KTP/KK) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Lampiran Dokumen
                  </h4>

                  {/* Card KTP */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden group">
                    <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 flex justify-between">
                      <span>Foto KTP</span>
                      <span className="text-blue-500 cursor-pointer hover:underline">
                        Lihat Full
                      </span>
                    </div>
                    <div className="h-40 w-full relative bg-gray-200">
                      {selectedRequest.lampiran.ktp ? (
                        <Image
                          src={selectedRequest.lampiran.ktp}
                          alt="KTP"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          Tidak ada lampiran
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card KK */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden group">
                    <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 flex justify-between">
                      <span>Foto KK</span>
                      <span className="text-blue-500 cursor-pointer hover:underline">
                        Lihat Full
                      </span>
                    </div>
                    <div className="h-40 w-full relative bg-gray-200">
                      {selectedRequest.lampiran.kk ? (
                        <Image
                          src={selectedRequest.lampiran.kk}
                          alt="KK"
                          fill
                          className="object-cover"
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

            {/* Modal Footer (ACTIONS) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              {selectedRequest.status === "pending" ? (
                <>
                  <button
                    onClick={() =>
                      handleProcess(
                        selectedRequest.id,
                        "rejected",
                        "Data tidak sesuai"
                      )
                    }
                    className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={18} /> Tolak
                  </button>
                  <button
                    onClick={() =>
                      handleProcess(selectedRequest.id, "approved")
                    }
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle size={18} /> Setujui & Proses Surat
                  </button>
                </>
              ) : selectedRequest.status === "approved" ? (
                <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2">
                  <Printer size={18} /> Cetak Surat
                </button>
              ) : (
                <span className="text-red-500 font-bold text-sm py-2 px-4 bg-red-50 rounded-lg">
                  Permohonan Ditolak
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .badge {
          @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border;
        }
        .badge-yellow {
          @apply bg-yellow-50 text-yellow-700 border-yellow-200;
        }
        .badge-green {
          @apply bg-emerald-50 text-emerald-700 border-emerald-200;
        }
        .badge-red {
          @apply bg-red-50 text-red-700 border-red-200;
        }

        .label-detail {
          @apply block text-xs font-bold text-gray-400 uppercase mb-1;
        }
        .value-detail {
          @apply text-gray-800 font-medium text-sm;
        }
      `}</style>
    </div>
  );
}
