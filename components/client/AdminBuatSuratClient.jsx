"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UserCheck,
  FileText,
  Download,
  Save,
  X,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Helper Error
function replaceErrors(key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}

export default function AdminBuatSuratClient({ residentList, templates = [] }) {
  const [search, setSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedTemplateFields, setSelectedTemplateFields] = useState([]);

  const [formData, setFormData] = useState({
    templateId: "",
    nomorSurat: "470 / ... / ... / 2025",
    keperluan: "",
    keterangan: "",
    extraData: {},
  });

  const toast = useToast();
  const router = useRouter();

  // CARI WARGA
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

  // GANTI TEMPLATE
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

  // INPUT DATA DINAMIS YANG DIBUTUHKAN SURAT
  const handleDynamicChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      extraData: {
        ...prev.extraData,
        [key]: value,
      },
    }));
  };

  // BUAT DAN SIMPAN SURAT
  const generateDocument = async (e) => {
    e.preventDefault();
    if (!selectedResident) return toast.error("Pilih warga dulu!", "Error");
    if (!formData.templateId) return toast.error("Pilih jenis surat!", "Error");

    setIsGenerating(true);

    try {
      const selectedTemplate = templates.find(
        (t) => t.id === formData.templateId
      );
      if (!selectedTemplate) throw new Error("Template surat tidak ditemukan");
      if (!selectedTemplate.urlTemplate)
        throw new Error("File template belum diupload");

      if (selectedTemplate.urlTemplate.endsWith(".doc")) {
        throw new Error("Format .doc tidak didukung. Harap upload .docx");
      }

      // Simpan Log
      const payload = {
        pendudukId: selectedResident.id,
        nikSnapshot: selectedResident.nik,
        namaSnapshot: selectedResident.nama,
        jenisSurat: selectedTemplate.nama,
        templateId: selectedTemplate.id,
        nomorSurat: formData.nomorSurat,
        keperluan: formData.keperluan,
        extraData: formData.extraData,
        status: "APPROVED",
      };

      const apiRes = await fetch("/api/surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!apiRes.ok) throw new Error("Gagal menyimpan arsip surat");

      const timestamp = new Date().getTime();
      // Cek apakah url sudah punya params atau belum
      const separator = selectedTemplate.urlTemplate.includes("?") ? "&" : "?";
      const fileUrl = `${selectedTemplate.urlTemplate}${separator}t=${timestamp}`;

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Gagal mendownload file template");

      const arrayBuffer = await response.arrayBuffer();

      let zip;
      try {
        zip = new PizZip(arrayBuffer);
      } catch (e) {
        throw new Error("File template rusak/bukan .docx valid.");
      }

      let doc;
      try {
        doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          delimiters: { start: "{", end: "}" }, // DELIMITER => {..} di dalam template
        });
      } catch (error) {
        if (error.properties && error.properties.errors) {
          const errorMessages = error.properties.errors
            .map((e) => e.properties.explanation)
            .join("; ");
          throw new Error(`Template Error (Init): ${errorMessages}`);
        }
        throw error;
      }

      // Render Data
      try {
        doc.render({
          // Data Warga
          nama: selectedResident.nama,
          nik: selectedResident.nik,
          jk: selectedResident.jk === "L" ? "Laki-laki" : "Perempuan",
          pekerjaan: selectedResident.pekerjaan || "-",
          alamat: selectedResident.alamat,

          // Data Surat
          nomor_surat: formData.nomorSurat,
          keperluan: formData.keperluan,
          keterangan: formData.keterangan || "",

          // Data Umum
          tanggal_surat: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          kepala_desa: "H. BUDI SANTOSO, S.IP",

          // Data Dinamis
          ...formData.extraData,
        });
      } catch (error) {
        if (error.properties && error.properties.errors) {
          const errorMessages = error.properties.errors
            .map((e) => e.properties.explanation)
            .join("\n");

          throw new Error(
            `Format Word Salah. Pastikan pakai kurung tunggal {variable}.\nError: ${errorMessages}`
          );
        }
        throw error;
      }

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const fileName = `${selectedTemplate.nama.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_${selectedResident.nama.replace(/\s+/g, "")}.docx`;
      saveAs(out, fileName);

      toast.success("Surat berhasil dibuat & didownload!", "Sukses");

      resetForm();
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan sistem", "Gagal");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedResident(null);
    setFormData({
      templateId: "",
      nomorSurat: "470 / ... / ... / 2025",
      keperluan: "",
      keterangan: "",
      extraData: {},
    });
    setSelectedTemplateFields([]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Buat Surat (Format Word)
        </h1>
        <p className="text-gray-500 text-sm">
          Pilih warga, pilih template, dan sistem akan otomatis mengisi data ke
          file Word (.docx).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: PENCARIAN */}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={selectedResident !== null}
              />
              {selectedResident && (
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

          {/* Resident Preview */}
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
              <div>
                <label className="label-input">Pilih Jenis Surat</label>
                <select
                  className="input-field bg-white"
                  value={formData.templateId}
                  onChange={handleTemplateChange}
                  required
                >
                  <option value="">-- Pilih Template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}
                    </option>
                  ))}
                </select>
              </div>

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
                  <label className="label-input">Keterangan Tambahan</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Isi variabel {keterangan}"
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({ ...formData, keterangan: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Dynamic Fields */}
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

              <div>
                <label className="label-input">Keperluan</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Untuk melamar kerja..."
                  value={formData.keperluan}
                  onChange={(e) =>
                    setFormData({ ...formData, keperluan: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 disabled:opacity-50"
                  disabled={isGenerating}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Download size={18} />
                  )}
                  Generate & Download
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
