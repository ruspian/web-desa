"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  Save,
  Eye,
  Filter,
  Calendar,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import { CldUploadButton } from "next-cloudinary";
import Pagination from "../ui/pagination";
import TiptapEditor from "../ui/tiptap";
import ConfirmModal from "../ui/confirmModal";

export default function AdminBeritaClient({ initialData, pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // State
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const filterStatus = searchParams.get("status") || "all";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "Kegiatan",
    content: "",
    status: "published",
    image: "",
  });

  // --- URL SYNC ---
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("query") || "")) {
      if (debouncedSearch) params.set("query", debouncedSearch);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterStatus = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status !== "all") params.set("status", status);
    else params.delete("status");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // --- ACTIONS ---
  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
    toast.success("Thumbnail berhasil diupload!", "Sukses");
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title,
        category: item.category,
        content: item.content || "", // Pastikan tidak null
        status: item.status,
        image: item.image || "",
      });
    } else {
      setFormData({
        id: null,
        title: "",
        category: "Kegiatan",
        content: "",
        status: "published",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.image)
      return toast.error("Harap upload gambar thumbnail!", "Error");

    // Validasi konten kosong
    if (!formData.content || formData.content === "<p></p>") {
      return toast.error("Isi konten berita tidak boleh kosong!", "Error");
    }

    setIsSaving(true);
    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/berita", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan berita");

      toast.success("Berita berhasil disimpan!", "Sukses");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message, "Gagal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/berita?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berita dihapus", "Sukses");
      router.refresh();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message, "Gagal");
    } finally {
      setIsDeleting(false);
    }
  };

  // fungsi ganti nilai conten
  const handleContentChange = (html) => {
    setFormData((prev) => ({ ...prev, content: html }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kabar & Artikel</h1>
          <p className="text-gray-500 text-sm">
            Publikasikan kegiatan dan informasi desa ke website.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={20} /> Tulis Berita
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari judul berita..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer min-w-[150px]"
            value={filterStatus}
            onChange={(e) => handleFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="published">Tayang</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* LIST BERITA */}
      <div className="space-y-4">
        {initialData.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center group hover:border-emerald-200 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg relative overflow-hidden shrink-0 border border-gray-200">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon size={24} />
                </div>
              )}
              {post.status === "draft" && (
                <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    DRAFT
                  </span>
                </div>
              )}
            </div>

            {/* Content Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} /> {post.date}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye size={12} /> {post.views} x
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500">Penulis: {post.author}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              <button
                onClick={() => openModal(post)}
                className="p-2.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => {
                  setDeleteId(post.id);
                  setIsDeleteOpen(true);
                }}
                className="p-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {initialData.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 mb-2">Tidak ada berita ditemukan.</p>
          </div>
        )}

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Hapus Data?"
          message="Data yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
        />

        {pagination.totalPages > 1 && (
          <div className="p-4">
            <Pagination
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* MODAL EDITOR  */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {formData.id ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSave}
              className="p-8 overflow-y-auto flex-1 space-y-6"
            >
              {/* Title */}
              <div>
                <input
                  type="text"
                  className="w-full px-0 py-2 border-b-2 border-gray-200 text-3xl font-bold text-gray-800 placeholder-gray-300 focus:border-emerald-500 outline-none transition-colors bg-transparent"
                  placeholder="Judul Berita..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label-input">Kategori</label>
                  <select
                    className="input-field bg-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Kegiatan</option>
                    <option>Pembangunan</option>
                    <option>Pemerintahan</option>
                    <option>Kesehatan</option>
                    <option>Ekonomi</option>
                    <option>Pengumuman</option>
                  </select>
                </div>

                <div>
                  <label className="label-input">Status Publikasi</label>
                  <select
                    className="input-field bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="published">Tayang (Public)</option>
                    <option value="draft">Simpan Draft (Private)</option>
                  </select>
                </div>

                {/* Upload Thumbnail */}
                <div>
                  <label className="label-input">Gambar Thumbnail</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 bg-gray-200 rounded overflow-hidden relative border border-gray-300">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Thumb"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <ImageIcon
                          size={16}
                          className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                      )}
                    </div>
                    <CldUploadButton
                      uploadPreset="ml_default"
                      onSuccess={handleUploadSuccess}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Upload / Ganti
                    </CldUploadButton>
                  </div>
                </div>
              </div>

              {/* --- EDITOR AREA (TIPTAP) --- */}
              <div>
                <label className="label-input mb-2">Konten Artikel</label>
                {/* Komponen Editor Baru */}
                <TiptapEditor
                  content={formData.content}
                  onChange={handleContentChange}
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
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
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="">Menyimpan...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save size={18} />
                      {formData.status === "published"
                        ? "Terbitkan"
                        : "Simpan Draft"}
                    </span>
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
