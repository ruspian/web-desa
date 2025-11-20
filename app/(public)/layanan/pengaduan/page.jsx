"use client";

import { useState, FormEvent } from "react";
import {
  Megaphone,
  Shield,
  Eye,
  EyeOff,
  MapPin,
  Camera,
  Send,
  AlertTriangle,
  CheckCircle,
  FileWarning,
} from "lucide-react";
import Link from "next/link";

export default function PengaduanPage() {
  const [isAnonim, setIsAnonim] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    nohp: "",
    kategori: "Infrastruktur",
    lokasi: "",
    isi: "",
    foto: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi API Request
    setTimeout(() => {
      setIsLoading(false);
      // Generate Random Ticket ID
      const ticketId = `ADU-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessTicket(ticketId);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
            <Megaphone size={16} />
            Suara Warga
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Layanan Pengaduan & Aspirasi
          </h1>
          <p className="text-gray-500 text-lg">
            Sampaikan kritik, saran, atau laporan masalah di lingkungan desa.
            Identitas pelapor dijamin kerahasiaannya jika memilih mode Anonim.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* SIDEBAR INFO */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* Card Privasi */}
            <div className="bg-linear-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <Shield className="absolute top-4 right-4 text-white/10 w-24 h-24" />
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Shield size={20} className="text-green-400" /> Jaminan Privasi
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Pemerintah Desa berkomitmen melindungi identitas pelapor.
                Laporan Anda akan ditangani langsung oleh tim khusus dan tidak
                dipublikasikan secara terbuka tanpa izin.
              </p>
            </div>

            {/* Card Kategori */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Kategori Laporan</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <AlertTriangle size={16} />
                  </div>
                  <span>Infrastruktur (Jalan Rusak, Lampu Mati)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileWarning size={16} />
                  </div>
                  <span>Administrasi & Pelayanan Publik</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                  <span>Keamanan & Ketertiban</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              {/* Toggle Anonim */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-8 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isAnonim
                        ? "bg-slate-800 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isAnonim ? <EyeOff size={24} /> : <Eye size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mode Anonim</h4>
                    <p className="text-xs text-gray-500">
                      Sembunyikan identitas saya di laporan ini
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAnonim(!isAnonim)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAnonim ? "bg-slate-800" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isAnonim ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identitas (Hidden if Anonim) */}
                <div
                  className={`grid md:grid-cols-2 gap-6 transition-all duration-300 ${
                    isAnonim
                      ? "opacity-50 pointer-events-none grayscale"
                      : "opacity-100"
                  }`}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      disabled={isAnonim}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none bg-white disabled:bg-gray-100"
                      placeholder={
                        isAnonim ? "Dirahasiakan" : "Nama Sesuai KTP"
                      }
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK (Opsional)
                    </label>
                    <input
                      type="text"
                      name="nik"
                      disabled={isAnonim}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none bg-white disabled:bg-gray-100"
                      placeholder={isAnonim ? "Dirahasiakan" : "16 Digit NIK"}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Kontak (Tetap butuh meski anonim buat tracking, opsional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor WhatsApp{" "}
                    <span className="text-gray-400 font-normal">
                      (Untuk update status laporan)
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="nohp"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="0812xxxx"
                    onChange={handleChange}
                  />
                </div>

                <div className="h-px bg-gray-100 my-4"></div>

                {/* Detail Masalah */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Laporan
                    </label>
                    <select
                      name="kategori"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                      onChange={handleChange}
                    >
                      <option value="Infrastruktur">
                        Infrastruktur (Jalan/Jembatan)
                      </option>
                      <option value="Pelayanan">Pelayanan Administrasi</option>
                      <option value="Keamanan">Keamanan & Ketertiban</option>
                      <option value="Bansos">Bantuan Sosial</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Kejadian
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lokasi"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="Nama Jalan / Dusun / RT"
                        onChange={handleChange}
                      />
                      <MapPin
                        className="absolute left-3 top-3.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Isi Laporan
                  </label>
                  <textarea
                    name="isi"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    placeholder="Ceritakan kronologi atau detail masalah dengan jelas..."
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Upload Foto Bukti */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bukti Foto (Opsional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      <Camera size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {formData.foto
                          ? formData.foto.name
                          : "Ketuk untuk upload foto"}
                      </p>
                      <p className="text-xs text-gray-400">Maksimal 5MB</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send size={18} /> Kirim Laporan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL SUKSES (TIKET) === */}
      {successTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            {/* Decorative Top */}
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Laporan Diterima!
            </h3>
            <p className="text-gray-500 mb-6">
              Terima kasih telah peduli dengan lingkungan desa. Laporan Anda
              akan segera kami verifikasi.
            </p>

            {/* Ticket Box */}
            <div className="bg-gray-100 p-4 rounded-xl mb-8 border border-dashed border-gray-300">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                Nomor Tiket Pengaduan
              </p>
              <p className="text-3xl font-mono font-bold text-gray-800 tracking-wider selection:bg-green-200">
                {successTicket}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Simpan nomor ini untuk mengecek status laporan.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successTicket);
                  alert("Nomor Tiket Disalin!");
                }}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800"
              >
                Salin Nomor Tiket
              </button>
              <Link
                href="/"
                className="w-full py-3 text-gray-500 font-medium hover:text-gray-900"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
