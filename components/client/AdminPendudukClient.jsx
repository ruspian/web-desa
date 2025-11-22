"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  FileDown,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../ui/Toast";
import {
  agamaFilter,
  dusunFilter,
  jenisKelaminFilter,
  pendidikanFilter,
} from "@/lib/dataFilter";
import ConfirmModal from "../ui/confirmModal";
import { formatDateDisplay } from "@/lib/date";
import * as XLSX from "xlsx";

export default function AdminPendudukClient({ initialData, pagination }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: null,
    nik: "",
    nama: "",
    jk: "L",
    tglLahir: "",
    tempatLahir: "",
    agama: "Islam",
    pendidikan: "",
    pekerjaan: "",
    dusun: "Krajan",
    status: "Hidup",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentSearch = searchParams.get("query") || "";

    if (debouncedSearch !== currentSearch) {
      if (debouncedSearch) {
        params.set("query", debouncedSearch);
      } else {
        params.delete("query");
      }

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterChange = (alamat) => {
    const params = new URLSearchParams(searchParams);

    if (alamat !== "semua") {
      params.set("alamat", alamat);
    } else {
      params.delete("alamat");
    }

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  //
  const handleValueFormChange = (e) => {
    const { name, value } = e.target;

    // Khusus NIK cuma boleh angka
    if (name === "nik" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const openModal = (data = null) => {
    if (data) {
      setFormData({
        id: data.id,
        nik: data.nik,
        nama: data.nama,
        jk: data.jk,
        tglLahir: data.tglLahir,
        tempatLahir: data.tempatLahir,
        agama: data.agama,
        pendidikan: data.pendidikan,
        pekerjaan: data.pekerjaan,
        dusun: data.dusun,
        status: data.status,
      });
    } else {
      // Reset form untuk data baru
      setFormData({
        id: null,
        nik: "",
        nama: "",
        jk: "L",
        tglLahir: "",
        tempatLahir: "",
        agama: "Islam",
        pendidikan: "",
        pekerjaan: "",
        dusun: "Krajan",
        status: "Hidup",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const method = formData.id ? "PUT" : "POST";

      const response = await fetch("/api/penduduk", {
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

      const data = await response.json();
      toast.success(data.message, "Success");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        error?.message || "Terjadi kesalahan saat menyimpan data!",
        "Error"
      );
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
      const response = await fetch(`/api/penduduk?id=${deleteId}`, {
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

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      toast.info("Sedang menyiapkan data Excel...", "Mohon Tunggu");

      //  Panggil API Export
      const response = await fetch("/api/export/penduduk");

      if (!response.ok) throw new Error("Gagal mengambil data export");

      const { data } = await response.json();

      if (data.length === 0) {
        toast.warning("Tidak ada data untuk diexport.", "Data Kosong");
        return;
      }

      // Buat Worksheet Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penduduk");

      // Download File
      XLSX.writeFile(
        workbook,
        `Data_Penduduk_Desa_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success("File Excel berhasil diunduh!", "Sukses");
    } catch (error) {
      toast.error("Gagal mengunduh file excel.", "Error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Penduduk</h1>
          <p className="text-gray-500 text-sm">
            Master database kependudukan Desa Makmur Jaya.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={() => handleExportExcel()}
            disabled={isExporting}
          >
            <FileDown size={18} /> Export Excel
          </button>
          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
          >
            <UserPlus size={18} /> Tambah Warga
          </button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari Nama atau NIK..."
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2.5 rounded-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[180px] cursor-pointer"
            value={searchParams.get("alamat") || "semua"}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="semua">Semua Dusun</option>
            {dusunFilter.map((dusun) => (
              <option key={dusun.label} value={dusun.value}>
                {dusun.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200">
                  NIK & Nama
                </th>
                <th className="px-6 py-4 border-b border-gray-200">L/P</th>
                <th className="px-6 py-4 border-b border-gray-200">TTL</th>
                <th className="px-6 py-4 border-b border-gray-200">Alamat</th>
                <th className="px-6 py-4 border-b border-gray-200">
                  Pekerjaan
                </th>
                <th className="px-6 py-4 border-b border-gray-200">Status</th>
                <th className="px-6 py-4 border-b border-gray-200 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-3">
                    <div className="font-bold text-gray-800">{item.nama}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wide">
                      {item.nik}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.jk === "L"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-pink-100 text-pink-600"
                      }`}
                    >
                      {item.jk}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    <span className="block text-gray-800 font-medium">
                      {item.tempatLahir}
                    </span>
                    <span className="text-shadow-amber-500">
                      {formatDateDisplay(item.tglLahir)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="block text-gray-600 font-medium">
                      {item.dusun}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.pekerjaan}</td>
                  <td className="px-6 py-3">
                    {item.status === "HIDUP" && (
                      <span className="badge-green">Hidup</span>
                    )}
                    {item.status === "PINDAH" && (
                      <span className="badge-yellow">Pindah</span>
                    )}
                    {item.status === "MENINGGAL" && (
                      <span className="badge-red">Meninggal</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(item)}
                        className="action-btn text-blue-600 bg-blue-50 hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(item.id)}
                        className="action-btn text-red-600 bg-red-50 hover:bg-red-100"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {initialData.length === 0 && (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
              <Search size={48} className="opacity-20 mb-4" />
              <p>Data tidak ditemukan.</p>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Hapus penduduk?"
          message="Penduduk yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
        />

        {/* Footer Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm bg-white">
          <span className="text-gray-500">
            Menampilkan <strong>{pagination.currentPage}</strong> dari{" "}
            <strong>{pagination.totalPage}</strong> halaman
          </span>
          <div className="flex gap-2">
            <button
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="p-2 border rounded-lg hover:bg-gray-50"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal form penduduk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Data Penduduk" : "Tambah Warga Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <form
                id="formPenduduk"
                onSubmit={handleSave}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* IDENTITAS */}
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">
                    Identitas Pribadi
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Nama Lengkap</label>
                  <Input
                    type="text"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleValueFormChange}
                    className="input-field"
                    placeholder="Sesuai KTP"
                  />
                </div>

                <div>
                  <label className="label-text">NIK</label>
                  <Input
                    type="text"
                    name="nik"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleValueFormChange}
                    className="input-field font-mono"
                    placeholder="16 Digit"
                  />
                </div>

                <div>
                  <label className="label-text">Jenis Kelamin</label>
                  <select
                    name="jk"
                    value={formData.jk}
                    onChange={handleValueFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
                  >
                    {jenisKelaminFilter.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-text">Tempat Lahir</label>
                  <Input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleValueFormChange}
                    className="input-field"
                    placeholder="Tempat Lahir"
                  />
                </div>

                <div>
                  <label className="label-text">Tanggal Lahir</label>
                  <Input
                    type="date"
                    name="tglLahir"
                    value={formData.tglLahir}
                    onChange={handleValueFormChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Agama</label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleValueFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
                  >
                    <option value="">Pilih Agama</option>
                    {agamaFilter.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">Pendidikan</label>
                  <select
                    name="pendidikan"
                    value={formData.pendidikan}
                    onChange={handleValueFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
                  >
                    <option value="">Pilih Pendidikan</option>
                    {pendidikanFilter.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* GROUP: ALAMAT & STATUS */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">
                    Domisili & Status
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Pekerjaan</label>
                  <Input
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleValueFormChange}
                    className="input-field"
                    placeholder="Contoh: Petani"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Dusun</label>
                  <select
                    name="dusun"
                    value={formData.dusun}
                    onChange={handleValueFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
                  >
                    <option value="">Pilih Alamat</option>
                    {dusunFilter.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Status Penduduk</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleValueFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
                  >
                    <option value="">Pilih Status</option>
                    <option value="HIDUP">Hidup (Menetap)</option>
                    <option value="PINDAH">Pindah Keluar</option>
                    <option value="MENINGGAL">Meninggal Dunia</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="formPenduduk"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-colors"
              >
                <Save size={18} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-text {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-800;
        }
        .badge-green {
          @apply text-emerald-700 font-bold text-[10px] uppercase bg-emerald-100 px-2 py-1 rounded-md;
        }
        .badge-yellow {
          @apply text-yellow-700 font-bold text-[10px] uppercase bg-yellow-100 px-2 py-1 rounded-md;
        }
        .badge-red {
          @apply text-red-700 font-bold text-[10px] uppercase bg-red-100 px-2 py-1 rounded-md;
        }
        .action-btn {
          @apply p-2 rounded-lg transition-colors flex items-center justify-center;
        }
      `}</style>
    </div>
  );
}
