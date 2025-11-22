"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Save,
  X,
  UserCircle,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../ui/Toast";
import ConfirmModal from "../ui/confirmModal";
import Pagination from "../ui/pagination";
import { Button } from "../ui/button";

export default function AdminLembagaClient({ initialData, pagination }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    singkatan: "",
    ketua: "",
    anggota: 0,
    warna: "blue",
    deskripsi: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams); // <- buat parameter baru
    const currentQuery = searchParams.get("query") || "";

    if (debouncedSearch !== currentQuery) {
      if (debouncedSearch) {
        params.set("query", debouncedSearch);
      } else {
        params.delete("query");
      }

      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, searchParams, router, pathname]);

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        nama: item.nama,
        singkatan: item.singkatan,
        ketua: item.ketua,
        anggota: item.anggota,
        warna: item.warna,
        deskripsi: item.deskripsi,
      });
    } else {
      setFormData({
        id: null,
        nama: "",
        singkatan: "",
        ketua: "",
        anggota: 0,
        warna: "blue",
        deskripsi: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch("/api/lembaga", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        toast.error(errData.message || "Gagal menyimpan data!", "Error");
        return;
      }

      toast.success("Data berhasil disimpan!", "Success");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.message || "Terjadi kesalahan", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/lembaga?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        toast.error(errData.message || "Gagal menghapus data!", "Error");
        return;
      }

      const data = await response.json();
      toast.success(data.message || "Data berhasil dihapus!", "Success");

      setIsDeleteOpen(false);
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Terjadi kesalahan", "Error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper buat Styling Warna Dinamis
  const getColorClass = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-emerald-100 text-emerald-600 border-emerald-200",
      red: "bg-red-100 text-red-600 border-red-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      pink: "bg-pink-100 text-pink-600 border-pink-200",
      indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lembaga Desa</h1>
          <p className="text-gray-500 text-sm">
            Kelola profil mitra kerja pemerintah desa (BPD, LPM, PKK, dll).
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
        >
          <Plus size={20} /> Tambah Lembaga
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
        <Search className="absolute left-6 top-7 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama lembaga..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              {/* Icon Box dengan Warna Dinamis */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl tracking-wider border-2 ${getColorClass(
                  item.warna
                )}`}
              >
                {item.singkatan}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDeleteClick(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {item.nama}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
              {item.deskripsi}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <UserCircle size={16} className="text-gray-400" />
                {item.ketua}
              </div>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 flex items-center gap-1">
                <Users size={12} /> {item.anggota} Anggota
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL HAPUS */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Lembaga Desa?"
        message="Lembaga desa yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
      />

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
      )}

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Lembaga" : "Tambah Lembaga Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="label-input">Nama Lembaga</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.nama}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Contoh: Karang Taruna"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Singkatan</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                    value={formData.singkatan}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, singkatan: e.target.value })
                    }
                    placeholder="KT"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="label-input">Tema Warna</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
                    value={formData.warna}
                    onChange={(e) =>
                      setFormData({ ...formData, warna: e.target.value })
                    }
                  >
                    <option value="blue">Biru</option>
                    <option value="pink">Pink</option>
                    <option value="orange">Orange</option>
                    <option value="green">Hijau</option>
                    <option value="indigo">Indigo</option>
                    <option value="red">Merah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Nama Ketua</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.ketua}
                    onChange={(e) =>
                      setFormData({ ...formData, ketua: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">Jml. Anggota</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.anggota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anggota: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label-input">Tugas Pokok</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  placeholder="Jelaskan fungsi lembaga ini..."
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary cursor-pointer"
                variant="outline"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                className="btn-primary cursor-pointer"
              >
                <Save size={18} />
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-input {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm;
        }
        .btn-primary {
          @apply px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2;
        }
        .btn-secondary {
          @apply px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200;
        }
      `}</style>
    </div>
  );
}
