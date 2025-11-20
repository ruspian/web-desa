"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Send,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";

// --- DUMMY DATA PENGADUAN ---
const initialComplaints = [
  {
    id: 1,
    ticket: "ADU-8492",
    nama: "Budi Santoso",
    nik: "3312xxxx",
    nohp: "08123456789",
    isAnonim: false,
    kategori: "Infrastruktur",
    lokasi: "Jalan Mawar, Dusun Krajan RT 02",
    isi: "Lampu penerangan jalan mati sudah 3 hari. Sangat gelap dan rawan kecelakaan.",
    foto: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&q=80", // Dummy street lamp
    status: "pending", // pending, process, done, rejected
    tanggal: "20 Nov 2025, 19:00",
    tanggapan: "",
  },
  {
    id: 2,
    ticket: "ADU-1120",
    nama: "Anonim",
    nik: "",
    nohp: "0812xxxx",
    isAnonim: true,
    kategori: "Pelayanan",
    lokasi: "Kantor Desa",
    isi: "Pelayanan administrasi tadi pagi sangat lambat, petugas datang terlambat jam 09.00 baru buka.",
    foto: null,
    status: "process",
    tanggal: "19 Nov 2025, 10:00",
    tanggapan:
      "Mohon maaf atas ketidaknyamanannya. Kami akan segera menegur petugas terkait.",
  },
  {
    id: 3,
    ticket: "ADU-3341",
    nama: "Siti Aminah",
    nik: "3312xxxx",
    nohp: "0856xxxx",
    isAnonim: false,
    kategori: "Bansos",
    lokasi: "Dusun Sukamaju",
    isi: "Tetangga saya orang kaya tapi dapat beras bansos. Mohon dicek ulang datanya.",
    foto: null,
    status: "done",
    tanggal: "15 Nov 2025, 08:00",
    tanggapan:
      "Terima kasih laporannya. Tim kami sudah melakukan survei ulang ke lokasi.",
  },
];

export default function AdminPengaduanPage() {
  const [data, setData] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);

  // State Form Tanggapan
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Filter Logic
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.ticket.toLowerCase().includes(search.toLowerCase()) ||
      item.isi.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "Semua" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Statistik
  const stats = {
    pending: data.filter((i) => i.status === "pending").length,
    process: data.filter((i) => i.status === "process").length,
    done: data.filter((i) => i.status === "done").length,
  };

  // Actions
  const openModal = (item) => {
    setSelectedItem(item);
    setResponseText(item.tanggapan || "");
    setNewStatus(item.status);
  };

  const handleSaveResponse = () => {
    if (!newStatus) return alert("Pilih status terbaru!");

    const updatedData = data.map((d) =>
      d.id === selectedItem.id
        ? { ...d, status: newStatus, tanggapan: responseText }
        : d
    );
    setData(updatedData);
    setSelectedItem(null); // Close Modal
    alert("Tanggapan berhasil dikirim!");
  };

  // Helper Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="badge badge-red">
            <AlertTriangle size={12} /> Menunggu
          </span>
        );
      case "process":
        return (
          <span className="badge badge-blue">
            <Clock size={12} /> Diproses
          </span>
        );
      case "done":
        return (
          <span className="badge badge-green">
            <CheckCircle size={12} /> Selesai
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-gray">
            <XCircle size={12} /> Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Aspirasi & Pengaduan
        </h1>
        <p className="text-gray-500 text-sm">
          Kelola laporan warga dan berikan tanggapan resmi.
        </p>
      </div>

      {/* STATS CARDS */}
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

      {/* FILTER & SEARCH */}
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
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[150px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="process">Diproses</option>
            <option value="done">Selesai</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Tiket & Tanggal</th>
                <th className="px-6 py-4">Pelapor</th>
                <th className="px-6 py-4">Kategori & Lokasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
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
                    <div className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {item.lokasi}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openModal(item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-medium text-xs transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      <MessageSquare size={14} /> Tindak Lanjut
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Tidak ada laporan ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* === MODAL DETAIL & RESPON === */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
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
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body (Split View) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                {/* KIRI: DETAIL LAPORAN */}
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
                      {!selectedItem.isAnonim && (
                        <p className="text-xs text-gray-500">
                          {selectedItem.nohp}
                        </p>
                      )}
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

                  {/* Foto Bukti */}
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
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          Tidak ada foto dilampirkan
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* KANAN: TINDAKAN ADMIN */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-600" />{" "}
                    Tindak Lanjut
                  </h4>

                  <div>
                    <label className="label-input">Update Status</label>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "process", "done", "rejected"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setNewStatus(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize
                                            ${
                                              newStatus === s
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                            }
                                        `}
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
                    <label className="label-input">Tanggapan Admin</label>
                    <textarea
                      rows={6}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                      placeholder="Tulis tanggapan resmi untuk pelapor..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-2">
                      Tanggapan ini akan bisa dibaca oleh pelapor saat mengecek
                      status tiket.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveResponse}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors"
                  >
                    <Send size={18} /> Kirim Tanggapan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .badge {
          @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border;
        }
        .badge-red {
          @apply bg-red-50 text-red-700 border-red-200;
        }
        .badge-blue {
          @apply bg-blue-50 text-blue-700 border-blue-200;
        }
        .badge-green {
          @apply bg-emerald-50 text-emerald-700 border-emerald-200;
        }
        .badge-gray {
          @apply bg-gray-100 text-gray-600 border-gray-200;
        }
        .label-input {
          @apply block text-xs font-bold text-gray-500 uppercase mb-2;
        }
      `}</style>
    </div>
  );
}
