"use client";

import { AlertTriangle, X } from "lucide-react";

/**
 * Komponen Modal Konfirmasi Hapus/Aksi Berbahaya
 * @param {boolean} isOpen - State untuk menampilkan modal
 * @param {function} onClose - Fungsi untuk menutup modal
 * @param {function} onConfirm - Fungsi yang dijalankan saat tombol "Ya, Hapus" diklik
 * @param {string} title - Judul modal (Opsional)
 * @param {string} message - Pesan peringatan (Opsional)
 * @param {boolean} isLoading - State loading saat proses hapus berjalan
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100 transition-all">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>

        {/* Tombol Close Pojok Kanan (Opsional) */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
