"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Image as ImageIcon,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { useToast } from "@/components/ui/Toast";
import { useDebounce } from "use-debounce";
import ConfirmModal from "../ui/confirmModal";
import PotensiDesaList from "../PotensiDesaList";
import Pagination from "../ui/pagination";

export default function AdminPotensiClient({ initialData, pagination }) {
  // State
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "Wisata",
    description: "",
    image: "",
    location: "",
  });

  //  SYNC URL DENGAN SEARCH
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentQuery = searchParams.get("q") || "";

    if (debouncedSearch !== currentQuery) {
      if (debouncedSearch) {
        params.set("q", debouncedSearch);
      } else {
        params.delete("q");
      }
      params.set("page", "1"); // Reset ke halaman 1 saat search berubah
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  //  HANDLE UPLOAD CLOUDINARY
  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({
      ...prev,
      image: result.info.secure_url,
    }));
    toast.success("Foto berhasil diupload!", "Success");
  };

  //  HANDLE FILTER CATEGORY
  const handleFilterChange = (category) => {
    //  Ambil seluruh parameter URL yang sedang aktif saat ini
    const params = new URLSearchParams(searchParams.toString());

    // Atur key cat secara spesifik
    if (category !== "semua") {
      params.set("cat", category);
    } else {
      params.delete("cat"); // Hapus ?cat= jika memilih "semua"
    }

    //  Reset ke halaman 1
    params.set("page", "1");

    // Update URL
    router.replace(`${pathname}?${params.toString()}`);
  };

  // HANDLE PAGINATION
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`); // Gunakan push agar bisa di-back browser
  };

  //  MODAL LOGIC
  const openModal = (item = null) => {
    if (item) {
      // Mode Edit => kalo ada item
      setFormData({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description || "",
        image: item.image || "",
        location: item.location || "",
      });
    } else {
      // Mode Tambah => kalo gak ada item
      setFormData({
        id: null,
        title: "",
        category: "Wisata",
        description: "",
        image: "",
        location: "",
      });
    }
    setIsModalOpen(true);
  };

  // SAVE DATA
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.info("Foto belum diupload!", "Info");
      return;
    }

    setIsSaving(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/potensi", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || "Gagal menyimpan data!", "Error");
        return;
      }

      toast.success("Data berhasil disimpan!", "Success");

      router.refresh(); // Refresh data server
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error || error.message, "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  //  DELETE DATA
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/potensi?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Data berhasil dihapus!", "Success");

      setIsDeleteOpen(false);
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      toast.error(error || error.message, "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getBadgeColor = (cat) => {
    switch (cat) {
      case "Wisata":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pertanian":
        return "bg-green-100 text-green-700 border-green-200";
      case "Ekonomi Kreatif":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Seni Budaya":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Potensi Desa</h1>
          <p className="text-gray-500 text-sm">
            Kelola data wisata dan produk unggulan.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          <Plus size={20} /> Tambah Potensi
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama potensi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[150px]"
          value={searchParams.get("cat") || "semua"}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="semua">Semua Kategori</option>
          <option value="Wisata">Wisata</option>
          <option value="Pertanian">Pertanian</option>
          <option value="Ekonomi Kreatif">Ekonomi Kreatif</option>
          <option value="Seni Budaya">Seni Budaya</option>
        </select>
      </div>

      {/* LIST DATA */}
      <div className="grid grid-cols-1 gap-4">
        {initialData.map((item) => (
          <PotensiDesaList
            key={item.id}
            item={item}
            openModal={openModal}
            onDeleteClick={onDeleteClick}
            getBadgeColor={getBadgeColor}
          />
        ))}

        {initialData.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <p>Belum ada data potensi.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Potensi?"
        message="Potensi yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
      />

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
      )}

      {/*MODAL*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Potensi" : "Tambah Potensi Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-400 hover:text-gray-700" size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {/* Nama */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nama Potensi
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Curug Indah"
                />
              </div>

              {/* Kategori & Lokasi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Kategori
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Wisata">Wisata</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Ekonomi Kreatif">Ekonomi Kreatif</option>
                    <option value="Seni Budaya">Seni Budaya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Lokasi"
                  />
                </div>
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Foto Utama
                </label>

                {formData.image ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {/* Tombol Ganti Gambar & Hapus */}
                      <button
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-600"
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
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-500 cursor-pointer transition-all">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-sm font-medium">
                        Klik untuk upload gambar
                      </span>
                      <span className="text-xs mt-1 text-gray-300">
                        Max 5MB (JPG/PNG)
                      </span>
                    </div>
                  </CldUploadButton>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsikan potensi ini secara detail..."
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
