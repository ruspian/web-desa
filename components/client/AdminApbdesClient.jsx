"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  X,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/formatRupiah";
import ConfirmModal from "../ui/confirmModal";

export default function AdminApbdesClient({ initialData, initialYear }) {
  const router = useRouter();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("income"); // income | expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Ambil tahun sekarang, bikin list dari Tahun Depan sampai 4 Tahun lalu
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + 1 - i);

  // --- KALKULASI OTOMATIS PEMBELANJAAN & PENDAPATAN
  const summary = useMemo(() => {
    const totalIncome = initialData
      .filter((item) => item.jenis === "income")
      .reduce((acc, curr) => acc + curr.anggaran, 0);

    const totalExpense = initialData
      .filter((item) => item.jenis === "expense")
      .reduce((acc, curr) => acc + curr.anggaran, 0);

    // Kalau Belanja nambah, Surplus otomatis berkurang.
    const surplus = totalIncome - totalExpense;

    return { totalIncome, totalExpense, surplus };
  }, [initialData]);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    tahun: initialYear,
    jenis: "income",
    kategori: "",
    anggaran: 0,
    realisasi: 0,
  });

  // Filter Data Client-Side untuk Tabel
  const filteredData = initialData.filter((item) => item.jenis === activeTab);

  const handleYearChange = (newYear) => {
    router.replace(`/admin/apbdes?tahun=${newYear}`);
  };

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
        jenis: activeTab,
        kategori: "",
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
            Keuangan Desa (APBDes)
          </h1>
          <p className="text-gray-500 text-sm">
            Input Anggaran dan Realisasi untuk transparansi publik.
          </p>
        </div>
        <div className="flex gap-3">
          {/* DROPDOWN TAHUN OTOMATIS */}
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

      {/* SUMMARY CARDS  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Pendapatan */}
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

        {/* Card Belanja */}
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

        {/* Card Surplus/Defisit */}
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

      {/* TABS & TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("income")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${
                      activeTab === "income"
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30"
                        : "text-gray-500 hover:bg-gray-50"
                    }
                `}
          >
            <TrendingUp size={18} /> Pendapatan Desa
          </button>
          <button
            onClick={() => setActiveTab("expense")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${
                      activeTab === "expense"
                        ? "text-red-600 border-b-2 border-red-600 bg-red-50/30"
                        : "text-gray-500 hover:bg-gray-50"
                    }
                `}
          >
            <TrendingDown size={18} /> Belanja Desa
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Uraian / Kategori</th>
                <th className="px-6 py-4 text-right">Anggaran (Pagu)</th>
                <th className="px-6 py-4 text-right">Realisasi (Terpakai)</th>
                <th className="px-6 py-4 text-center">% Capaian</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => {
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

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Belum ada data{" "}
                    {activeTab === "income" ? "Pendapatan" : "Belanja"} tahun{" "}
                    {initialYear}.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Footer Total Per Kategori */}
            {filteredData.length > 0 && (
              <tfoot className="bg-gray-50 font-bold text-gray-800">
                <tr>
                  <td className="px-6 py-4">TOTAL</td>
                  <td className="px-6 py-4 text-right">
                    {formatRupiah(
                      filteredData.reduce((acc, curr) => acc + curr.anggaran, 0)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-700">
                    {formatRupiah(
                      filteredData.reduce(
                        (acc, curr) => acc + curr.realisasi,
                        0
                      )
                    )}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Data?"
        message="Data ini akan dihapus permanen."
      />

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Data Anggaran" : "Tambah Mata Anggaran"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
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
                  <select
                    className="input-field bg-white"
                    value={formData.jenis}
                    onChange={(e) =>
                      setFormData({ ...formData, jenis: e.target.value })
                    }
                  >
                    <option value="income">Pendapatan</option>
                    <option value="expense">Belanja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-input">Uraian / Kategori</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="Contoh: Bidang Pembangunan Jalan"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label-input">Jumlah Anggaran (Pagu)</label>
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

              <div>
                <label className="label-input">Realisasi Saat Ini</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input-field pl-14 font-mono text-lg"
                    required
                    value={formData.realisasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        realisasi: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  *Update kolom ini setiap bulan untuk grafik progres.
                </p>
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
                    "Simpan Data"
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
