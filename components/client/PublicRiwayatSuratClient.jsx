"use client";

import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PublicRiwayatSuratClient({ data }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Clock size={14} /> Diproses
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={14} /> Selesai
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle size={14} /> Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Riwayat Permohonan
            </h1>
            <p className="text-gray-500 mt-1">
              Pantau status dan unduh surat yang telah terbit.
            </p>
          </div>
          <Link
            href="/layanan/surat"
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 flex items-center gap-2 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} /> Buat Surat Baru
          </Link>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 border-b">Tanggal</th>
                    <th className="px-6 py-4 border-b">Jenis Surat</th>
                    <th className="px-6 py-4 border-b">Nomor Surat</th>
                    <th className="px-6 py-4 border-b">Status</th>
                    <th className="px-6 py-4 border-b text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-medium">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {item.jenis}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                        {item.nomor}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* TOMBOL DOWNLOAD */}
                        {item.status === "APPROVED" && item.fileUrl ? (
                          <Link
                            href={`${window.location.origin}/download/${item.id}`}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <Download size={14} /> Download
                          </Link>
                        ) : item.status === "REJECTED" ? (
                          <div className="flex items-center justify-end gap-1 text-red-500 text-xs italic bg-red-50 px-2 py-1 rounded max-w-[150px] ml-auto">
                            <AlertCircle size={12} className="shrink-0" />
                            <span
                              className="truncate"
                              title={item.alasan || "Data tidak sesuai"}
                            >
                              {item.alasan || "Data tidak sesuai"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic bg-gray-100 px-2 py-1 rounded">
                            Menunggu Admin...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FileText size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Belum Ada Riwayat
              </h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
                Anda belum pernah mengajukan permohonan surat apapun melalui
                sistem ini.
              </p>
              <Link
                href="/layanan/surat"
                className="mt-6 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all hover:-translate-y-1"
              >
                Ajukan Surat Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 flex gap-3 text-xs text-gray-500 items-start bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-0.5">
            <AlertCircle size={14} />
          </div>
          <p className="leading-relaxed">
            Dokumen yang dapat diunduh adalah dokumen sah yang telah
            ditandatangani secara elektronik atau manual oleh Kepala Desa. Jika
            status ditolak, silakan periksa alasan penolakan dan ajukan
            permohonan ulang dengan data yang benar.
          </p>
        </div>
      </div>
    </main>
  );
}
