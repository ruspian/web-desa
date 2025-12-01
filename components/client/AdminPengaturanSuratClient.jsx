"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  X,
  UploadCloud,
  Download,
  FileType,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { useToast } from "@/components/ui/Toast";
import ConfirmModal from "../ui/confirmModal";

export default function AdminPengaturanSuratClient({ initialData }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    kode: "",
    urlTemplate: "",
    fields: [], // Array untuk menampung konfigurasi input dinamis
  });

  const toast = useToast();
  const router = useRouter();

  // Filter Data
  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase())
  );

  // Tambah Kolom field baru
  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { label: "", key: "", type: "text" }],
    }));
  };

  // Hapus Kolom field
  const removeField = (index) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, fields: newFields }));
  };

  // Handle Perubahan Input di Form field
  const handleFieldChange = (index, prop, value) => {
    // map fields
    const newFields = formData.fields.map((field, i) => {
      if (i === index) {
        // Copy field yang sedang diedit
        const updatedField = { ...field, [prop]: value };

        // Auto generate Key dari Label
        if (prop === "label") {
          updatedField.key = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_") // Ganti spasi atau simbol jadi underscore
            .replace(/^_+|_+$/g, ""); // Hapus underscore di awal/akhir
        }

        return updatedField;
      }
      return field;
    });

    setFormData((prev) => ({ ...prev, fields: newFields }));
  };

  // UPLOAD CLOUDINARY
  const handleUploadSuccess = (result) => {
    const url = result.info.secure_url;

    // Validasi Ekstensi Manual
    if (!url.endsWith(".docx")) {
      toast.error(
        "Format salah! Mohon upload file .docx (Word 2007+)",
        "Gagal Upload"
      );
      return;
    }

    setFormData((prev) => ({ ...prev, urlTemplate: url }));
    toast.success("Template (.docx) berhasil diupload!");

    // kembalikan scroll ke auto setelah upload
    document.body.style.overflow = "auto";
  };

  const openModal = (item = null) => {
    if (item) {
      // Pastikan fields berupa array
      const currentFields = Array.isArray(item.fields) ? item.fields : [];
      setFormData({ ...item, fields: currentFields });
    } else {
      setFormData({
        id: null,
        nama: "",
        kode: "",
        urlTemplate: "",
        fields: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.urlTemplate)
      return toast.error("Harap upload file template .docx dulu!", "Gagal");

    setIsSaving(true);
    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/jenis-surat", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast.success("Pengaturan surat berhasil disimpan!", "Sukses");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message, "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/jenis-surat?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus");
      toast.success("Berhasil dihapus", "Sukses");
      setIsDeleteOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message, "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Template Surat</h1>
          <p className="text-gray-500 text-sm">
            Upload format surat (.docx) dan atur data input dinamis.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={20} /> Tambah Jenis Surat
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama surat..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST TEMPLATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-200 transition-all group flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="text-xs font-mono font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">
                  {item.kode || "DOC"}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                {item.nama}
              </h3>
              <p className="text-xs text-gray-400">
                Fields: {item.fields ? item.fields.length : 0} variabel
              </p>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              <a
                href={item.urlTemplate}
                target="_blank"
                className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <Download size={14} /> Template
              </a>
              <button
                onClick={() => openModal(item)}
                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => (setDeleteId(item.id), setIsDeleteOpen(true))}
                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Jenis Surat?"
        message="Surat yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
      />

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Template" : "Upload Template Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-6 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="label-input">Nama Surat</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Contoh: Surat Keterangan Usaha"
                    required
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">Kode (Opsional)</label>
                  <input
                    type="text"
                    className="input-field uppercase font-mono"
                    placeholder="SKU"
                    value={formData.kode}
                    onChange={(e) =>
                      setFormData({ ...formData, kode: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* UPLOAD AREA */}
              <div>
                <label className="label-input">File Template (.docx)</label>
                {formData.urlTemplate ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                        <FileType size={20} />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-emerald-900">
                          File Terupload
                        </p>
                        <a
                          href={formData.urlTemplate}
                          target="_blank"
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          Cek File
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, urlTemplate: "" })
                      }
                      className="text-red-500 hover:bg-red-100 p-2 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <CldUploadButton
                    uploadPreset="ml_default" // GANTI DENGAN PRESET KAMU
                    onSuccess={handleUploadSuccess}
                    options={{
                      resourceType: "raw", // PENTING: Mode RAW untuk file non-gambar
                      clientAllowedFormats: ["docx"], // Cuma boleh Word .docx
                      maxFileSize: 10000000,
                    }}
                    className="w-full"
                  >
                    <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer">
                      <UploadCloud size={24} className="mb-1" />
                      <p className="text-sm font-bold">Klik Upload Template</p>
                      <p className="text-[10px] text-gray-400">
                        Wajib format .docx (Word 2007+)
                      </p>
                    </div>
                  </CldUploadButton>
                )}
              </div>

              {/* --- DYNAMIC FORM BUILDER --- */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800">
                      Data Khusus (Variabel)
                    </label>
                    <p className="text-xs text-gray-500">
                      Tentukan data apa saja yang perlu diisi untuk surat ini.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addField}
                    className="text-xs flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    <PlusCircle size={14} /> Tambah Kolom
                  </button>
                </div>

                {formData.fields.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg bg-white">
                    <p className="text-xs text-gray-400 italic">
                      Belum ada data khusus.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start animate-fade-in"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Label Input (Cth: Nama Usaha)"
                            className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            value={field.label}
                            onChange={(e) =>
                              handleFieldChange(index, "label", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Variabel Word (Cth: nama_usaha)"
                            className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg text-xs font-mono focus:ring-2 focus:ring-yellow-500 outline-none"
                            value={field.key}
                            onChange={(e) =>
                              handleFieldChange(index, "key", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="w-28">
                          <select
                            className="w-full px-2 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={field.type}
                            onChange={(e) =>
                              handleFieldChange(index, "type", e.target.value)
                            }
                          >
                            <option value="text">Teks Singkat</option>
                            <option value="textarea">Paragraf</option>
                            <option value="date">Tanggal</option>
                            <option value="number">Angka</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-[10px] text-yellow-800 flex gap-2 items-start">
                  <div className="mt-0.5 font-bold">INFO:</div>
                  <p>
                    Pastikan kode variabel di kolom kuning sama persis dengan
                    yang ada di file Word (Contoh:{" "}
                    <code>{`{{nama_usaha}}`}</code>). Sistem akan otomatis
                    menggantinya saat surat dibuat.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
