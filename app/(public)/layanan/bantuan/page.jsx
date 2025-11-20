"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Gift,
  ShieldCheck,
} from "lucide-react";

// --- DUMMY DATA PENERIMA (Simulasi Database) ---
// Nanti ini diganti fetch ke API Database
const mockRecipients = [
  {
    nik: "3312345678900001",
    nama: "Budi Santoso",
    dusun: "Krajan",
    jenis: "BLT Dana Desa",
    periode: "Oktober - Desember 2025",
    status: "AKTIF",
    amount: "Rp 300.000 / Bulan",
  },
  {
    nik: "3312345678900002",
    nama: "Siti Aminah",
    dusun: "Sukamaju",
    jenis: "PKH (Program Keluarga Harapan)",
    periode: "Tahap 4 2025",
    status: "AKTIF",
    amount: "Sesuai Komponen",
  },
];

export default function CekBansosPage() {
  const [inputNik, setInputNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null = belum cari, 'not-found' = ga ketemu, object = ketemu
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputNik) return;

    setLoading(true);
    setSearched(true);
    setResult(null);

    // Simulasi delay network 1.5 detik biar kerasa "mikir"
    setTimeout(() => {
      const found = mockRecipients.find((r) => r.nik === inputNik);
      if (found) {
        setResult(found);
      } else {
        setResult("not-found");
      }
      setLoading(false);
    }, 1500);
  };

  // Helper buat sensor NIK pas nampilin hasil (Privacy)
  const maskNik = (nik) => {
    return nik.slice(0, 4) + "********" + nik.slice(-4);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Gift size={16} />
            Penyaluran Bantuan
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cek Penerima Bantuan
          </h1>
          <p className="text-gray-500 text-lg">
            Transparansi data penerima manfaat bantuan sosial Desa Makmur Jaya.
            Masukkan NIK (KTP) Anda untuk memeriksa status.
          </p>
        </div>

        {/* === SEARCH BOX SECTION === */}
        <div className="max-w-xl mx-auto relative z-10">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputNik}
                    onChange={(e) =>
                      setInputNik(e.target.value.replace(/\D/g, ""))
                    } // Cuma boleh angka
                    maxLength={16}
                    placeholder="Masukkan 16 digit NIK..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-mono tracking-wide"
                  />
                  <ShieldCheck
                    className="absolute left-4 top-4.5 text-gray-400"
                    size={22}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  *Data Anda aman dan hanya digunakan untuk pengecekan status.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || inputNik.length < 16}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search size={20} /> Cek Sekarang
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* === RESULT AREA === */}
        <div className="max-w-xl mx-auto mt-8 transition-all duration-500">
          {/* 1. STATE: KETEMU (SUCCESS) */}
          {searched &&
            !loading &&
            typeof result === "object" &&
            result !== null && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-green-100 animate-fade-in-up">
                <div className="bg-green-600 p-6 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Terdaftar Sebagai Penerima
                  </h3>
                  <p className="opacity-90">
                    Data ditemukan dalam database desa.
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">NIK</span>
                    <span className="font-mono font-bold text-gray-800">
                      {maskNik(result.nik)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">Nama</span>
                    <span className="font-bold text-gray-800 uppercase">
                      {result.nama}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">Jenis Bantuan</span>
                    <span className="font-bold text-blue-600">
                      {result.jenis}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">Periode</span>
                    <span className="font-bold text-gray-800">
                      {result.periode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {result.status}
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 text-center">
                    Silakan hubungi Kepala Dusun <strong>{result.dusun}</strong>{" "}
                    untuk info pengambilan.
                  </div>
                </div>
              </div>
            )}

          {/* 2. STATE: TIDAK KETEMU (NOT FOUND) */}
          {searched && !loading && result === "not-found" && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-red-100 animate-fade-in-up">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-500 mb-6">
                NIK{" "}
                <span className="font-mono font-bold text-gray-800">
                  {inputNik}
                </span>{" "}
                tidak terdaftar sebagai penerima bantuan periode ini.
              </p>
              <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl text-left text-sm text-orange-700">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p>
                  Jika Anda merasa seharusnya menerima bantuan namun tidak
                  terdaftar, silakan lapor ke Kantor Desa dengan membawa KTP &
                  KK asli.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* === INFO JENIS BANTUAN === */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Jenis Bantuan Desa
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card BLT */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Gift size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">BLT Dana Desa</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bantuan tunai Rp 300.000/bulan untuk keluarga miskin ekstrem
                yang bersumber dari Dana Desa.
              </p>
            </div>

            {/* Card PKH */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 transition-colors">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">PKH (Kemensos)</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Program Keluarga Harapan untuk akses layanan kesehatan dan
                pendidikan bagi keluarga prasejahtera.
              </p>
            </div>

            {/* Card BPNT */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Info size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">BPNT / Sembako</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bantuan Pangan Non Tunai yang ditukarkan dengan beras/telur di
                E-Warong terdekat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
