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
  Loader2,
  MapPin,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/formatRupiah";
import { useDesa } from "@/context/DesaContext";

export default function PublicCekBansosClient() {
  const [inputNik, setInputNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  const toast = useToast();
  const { data: dataDesa } = useDesa();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (inputNik.length !== 16) {
      toast.warning("NIK harus 16 digit angka!", "Validasi");
      return;
    }

    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const response = await fetch("/api/cek-bansos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nik: inputNik }),
      });

      // Jika 404, berarti data tidak ada
      if (response.status === 404) {
        setResult(null); // Kosongkan result
        return;
      }

      // Jika Error lain (500, dll)
      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      // Jika Sukses (200)
      const data = await response.json();
      setResult(data.data); // Simpan data
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghubungi server.", "Error");
      setSearched(false); // Reset search state jika error sistem
    } finally {
      setLoading(false);
    }
  };

  // Sensor NIK
  const maskNik = (nik) => {
    if (!nik) return "-";
    return nik.slice(0, 6) + "**********";
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
            Transparansi data penerima manfaat bantuan sosial Desa{" "}
            {dataDesa.nama}. Masukkan NIK Anda untuk memeriksa status.
          </p>
        </div>

        {/* PENCARIAN */}
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
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Search size={20} /> Cek Sekarang
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RESULT AREA  */}
        <div className="max-w-xl mx-auto mt-8 mb-8 transition-all duration-500">
          {/*  KETEMU (SUCCESS) */}
          {searched && !loading && result && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-green-100 animate-fade-in-up">
              {/* Header Card */}
              <div className="bg-emerald-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/30 shadow-lg">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold relative z-10">
                  Terdaftar Sebagai Penerima
                </h3>
                <p className="opacity-90 text-sm relative z-10">
                  Data ditemukan dalam database periode aktif.
                </p>
              </div>

              {/* Body Card */}
              <div className="p-6 space-y-4">
                {/* Detail Item */}
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-sm">NIK</span>
                  <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded text-sm">
                    {maskNik(result.nik)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-sm">Nama Penerima</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {result.nama}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-sm">Alamat</span>
                  <span className="font-medium text-gray-700 text-right text-sm flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />{" "}
                    {result.alamat}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-sm">Jenis Bantuan</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                    {result.jenis}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                    {result.status}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500 text-sm">Periode</span>
                  <span className="font-medium text-gray-800">
                    {result.periode}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-500 text-sm">
                    Nominal / Manfaat
                  </span>
                  <span className="font-bold text-emerald-600 text-xl">
                    {result.nominal > 0
                      ? formatRupiah(result.nominal)
                      : "Barang / Sembako"}
                  </span>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 items-start">
                  <AlertTriangle
                    className="text-orange-500 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div className="text-xs text-orange-800 leading-relaxed">
                    <p className="font-bold mb-1">Informasi Pengambilan:</p>
                    Silakan hubungi Kepala Dusun atau datang ke Balai Desa
                    sesuai jadwal dengan membawa <b>KTP Asli</b> dan{" "}
                    <b>KK Asli</b>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TIDAK KETEMU */}
          {searched && !loading && !result && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-red-100 animate-fade-in-up">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <XCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                NIK{" "}
                <span className="font-mono font-bold text-gray-800 bg-gray-100 px-1 rounded">
                  {inputNik}
                </span>{" "}
                tidak terdaftar sebagai penerima bantuan aktif pada periode ini.
              </p>

              <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-200">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                  <Info size={14} /> Kemungkinan Penyebab:
                </h4>
                <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                  <li>Salah memasukkan NIK (Cek kembali KTP Anda).</li>
                  <li>Bantuan sudah tidak aktif / dialihkan.</li>
                  <li>Data belum diperbarui oleh operator desa.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* INFO JENIS BANTUAN  */}
        <div className="max-w-4xl mx-auto mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Jenis Bantuan Desa
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card BLT */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Gift size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-emerald-700">
                BLT Dana Desa
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bantuan tunai untuk keluarga kurang mampu yang bersumber dari
                Dana Desa.
              </p>
            </div>

            {/* Card PKH */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckCircle size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-700">
                PKH (Kemensos)
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Program Keluarga Harapan untuk akses layanan kesehatan dan
                pendidikan.
              </p>
            </div>

            {/* Card BPNT */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Info size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-orange-700">
                BPNT / Sembako
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bantuan Pangan Non Tunai yang ditukarkan dengan beras/telur di
                E-Warong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
