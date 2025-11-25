"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Filter,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import Pagination from "../ui/pagination";
import ConfirmModal from "../ui/confirmModal";
import { formatDateDisplay, getDayMonth } from "@/lib/date";

export default function AdminAgendaClient({ initialData, pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // State
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const filterCat = searchParams.get("category") || "Semua";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "Pemerintahan",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("query") || "")) {
      if (debouncedSearch) params.set("query", debouncedSearch);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat !== "Semua") params.set("category", cat);
    else params.delete("category");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/informasi/agenda?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Agenda dihapus!");
      router.refresh();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: null,
        title: "",
        category: "Pemerintahan",
        date: "",
        time: "",
        location: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/agenda", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan agenda");

      toast.success("Agenda berhasil disimpan!");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper Warna Kategori
  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Kesehatan":
        return "bg-pink-100 text-pink-600 border-pink-200";
      case "Pemerintahan":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "Gotong Royong":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "Ekonomi":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "Keagamaan":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agenda Kegiatan</h1>
          <p className="text-gray-500 text-sm">
            Total Agenda: {pagination.totalItems} Kegiatan
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={20} /> Tambah Agenda
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama kegiatan..."
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
            <option value="Pemerintahan">Pemerintahan</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Gotong Royong">Gotong Royong</option>
            <option value="Ekonomi">Ekonomi</option>
            <option value="Keagamaan">Keagamaan</option>
          </select>
        </div>
      </div>

      {/* EVENT LIST */}
      <div className="space-y-4">
        {initialData.map((item) => {
          const { day, month } = getDayMonth(item.date);

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:border-emerald-200 transition-colors group"
            >
              {/* Date Box */}
              <div className="shrink-0 w-full md:w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <span className="text-2xl font-bold">{day}</span>
                <span className="text-xs font-bold uppercase">{month}</span>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin size={14} /> {item.location}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                <button
                  onClick={() => openModal(item)}
                  className="p-2.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(item.id);
                    setIsDeleteOpen(true);
                  }}
                  className="p-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {initialData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400">Belum ada agenda terjadwal.</p>
          </div>
        )}

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Hapus Agenda?"
          message="Agenda yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
        />

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100">
            <Pagination
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Agenda" : "Buat Agenda Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div>
                <label className="label-input">Nama Kegiatan</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Kerja Bakti"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Kategori</label>
                  <select
                    className="input-field bg-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Pemerintahan</option>
                    <option>Kesehatan</option>
                    <option>Gotong Royong</option>
                    <option>Ekonomi</option>
                    <option>Keagamaan</option>
                  </select>
                </div>
                <div>
                  <label className="label-input">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Waktu / Jam</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="08:00 WIB"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">Lokasi</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="Balai Desa"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label-input">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Jelaskan detail kegiatan..."
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
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="">Menyimpan...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save size={18} />
                      Simpan
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
