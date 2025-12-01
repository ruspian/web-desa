"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Image as ImageIcon,
  X,
  Save,
  UploadCloud,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { useToast } from "@/components/ui/Toast";
import { useDebounce } from "use-debounce";
import Pagination from "../ui/pagination";
import ConfirmModal from "../ui/confirmModal";

export default function AdminGaleriClient({ initialData, pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // State Filter & Search
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const filterCat = searchParams.get("cat") || "Semua";

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State Modal Hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    caption: "",
    category: "Kegiatan",
    image: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("q") || "")) {
      if (debouncedSearch) params.set("q", debouncedSearch);
      else params.delete("q");

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat !== "Semua") params.set("cat", cat);
    else params.delete("cat");

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
    toast.success("Foto berhasil diupload!");

    // kembalikan scroll ke auto setelah upload
    document.body.style.overflow = "auto";
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ id: null, caption: "", category: "Kegiatan", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Wajib upload foto!");

    setIsSaving(true);
    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/galeri", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      toast.success("Galeri berhasil disimpan!");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger Modal Hapus
  const onDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/galeri?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Foto dihapus");
      router.refresh();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Galeri Dokumentasi
          </h1>
          <p className="text-gray-500 text-sm">
            Total Foto: {pagination.totalItems} Item
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={20} /> Upload Foto
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari caption foto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer min-w-[180px]"
            value={filterCat}
            onChange={(e) => handleFilterCategory(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Kegiatan">Kegiatan Desa</option>
            <option value="Pemerintahan">Pemerintahan</option>
            <option value="Pembangunan">Pembangunan</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Ekonomi">Ekonomi</option>
          </select>
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Upload Shortcut */}
        <button
          onClick={() => openModal()}
          className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-all group"
        >
          <div className="p-4 bg-gray-100 rounded-full group-hover:bg-white mb-2 transition-colors">
            <UploadCloud size={24} />
          </div>
          <span className="text-xs font-bold">Upload Baru</span>
        </button>

        {/* Gallery Items */}
        {initialData.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all border border-gray-200"
          >
            <Image
              src={item.image}
              alt={item.caption}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized // PENTING: Biar gambar Cloudinary muncul tanpa error
            />

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                {item.category}
              </span>
              <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                {item.caption}
              </p>
              <p className="text-gray-400 text-[10px] mt-1">{item.date}</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2.5 group-hover:translate-y-0 duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(item);
                }}
                className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-lg shadow-sm backdrop-blur-sm"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(item.id);
                }}
                className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-lg shadow-sm backdrop-blur-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {initialData.length === 0 && (
        <div className="text-center py-12 text-gray-400 col-span-full">
          <p>Tidak ada foto ditemukan.</p>
        </div>
      )}

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <Pagination
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      {/* === MODAL KONFIRMASI HAPUS === */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Foto?"
        message="Foto ini akan dihapus permanen dari galeri dan penyimpanan."
      />

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Foto" : "Upload Foto Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Upload Area */}
              <div className="w-full">
                <label className="label-input">File Foto</label>
                {formData.image ? (
                  <div className="relative h-48 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                        className="text-white bg-red-500 px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Hapus & Ganti
                      </button>
                    </div>
                  </div>
                ) : (
                  <CldUploadButton
                    uploadPreset="ml_default"
                    onSuccess={handleUploadSuccess}
                    className="w-full"
                  >
                    <div className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer gap-2">
                      <div className="p-3 bg-slate-50 rounded-full">
                        <ImageIcon size={24} />
                      </div>
                      <span className="text-sm font-bold">
                        Klik untuk Upload
                      </span>
                      <span className="text-xs">JPG, PNG (Max 5MB)</span>
                    </div>
                  </CldUploadButton>
                )}
              </div>

              <div>
                <label className="label-input">Kategori Album</label>
                <select
                  className="input-field bg-white"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option>Kegiatan</option>
                  <option>Pemerintahan</option>
                  <option>Pembangunan</option>
                  <option>Pertanian</option>
                  <option>Ekonomi</option>
                </select>
              </div>

              <div>
                <label className="label-input">Caption / Keterangan</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData({ ...formData, caption: e.target.value })
                  }
                  placeholder="Jelaskan momen yang ada di foto..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Simpan Galeri"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
