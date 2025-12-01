"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Save,
  X,
  Loader2,
  Search,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import Pagination from "../ui/pagination";
import { formatRupiah } from "@/lib/formatRupiah";
import ConfirmModal from "../ui/confirmModal";

// DAFTAR KATEGORI BAKU
const INCOME_CATEGORIES = [
  "Pendapatan Asli Desa (PAD)",
  "Dana Desa (DD)",
  "Alokasi Dana Desa (ADD)",
  "Bagi Hasil Pajak & Retribusi",
  "Bantuan Keuangan Provinsi",
  "Bantuan Keuangan Kabupaten",
  "Lain-lain Pendapatan Sah",
];

const EXPENSE_CATEGORIES = [
  "Bidang Penyelenggaraan Pemerintahan",
  "Bidang Pelaksanaan Pembangunan",
  "Bidang Pembinaan Kemasyarakatan",
  "Bidang Pemberdayaan Masyarakat",
  "Bidang Penanggulangan Bencana",
];

export default function AdminApbdesClient({
  initialData,
  initialYear,
  summary,
  pagination,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // --- STATE ---
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  const currentTab = searchParams.get("tab") || "income";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    tahun: initialYear,
    jenis: currentTab,
    kategori: "",
    anggaran: 0,
    realisasi: 0,
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

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleYearChange = (newYear) => {
    const params = new URLSearchParams(searchParams);
    params.set("tahun", newYear);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // ambil tahun setahun kedepan dan 4 tahun sesudah
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + 1 - i);

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        tahun: item.tahun,
        jenis: item.jenis,
        kategori: item.kategori,
        anggaran: item.anggaran,
        realisasi: item.realisasi,
      });
    } else {
      setFormData({
        id: null,
        tahun: initialYear,
        jenis: currentTab,
        kategori: "", // Reset kategori biar admin pilih baru
        anggaran: 0,
        realisasi: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/apbdes", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast.success("Data Anggaran berhasil disimpan!");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/apbdes?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Data dihapus");
      setIsDeleteOpen(false);
      router.refresh();
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
            Keuangan Desa (APBDes)
          </h1>
          <p className="text-gray-500 text-sm">
            Input Anggaran dan Realisasi untuk transparansi publik.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={initialYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                TA {year}
              </option>
            ))}
          </select>

          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} /> Tambah Data
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">
              Total Pendapatan
            </p>
            <h3 className="text-xl font-bold text-emerald-600">
              {formatRupiah(summary.totalIncome)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">
              Total Belanja
            </p>
            <h3 className="text-xl font-bold text-red-600">
              {formatRupiah(summary.totalExpense)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl shadow-lg flex items-center justify-between text-white">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">
              {summary.surplus >= 0 ? "Surplus Anggaran" : "Defisit Anggaran"}
            </p>
            <h3
              className={`text-xl font-bold ${
                summary.surplus >= 0 ? "text-blue-400" : "text-red-400"
              }`}
            >
              {formatRupiah(summary.surplus)}
            </h3>
          </div>
          <div className="w-10 h-10 bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center">
            <Wallet size={20} />
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row border-b border-gray-100">
          <div className="flex flex-1">
            <button
              onClick={() => handleTabChange("income")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all 
                    ${
                      currentTab === "income"
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
            >
              <TrendingUp size={18} /> Pendapatan Desa
            </button>
            <button
              onClick={() => handleTabChange("expense")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all 
                    ${
                      currentTab === "expense"
                        ? "text-red-600 border-b-2 border-red-600 bg-red-50/30"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
            >
              <TrendingDown size={18} /> Belanja Desa
            </button>
          </div>
          <div className="p-2 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari uraian..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Pos Anggaran / Kategori</th>
                <th className="px-6 py-4 text-right">Pagu Anggaran</th>
                <th className="px-6 py-4 text-right">Realisasi (Terpakai)</th>
                <th className="px-6 py-4 text-center">% Capaian</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialData.map((item) => {
                const persen =
                  item.anggaran > 0
                    ? Math.round((item.realisasi / item.anggaran) * 100)
                    : 0;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-600">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                      {formatRupiah(item.realisasi)}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              persen > 90
                                ? "bg-green-500"
                                : persen > 50
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                            style={{ width: `${Math.min(persen, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">
                          {persen}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Belum ada data anggaran{" "}
                    {currentTab === "income" ? "Pendapatan" : "Belanja"} tahun{" "}
                    {initialYear}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Hapus Data?"
          message="Data yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100">
            <Pagination
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* MODAL FORM  */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Pagu Anggaran" : "Tambah Pos Anggaran"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Tahun Anggaran</label>
                  <input
                    type="text"
                    className="input-field bg-gray-100"
                    value={formData.tahun}
                    readOnly
                  />
                </div>
                <div>
                  <label className="label-input">Jenis</label>
                  {/* Disable jenis kalau edit, biar gak error logic */}
                  <select
                    className="input-field bg-white"
                    value={formData.jenis}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenis: e.target.value,
                        kategori: "",
                      })
                    }
                    disabled={!!formData.id}
                  >
                    <option value="income">Pendapatan</option>
                    <option value="expense">Belanja</option>
                  </select>
                </div>
              </div>

              {/* INPUT KATEGORI */}
              <div>
                <label className="label-input">Pos Anggaran / Bidang</label>
                <select
                  className="input-field bg-white"
                  required
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                >
                  <option value="">-- Pilih Pos Anggaran --</option>
                  {formData.jenis === "income"
                    ? INCOME_CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))
                    : EXPENSE_CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="label-input">Pagu Anggaran (Target Rp)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input-field pl-14 font-mono text-lg"
                    required
                    value={formData.anggaran}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anggaran: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* INFO REALISASI (READ ONLY) */}
              {formData.id && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                    Realisasi Terkini
                  </p>
                  <p className="text-lg font-mono font-bold text-blue-900">
                    {formatRupiah(formData.realisasi)}
                  </p>
                  <p className="text-[10px] text-blue-500 mt-1">
                    *Data ini otomatis dihitung dari menu &quot;Realisasi &
                    Transaksi&quot;.
                  </p>
                </div>
              )}

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
                    <span className="flex text-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="">Menyimpan...</span>
                    </span>
                  ) : (
                    <span className="flex text-center justify-center gap-2">
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
