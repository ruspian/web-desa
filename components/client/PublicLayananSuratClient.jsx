"use client";

import { useState } from "react";
import {
  FileText,
  User,
  Phone,
  Upload,
  Send,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";

export default function PublicLayananSuratClient({
  userPenduduk,
  templates = [],
}) {
  const toast = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State Form Utama
  const [formData, setFormData] = useState({
    templateId: "",
    namaSurat: "",
    whatsapp: userPenduduk.noHp || "",
    keperluan: "",
    extraData: {},
    fileKtp: "",
    fileKk: "",
  });

  // State untuk Field Dinamis yang sedang aktif
  const [activeFields, setActiveFields] = useState([]);

  // HANDLE GANTI TEMPLATE
  const handleTemplateChange = (e) => {
    const tId = e.target.value;
    const selectedTemplate = templates.find((t) => t.id === tId);

    if (selectedTemplate) {
      setFormData((prev) => ({
        ...prev,
        templateId: tId,
        namaSurat: selectedTemplate.nama,
        extraData: {}, // Reset jawaban field dinamis saat ganti surat
      }));

      // Set field dinamis dari database
      setActiveFields(
        Array.isArray(selectedTemplate.fields) ? selectedTemplate.fields : []
      );
    } else {
      // Reset jika pilih default
      setFormData((prev) => ({
        ...prev,
        templateId: "",
        namaSurat: "",
        extraData: {},
      }));
      setActiveFields([]);
    }
  };

  // HANDLE PERUBAHAN INPUT DINAMIS
  const handleDynamicChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      extraData: {
        ...prev.extraData,
        [key]: value,
      },
    }));
  };

  // HANDLE UPLOAD CLOUDINARY
  const handleUploadSuccess = (result, field) => {
    if (result.info.secure_url) {
      setFormData((prev) => ({ ...prev, [field]: result.info.secure_url }));
      toast.success("Dokumen berhasil diupload!", "Sukses");
    }
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.templateId)
      return toast.error("Silakan pilih jenis surat!", "Data Kurang");
    if (!formData.fileKtp || !formData.fileKk)
      return toast.error("Foto KTP dan KK wajib diupload!", "Data Kurang");
    if (!formData.keperluan)
      return toast.error("Isi keperluan surat!", "Data Kurang");

    setIsLoading(true);

    try {
      const payload = {
        pendudukId: userPenduduk.id,
        nikSnapshot: userPenduduk.nik,
        namaSnapshot: userPenduduk.nama,
        jenisSurat: formData.namaSurat,
        templateId: formData.templateId,
        noHp: formData.whatsapp,
        keperluan: formData.keperluan,

        // Gabungkan data dinamis dengan link file
        extraData: {
          ...formData.extraData,
          _lampiran_ktp: formData.fileKtp,
          _lampiran_kk: formData.fileKk,
        },

        // Field khusus file
        fileKtp: formData.fileKtp,
        fileKk: formData.fileKk,

        status: "PENDING",
      };

      const res = await fetch("/api/surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengirim permohonan");
      }

      setIsSuccess(true);
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan sistem.", "Gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <FileText size={16} /> Layanan Mandiri
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buat Surat Online
          </h1>
          <p className="text-gray-500 text-lg">
            Halo, <b>{userPenduduk.nama}</b>. Silakan lengkapi data di bawah ini
            untuk mengajukan surat.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* KIRI: INFO DATA DIRI */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-blue-600" /> Data Pemohon
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    NIK
                  </p>
                  <p className="font-mono text-gray-800 text-base">
                    {userPenduduk.nik}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Nama
                  </p>
                  <p className="font-bold text-gray-800 text-base">
                    {userPenduduk.nama}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Dusun
                  </p>
                  <p className="font-bold text-gray-800 text-base">
                    {userPenduduk.dusun || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULIR */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Formulir Pengajuan
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PILIH JENIS SURAT */}
                <div>
                  <label className="label-input">Jenis Surat</label>
                  <div className="relative">
                    <select
                      className="input-field bg-white appearance-none cursor-pointer"
                      value={formData.templateId}
                      onChange={handleTemplateChange}
                      required
                    >
                      <option value="">-- Pilih Layanan Surat --</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nama}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                {/* DATA DINAMIS*/}
                {activeFields.length > 0 && (
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 space-y-4 animate-fade-in">
                    <h4 className="text-xs font-bold text-blue-600 uppercase flex items-center gap-2">
                      <FileText size={14} /> Lengkapi Data Khusus
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeFields.map((field, idx) => (
                        <div
                          key={idx}
                          className={
                            field.type === "textarea" ? "md:col-span-2" : ""
                          }
                        >
                          <label className="block text-xs font-bold text-blue-800 uppercase mb-1.5">
                            {field.label}
                          </label>
                          {field.type === "textarea" ? (
                            <textarea
                              className="input-field bg-white h-20 resize-none"
                              placeholder={`Masukkan ${field.label}...`}
                              required
                              onChange={(e) =>
                                handleDynamicChange(field.key, e.target.value)
                              }
                            ></textarea>
                          ) : (
                            <input
                              type={field.type || "text"}
                              className="input-field bg-white"
                              placeholder={`Masukkan ${field.label}...`}
                              required
                              onChange={(e) =>
                                handleDynamicChange(field.key, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DATA UMUM  */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-input">
                      Nomor WhatsApp (Aktif)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        className="input-field pl-10"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        placeholder="0812xxxx"
                        required
                      />
                      <Phone
                        className="absolute left-3 top-3.5 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-input">Keperluan</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.keperluan}
                      onChange={(e) =>
                        setFormData({ ...formData, keperluan: e.target.value })
                      }
                      placeholder="Contoh: Melamar Kerja"
                      required
                    />
                  </div>
                </div>

                {/*  UPLOAD DOKUMEN  */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  {/* KTP */}
                  <div>
                    <label className="label-input">Foto KTP</label>
                    {formData.fileKtp ? (
                      <div className="relative h-32 w-full rounded-xl overflow-hidden border border-green-200 group bg-gray-100">
                        <Image
                          src={formData.fileKtp}
                          alt="KTP"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, fileKtp: "" }))
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center">
                          Terupload
                        </div>
                      </div>
                    ) : (
                      <CldUploadButton
                        uploadPreset="ml_default"
                        onSuccess={(res) => handleUploadSuccess(res, "fileKtp")}
                        className="w-full"
                      >
                        <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-green-400 hover:text-green-600 transition-all cursor-pointer gap-2 bg-white">
                          <Upload size={24} />
                          <span className="text-xs font-bold">Upload KTP</span>
                        </div>
                      </CldUploadButton>
                    )}
                  </div>

                  {/* KK */}
                  <div>
                    <label className="label-input">Foto KK</label>
                    {formData.fileKk ? (
                      <div className="relative h-32 w-full rounded-xl overflow-hidden border border-green-200 group bg-gray-100">
                        <Image
                          src={formData.fileKk}
                          alt="KK"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, fileKk: "" }))
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center">
                          Terupload
                        </div>
                      </div>
                    ) : (
                      <CldUploadButton
                        uploadPreset="ml_default"
                        onSuccess={(res) => handleUploadSuccess(res, "fileKk")}
                        className="w-full"
                      >
                        <div className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-green-400 hover:text-green-600 transition-all cursor-pointer gap-2 bg-white">
                          <Upload size={24} />
                          <span className="text-xs font-bold">Upload KK</span>
                        </div>
                      </CldUploadButton>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Permohonan Terkirim!
            </h3>
            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
              Data Anda telah masuk ke sistem kami. Silakan tunggu verifikasi
              dari Admin. Anda dapat memantau status surat di menu{" "}
              <b>Riwayat Surat</b>.
            </p>
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
              >
                Beranda
              </Link>
              <Link
                href="/layanan/surat/status"
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
              >
                Cek Riwayat
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
