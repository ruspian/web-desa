"use client";

import { useState, FormEvent } from "react";
import {
  FileText,
  User,
  Phone,
  Upload,
  Send,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

// Daftar Jenis Surat yang tersedia
const letterTypes = [
  { id: "sktm", label: "Surat Keterangan Tidak Mampu (SKTM)" },
  { id: "sku", label: "Surat Keterangan Usaha (SKU)" },
  { id: "domisili", label: "Surat Keterangan Domisili" },
  { id: "skck", label: "Pengantar SKCK" },
  { id: "kelahiran", label: "Surat Keterangan Kelahiran" },
  { id: "kematian", label: "Surat Keterangan Kematian" },
  { id: "beda-nama", label: "Surat Keterangan Beda Nama" },
  { id: "izin-keramaian", label: "Surat Izin Keramaian" },
];

export default function LayananSuratPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State Form Data
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    whatsapp: "",
    jenisSurat: "",
    keperluan: "",
    fileKtp: null,
    fileKk: null,
  });

  // Handle Input Change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Upload (Simulasi)
  const handleFileChange = (event, field) => {
    if (e.target.files && event.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: event.target.files[0] }));
    }
  };

  // Handle Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulasi API Call (Delay 2 detik)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Reset form after success handled via modal close
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <FileText size={16} />
            Layanan Mandiri
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buat Surat Online
          </h1>
          <p className="text-gray-500 text-lg">
            Ajukan permohonan surat administrasi desa dari rumah. Cukup isi
            formulir, upload dokumen, dan ambil surat di Balai Desa saat sudah
            jadi.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* LEFT COLUMN: INFO & FAQ */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card Informasi */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-blue-600" />
                Ketentuan Layanan
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2 items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Pemohon wajib warga asli desa yang terdaftar di database
                    kependudukan.
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Pastikan Nomor WA aktif untuk menerima notifikasi status
                    surat.
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Waktu pengerjaan surat maksimal 1x24 jam di hari kerja.
                  </span>
                </li>
              </ul>
            </div>

            {/* Card Jam Pelayanan */}
            <div className="bg-green-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText size={100} />
              </div>
              <h3 className="font-bold text-lg mb-2">Jam Operasional Admin</h3>
              <p className="text-green-100 text-sm mb-4">
                Permohonan yang masuk di luar jam kerja akan diproses hari
                berikutnya.
              </p>
              <div className="space-y-1 text-sm font-semibold">
                <div className="flex justify-between">
                  <span>Senin - Kamis</span>
                  <span>08:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumat</span>
                  <span>08:00 - 11:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM INPUT */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Formulir Pengajuan
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid 2 Kolom */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* NIK */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK (Sesuai KTP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nik"
                        required
                        maxLength={16}
                        placeholder="Contoh: 3312345678900001"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        onChange={handleChange}
                      />
                      <User
                        className="absolute left-3 top-3.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      required
                      placeholder="Sesuai KTP"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Jenis Surat & WA */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Surat
                    </label>
                    <div className="relative">
                      <select
                        name="jenisSurat"
                        required
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 bg-white appearance-none outline-none cursor-pointer"
                        onChange={handleChange}
                      >
                        <option value="">-- Pilih Layanan Surat --</option>
                        {letterTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        placeholder="0812xxxx"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                        onChange={handleChange}
                      />
                      <Phone
                        className="absolute left-3 top-3.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {/* Keperluan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan / Keperluan
                  </label>
                  <textarea
                    name="keperluan"
                    rows={3}
                    required
                    placeholder="Jelaskan keperluan surat ini secara singkat. Contoh: Untuk persyaratan melamar kerja."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Upload Dokumen Area */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  {/* Upload KTP */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative group">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => handleFileChange(e, "fileKtp")}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {formData.fileKtp
                          ? formData.fileKtp.name
                          : "Upload Foto KTP"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Maks. 2MB (JPG/PNG)
                      </span>
                    </div>
                  </div>

                  {/* Upload KK */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative group">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => handleFileChange(e, "fileKk")}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-100 transition-colors">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {formData.fileKk
                          ? formData.fileKk.name
                          : "Upload Foto KK"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Maks. 2MB (JPG/PNG)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    required
                    className="mt-1 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor="agree"
                    className="text-sm text-gray-500 leading-relaxed"
                  >
                    Saya menyatakan bahwa data yang saya isi adalah benar dan
                    dapat dipertanggungjawabkan.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>Processing...</> // Bisa diganti Spinner Icon
                  ) : (
                    <>
                      <Send size={18} /> Kirim Permohonan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL SUKSES === */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Permohonan Terkirim!
            </h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Data Anda telah masuk ke sistem kami. Silakan tunggu notifikasi
              WhatsApp dari admin dalam waktu 1x24 jam.
            </p>
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
              >
                Ke Beranda
              </Link>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ ...formData, jenisSurat: "", keperluan: "" }); // Reset parsial
                }}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
              >
                Buat Lagi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
