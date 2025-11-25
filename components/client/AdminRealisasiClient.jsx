"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Download,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  X,
  UploadCloud,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CldUploadButton } from "next-cloudinary";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { formatRupiah } from "@/lib/formatRupiah";

export default function AdminRealisasiClient({
  initialTransactions,
  chartData,
  saldoKas,
  lastUpdate,
  budgetCategories, // Data Kategori dari APBDes
  pagination,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // State URL Sync
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const filterTipe = searchParams.get("tipe") || "all";

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0], // Default hari ini
    uraian: "",
    kategori: "",
    tipe: "expense",
    nominal: "",
    bukti: "",
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

  const handleFilterTipe = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val !== "all") params.set("tipe", val);
    else params.delete("tipe");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Filter Kategori untuk Dropdown
  const availableCategories = budgetCategories.filter(
    (c) =>
      // Pastikan tipe di database sesuai dengan tipe yang dipilih
      c.type.toLowerCase() === formData.tipe.toLowerCase()
  );

  // --- ACTIONS (API) ---
  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({ ...prev, bukti: result.info.secure_url }));
    toast.success("Bukti kwitansi berhasil diupload!");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        nominal: parseInt(formData.nominal),
      };

      const res = await fetch("/api/realisasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan transaksi");

      toast.success("Transaksi berhasil dicatat & Anggaran terupdate!");
      router.refresh();
      setIsModalOpen(false);

      // Reset Form
      setFormData({
        tanggal: new Date().toISOString().split("T")[0],
        uraian: "",
        kategori: "",
        tipe: formData.tipe, // Biarkan tipe terakhir tetap terpilih
        nominal: "",
        bukti: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus log transaksi ini? Saldo anggaran akan dikembalikan."))
      return;
    try {
      const res = await fetch(`/api/realisasi?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus");
      toast.success("Data dihapus & Saldo dikembalikan");
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Realisasi & Transaksi
          </h1>
          <p className="text-gray-500 text-sm">
            Catatan kas harian (Buku Kas Umum). Total Data:{" "}
            {pagination.totalItems}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Download size={18} /> Laporan PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
          >
            <Plus size={18} /> Catat Transaksi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KIRI: TABEL TRANSAKSI (List) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari uraian..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer min-w-[150px]"
              value={filterTipe}
              onChange={(e) => handleFilterTipe(e.target.value)}
            >
              <option value="all">Semua Transaksi</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          {/* List Cards */}
          <div className="space-y-3">
            {initialTransactions.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 hover:border-emerald-100 transition-colors group"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      item.tipe === "income"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.tipe === "income" ? (
                      <ArrowDownRight size={24} />
                    ) : (
                      <ArrowUpRight size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                      {item.uraian}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {item.kategori}
                      </span>
                      <span>
                        •{" "}
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                  <span
                    className={`font-mono font-bold ${
                      item.tipe === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.tipe === "income" ? "+" : "-"}{" "}
                    {formatRupiah(item.nominal)}
                  </span>
                  <div className="flex gap-3 mt-1 items-center">
                    {item.bukti && (
                      <a
                        href={item.bukti}
                        target="_blank"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <FileText size={12} /> Bukti
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {initialTransactions.length === 0 && (
              <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                Belum ada transaksi tercatat.
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Halaman <b>{pagination.currentPage}</b> dari{" "}
                {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* KANAN: CHART & STATS */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} /> Tren Arus Kas
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="bulan"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [
                      `${new Intl.NumberFormat("id-ID").format(value)}`,
                      "",
                    ]}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  <Bar
                    dataKey="pendapatan"
                    name="Masuk"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="belanja"
                    name="Keluar"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h4 className="text-sm font-medium text-slate-300 mb-1">
              Saldo Kas Desa
            </h4>
            <h2
              className={`text-3xl font-bold mb-4 ${
                saldoKas < 0 ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {formatRupiah(saldoKas)}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 p-2 rounded-lg w-fit">
              <Calendar size={14} />
              Update: {new Date(lastUpdate).toLocaleDateString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL INPUT TRANSAKSI === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Catat Transaksi Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 overflow-y-auto"
            >
              {/* Toggle Tipe */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, tipe: "expense", kategori: "" })
                  }
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    formData.tipe === "expense"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, tipe: "income", kategori: "" })
                  }
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    formData.tipe === "income"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="label-input">Tanggal Transaksi</label>
                <input
                  type="date"
                  className="input-field"
                  required
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-input">Uraian Kegiatan</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="Contoh: Beli Semen / Honor Tukang"
                  value={formData.uraian}
                  onChange={(e) =>
                    setFormData({ ...formData, uraian: e.target.value })
                  }
                />
              </div>

              {/* INPUT KATEGORI DINAMIS (PENTING: INI YANG DITUNGGU) */}
              <div>
                <label className="label-input">
                  Kategori Anggaran (Sumber/Pos)
                </label>
                <select
                  className="input-field bg-white"
                  required
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                >
                  <option value="">-- Pilih Pos Anggaran --</option>

                  {/* Render Opsi dari Database yang difilter berdasarkan tipe */}
                  {availableCategories.length > 0 ? (
                    availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.label}>
                        {cat.label}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      Belum ada data anggaran{" "}
                      {formData.tipe === "income" ? "Pendapatan" : "Belanja"}{" "}
                      tahun ini.
                    </option>
                  )}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  *Pilih kategori yang sesuai agar APBDes otomatis terupdate.
                </p>
              </div>

              <div>
                <label className="label-input">Nominal (Rp)</label>
                <input
                  type="number"
                  className="input-field font-mono text-lg"
                  required
                  placeholder="0"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                />
              </div>

              {/* Upload Bukti */}
              <div>
                <label className="label-input">
                  Bukti Kwitansi / Nota (Opsional)
                </label>
                {formData.bukti ? (
                  <div className="relative h-32 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                    <Image
                      src={formData.bukti}
                      alt="Bukti"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, bukti: "" }))
                        }
                        className="text-white bg-red-500 px-3 py-1 rounded text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <CldUploadButton
                    uploadPreset="ml_default"
                    onSuccess={handleUploadSuccess}
                    className="w-full"
                  >
                    <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all cursor-pointer">
                      <UploadCloud size={20} className="mb-1" />
                      <span className="text-xs font-bold">Upload Foto</span>
                    </div>
                  </CldUploadButton>
                )}
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
                  className="btn-primary"
                  disabled={isSaving}
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
