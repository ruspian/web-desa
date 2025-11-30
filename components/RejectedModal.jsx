import { AlertTriangle, Loader2 } from "lucide-react";
import React from "react";

const RejectedModal = ({
  closeModal,
  isProcessing,
  handleRejectSubmit,
  setRejectedReason,
  rejectedReason,
}) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <AlertTriangle size={24} />
          <h3 className="text-lg font-bold">Tolak Permohonan</h3>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Silakan masukkan alasan mengapa permohonan ini ditolak. Alasan akan
          dikirimkan ke pemohon.
        </p>
        <form onSubmit={handleRejectSubmit}>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none mb-4"
            rows={4}
            placeholder="Contoh: Foto KTP tidak terbaca, Data NIK salah..."
            value={rejectedReason}
            onChange={(e) => setRejectedReason(e.target.value)}
            required
          ></textarea>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Kirim Penolakan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectedModal;
