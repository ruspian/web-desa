"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  UserCheck,
  FileText,
  Download,
  X,
  AlertCircle,
  ChevronRight,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { imageOptions } from "@/lib/base64DataURLToArrayBuffer";
import QRCode from "qrcode";
import ImageModule from "docxtemplater-image-module-free";

export default function AdminBuatSuratClient({
  residentList,
  templates = [],
  prefilledData,
}) {
  const [search, setSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlFileJadi, setUrlFileJadi] = useState(null);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // State Modal Sukses
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastGeneratedFile, setLastGeneratedFile] = useState(null);

  // State Form
  const [selectedTemplateFields, setSelectedTemplateFields] = useState([]);
  const [formData, setFormData] = useState({
    templateId: "",
    nomorSurat: "470 / ... / ... / 2025",
    keperluan: "",
    extraData: {},
  });

  const toast = useToast();
  const router = useRouter();

  //  AUTO-FILL DARI VERIFIKASI
  useEffect(() => {
    if (prefilledData) {
      // Set Warga
      setSelectedResident({
        id: prefilledData.pendudukId,
        nik: prefilledData.nik,
        nama: prefilledData.nama,
        alamat: prefilledData.alamat,
        pekerjaan: prefilledData.pekerjaan,
        jk: prefilledData.jk,
        noHp: prefilledData.noHp,
        tglLahir: prefilledData.tglLahir,
        tempatLahir: prefilledData.tempatLahir,
        agama: prefilledData.agama,
      });

      // Set Template & Data
      const matchingTemplate = templates.find(
        (t) => t.nama === prefilledData.jenisSurat
      );

      if (matchingTemplate) {
        setFormData({
          templateId: matchingTemplate.id,
          nomorSurat: "470 / ... / ... / 2025",
          keperluan: prefilledData.keperluan,
          extraData: prefilledData.extraData || {},
        });

        // Munculkan field dinamis
        if (Array.isArray(matchingTemplate.fields)) {
          setSelectedTemplateFields(matchingTemplate.fields);
        }
      }
    }
  }, [prefilledData, templates]);

  // Cari Warga
  const searchResults = useMemo(() => {
    if (!search || search.length < 3) return [];
    const lower = search.toLowerCase();
    return residentList
      .filter(
        (r) => r.nama.toLowerCase().includes(lower) || r.nik.includes(lower)
      )
      .slice(0, 5);
  }, [search, residentList]);

  const selectResident = (resident) => {
    setSelectedResident(resident);
    setSearch("");
  };

  // Ganti Template
  const handleTemplateChange = (e) => {
    const tId = e.target.value;
    const temp = templates.find((t) => t.id === tId);

    setFormData((prev) => ({
      ...prev,
      templateId: tId,
      extraData: {},
    }));

    if (temp && Array.isArray(temp.fields)) {
      setSelectedTemplateFields(temp.fields);
    } else {
      setSelectedTemplateFields([]);
    }
  };

  // Input Data Dinamis
  const handleDynamicChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      extraData: {
        ...prev.extraData,
        [key]: value,
      },
    }));
  };

  // FUNGSI GENERATE, UPLOAD, SAVE
  const generateDocument = async (e) => {
    e.preventDefault();
    if (!selectedResident) return toast.error("Pilih warga dulu!", "Error");
    if (!formData.templateId) return toast.error("Pilih jenis surat!", "Error");

    setIsGenerating(true);

    try {
      // Cek apakah template sudah diupload
      const selectedTemplate = templates.find(
        (t) => t.id === formData.templateId
      );
      if (!selectedTemplate?.urlTemplate)
        throw new Error("Template belum diupload");

      // Simpan Data Dulu ke database untuk mendapatkan id surat
      let apiMethod = "POST";

      // Payload buat surat baru
      let payload = {
        pendudukId: selectedResident.id,
        nikSnapshot: selectedResident.nik,
        namaSnapshot: selectedResident.nama,
        jenisSurat: selectedTemplate.nama,
        templateId: selectedTemplate.id,
        nomorSurat: formData.nomorSurat,
        keperluan: formData.keperluan,
        extraData: formData.extraData,
        status: "APPROVED",
        fileSuratJadi: null, // beri nilai null dulu
        noHp: selectedResident.noHp || "",
      };

      // payload update request surat dari warga
      if (prefilledData && prefilledData.requestId) {
        apiMethod = "PUT";
        payload = {
          id: prefilledData.requestId,
          status: "APPROVED",
          alasan: null,
          nomorSurat: formData.nomorSurat,
          keperluan: formData.keperluan,
          extraData: formData.extraData, // ganti data dinamis jika ada typo dari warga
        };
      }

      // simpan data
      const apiRes = await fetch("/api/surat", {
        method: apiMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // jika gagal
      const resultJson = await apiRes.json();
      console.log("resultJson", resultJson);

      if (!apiRes.ok)
        throw new Error(resultJson.message || "Gagal menyimpan data");

      // ambil id surat
      const suratId = resultJson.data
        ? resultJson.data.id
        : prefilledData?.requestId;

      // generate gambar QR
      const validationUrl = `${window.location.origin}/verify?id=${suratId}`; //link untuk verifikasi surat
      const qrCodeDataUrl = await QRCode.toDataURL(validationUrl);

      // Download Template
      const timestamp = new Date().getTime();
      const fileUrl = `${selectedTemplate.urlTemplate}${
        selectedTemplate.urlTemplate.includes("?") ? "&" : "?"
      }t=${timestamp}`;
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);

      // Init Docxtemplater dengan IMAGE MODULE
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{", end: "}" },
        modules: [new ImageModule(imageOptions)], // tambahkan module gambar
      });

      // Render Data ke docx
      doc.render({
        nama: selectedResident.nama,
        nik: selectedResident.nik,
        jk: selectedResident.jk === "L" ? "Laki-laki" : "Perempuan",
        agama: selectedResident.agama || "-",
        nomor_surat: formData.nomorSurat,
        tanggal_surat: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        ...formData.extraData,

        // qr code
        //  variable Di Word: {%qr_code}
        qr_code: qrCodeDataUrl,
      });

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const fileName = `${selectedTemplate.nama.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_${selectedResident.nama.replace(/\s+/g, "")}.docx`;

      // Upload & Update
      toast.info("Mengupload dokumen final...", "Proses");
      const uploadedUrl = await uploadToCloudinary(out, fileName);

      // Update URL File di Database
      await fetch("/api/surat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: suratId,
          status: "APPROVED",
          fileSuratJadi: uploadedUrl,
        }),
      });

      // selesai
      saveAs(out, fileName);
      toast.success("Surat berhasil dibuat!", "Sukses");

      const shortLink = `${window.location.origin}/surat/download/${suratId}`;
      setUrlFileJadi(shortLink);

      setLastGeneratedFile({
        fileName,
        warga: selectedResident.nama,
        noHp: selectedResident.noHp || "",
        jenisSurat: selectedTemplate.nama,
        downloadLink: shortLink,
      });
      setIsSuccessOpen(true);
      router.refresh();
    } catch (error) {
      console.error(error);
      // Handle error template
      if (error.properties && error.properties.errors) {
        const msg = error.properties.errors
          .map((e) => e.properties.explanation)
          .join("; ");
        toast.error(`Template Error: ${msg}`, "Gagal");
      } else {
        toast.error(error.message || "Terjadi kesalahan", "Gagal");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // FITUR WA
  const sendToWhatsApp = () => {
    if (!lastGeneratedFile || !lastGeneratedFile.noHp) {
      toast.error("Nomor HP warga tidak tersedia.", "Gagal");
      return;
    }
    let phone = lastGeneratedFile.noHp.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.substring(1);

    const message = `Halo *${lastGeneratedFile.warga}*,\n\nPermohonan surat *${lastGeneratedFile.jenisSurat}* Anda telah selesai diproses.\nSilakan login ke website desa untuk mendownload file digitalnya, atau klik link berikut:\n\n ${lastGeneratedFile.downloadLink} \n\nTerima kasih.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    closeSuccessModal();
  };

  const closeSuccessModal = () => {
    setIsSuccessOpen(false);
    setLastGeneratedFile(null);
    resetForm();
    // Jika ini dari redirect verifikasi, kembalikan ke halaman list surat
    if (prefilledData) {
      router.push("/admin/layanan/buat-surat");
    }
  };

  const resetForm = () => {
    if (!prefilledData) {
      setSelectedResident(null);
      setFormData({
        templateId: "",
        nomorSurat: "470 / ... / ... / 2025",
        keperluan: "",
        extraData: {},
      });
      setSelectedTemplateFields([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Buat Surat Otomatis
        </h1>
        <p className="text-gray-500 text-sm">
          Pilih warga, pilih template, dan sistem akan otomatis mengisi data,
          menyimpan, dan mengupload file.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PENCARIAN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative z-20">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Cari Data Pemohon
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Ketik NIK atau Nama..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:bg-gray-100 disabled:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={selectedResident !== null || !!prefilledData} // Disable search kalau dari verifikasi
              />
              {selectedResident && !prefilledData && (
                <button
                  onClick={() => setSelectedResident(null)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {searchResults.length > 0 && !selectedResident && (
              <div className="absolute left-0 right-0 mt-2 mx-6 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-30">
                {searchResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => selectResident(res)}
                    className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <p className="font-bold text-gray-800 text-sm">
                      {res.nama}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{res.nik}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resident Preview Card */}
          {selectedResident ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Data Terverifikasi
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Database Kependudukan
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500 text-xs block">Nama:</span>{" "}
                  <b>{selectedResident.nama}</b>
                </p>
                <p>
                  <span className="text-gray-500 text-xs block">NIK:</span>{" "}
                  <span className="font-mono">{selectedResident.nik}</span>
                </p>
                <p>
                  <span className="text-gray-500 text-xs block">Alamat:</span>{" "}
                  {selectedResident.alamat}
                </p>
                <p>
                  <span className="text-gray-500 text-xs block">No. HP:</span>{" "}
                  {selectedResident.noHp || "-"}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <AlertCircle className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm">
                Silakan cari dan pilih warga terlebih dahulu.
              </p>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: FORM GENERATOR */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            {!selectedResident && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 text-gray-500">
                  <ChevronRight className="animate-pulse" /> Pilih warga di
                  sebelah kiri
                </div>
              </div>
            )}

            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Konfigurasi Surat
            </h2>

            <form onSubmit={generateDocument} className="space-y-5">
              {/* PILIH TEMPLATE */}
              <div>
                <label className="label-input">Pilih Jenis Surat</label>
                <select
                  className="input-field bg-white disabled:bg-gray-100"
                  value={formData.templateId}
                  onChange={handleTemplateChange}
                  required
                  disabled={!!prefilledData} // Disable jika dari verifikasi
                >
                  <option value="">Pilih Jenis Surat</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* INPUT STANDARD */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="label-input">Nomor Surat</label>
                  <input
                    type="text"
                    className="input-field font-mono"
                    value={formData.nomorSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">Keperluan</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Isi keperluan..."
                    value={formData.keperluan}
                    onChange={(e) =>
                      setFormData({ ...formData, keperluan: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* AREA FORM DINAMIS */}
              {selectedTemplateFields.length > 0 && (
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-2">
                    <FileText size={14} /> Data Khusus Surat Ini
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedTemplateFields.map((field, idx) => (
                      <div key={idx}>
                        <label className="label-input text-blue-800">
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            className="input-field bg-white h-24 resize-none"
                            placeholder={`Isi ${field.label}...`}
                            required
                            value={formData.extraData[field.key] || ""}
                            onChange={(e) =>
                              handleDynamicChange(field.key, e.target.value)
                            }
                          ></textarea>
                        ) : (
                          <input
                            type={field.type || "text"}
                            className="input-field bg-white"
                            placeholder={`Isi ${field.label}...`}
                            required
                            value={formData.extraData[field.key] || ""}
                            onChange={(e) =>
                              handleDynamicChange(field.key, e.target.value)
                            }
                          />
                        )}
                        <p className="text-[10px] text-blue-400 mt-1">
                          Variabel Word: <code>{`{${field.key}}`}</code>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                  disabled={isGenerating}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Download size={18} />
                  )}
                  Buat Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/*  MODAL SUKSES  */}
      {isSuccessOpen && lastGeneratedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Surat Selesai!</h3>
              <p className="text-emerald-100 text-sm mt-1">
                File tersimpan di sistem dan diunduh ke perangkat Anda.
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <p className="text-gray-500 mb-1">Penerima:</p>
                <p className="font-bold text-gray-800 text-lg">
                  {lastGeneratedFile.warga}
                </p>
              </div>

              {lastGeneratedFile.noHp ? (
                <div className="space-y-3">
                  <button
                    onClick={sendToWhatsApp}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all"
                  >
                    <MessageCircle size={20} /> Kirim Link via WhatsApp
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    *Akan membuka WhatsApp Web dengan pesan template.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 text-yellow-700 text-sm rounded-xl text-center border border-yellow-100">
                  Nomor HP tidak tersedia.
                </div>
              )}

              <button
                onClick={closeSuccessModal}
                className="w-full py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
