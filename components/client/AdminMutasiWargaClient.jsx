"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Calendar,
  Baby,
  HeartCrack,
  Truck,
  Home,
  X,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  FileDown,
  AlertCircle,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import * as XLSX from "xlsx";
import StatCard from "../StatCard";
import ConfirmModal from "../ui/confirmModal";
import Pagination from "../ui/pagination";

export default function AdminMutasiWargaClient({
  initialData,
  pagination,
  residentList,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // Filter URL
  const currentFilter = searchParams.get("jenis") || "semua";
  const currentMonth = searchParams.get("bulan") || "";

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const initialFormState = {
    nama: "",
    nik: "",
    jenis: "Kelahiran",
    tanggal: new Date().toISOString().split("T")[0],
    ket: "",
    pendudukId: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Search Dropdown State
  const [searchResident, setSearchResident] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);

  const [selectedYear, setSelectedYear] = useState(
    currentMonth ? currentMonth.split("-")[0] : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth ? currentMonth.split("-")[1] : ""
  );

  // --- HELPER DATA ---
  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const currentYearInt = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) =>
    (currentYearInt - 5 + i).toString()
  ).reverse();

  // --- HANDLERS ---

  const handleCustomDateFilter = (key, val) => {
    let newM = selectedMonth;
    let newY = selectedYear;

    if (key === "month") {
      setSelectedMonth(val);
      newM = val;
    }
    if (key === "year") {
      setSelectedYear(val);
      newY = val;
    }

    if (newM && newY) {
      updateUrl("bulan", `${newY}-${newM}`);
    } else if (!newM && !newY) {
      updateUrl("bulan", "");
    }
  };

  const updateUrl = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "semua") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (jenis) => updateUrl("jenis", jenis);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // EXPORT EXCEL
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const jenis = searchParams.get("jenis") || "semua";
      const bulan = searchParams.get("bulan") || "";

      const res = await fetch(
        `/api/export/mutasi?jenis=${jenis}&bulan=${bulan}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data");

      const { data } = await res.json();

      if (!data || data.length === 0) {
        toast.warning("Tidak ada data untuk diexport", "Data Kosong");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Mutasi");
      XLSX.writeFile(workbook, `Laporan_Mutasi_${bulan || "Semua"}.xlsx`);
      toast.success("File berhasil diunduh!", "Sukses");
    } catch (error) {
      toast.error("Gagal export excel");
    } finally {
      setIsExporting(false);
    }
  };

  // CARI PENDUDUK
  const filteredResidents = useMemo(() => {
    if (!searchResident || searchResident.length < 2) return [];
    const lower = searchResident.toLowerCase();
    // jika input angka cari NIK, jika huruf cari Nama
    const isNumeric = /^\d+$/.test(lower);

    return residentList
      .filter((r) => {
        if (isNumeric) return r.nik.includes(lower);
        return r.nama.toLowerCase().includes(lower);
      })
      .slice(0, 5);
  }, [searchResident, residentList]);

  const handleSelectResident = (resident) => {
    setSelectedResident(resident);
    setSearchResident(resident.nama);
    setFormData((prev) => ({
      ...prev,
      nama: resident.nama,
      nik: resident.nik,
      pendudukId: resident.id,
    }));
  };

  // SIMPAN
  const handleSave = async (e) => {
    e.preventDefault();

    // Cegah input manual tanpa ID untuk Kematian/Pindah Keluar
    const isStrictSelection = ["Kematian", "Pindah Keluar"].includes(
      formData.jenis
    );
    if (isStrictSelection && !formData.pendudukId) {
      toast.error(
        "Wajib memilih nama dari database!",
        `Untuk ${formData.jenis}, data warga harus terdaftar.`
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        jenis: formData.jenis,
        tanggal: formData.tanggal,
        keterangan: formData.ket,
        pendudukId: selectedResident ? selectedResident.id : null,
        namaWarga: formData.nama,
        nik: formData.nik,
      };

      const res = await fetch("/api/mutasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast.success("Data mutasi berhasil dicatat!");
      router.refresh();
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setSelectedResident(null);
    setSearchResident("");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/mutasi?id=${deleteId}`, {
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

  // --- UI HELPERS ---
  const getBadgeInfo = (jenis) => {
    switch (jenis) {
      case "Kelahiran":
        return { color: "bg-blue-100 text-blue-700", icon: <Baby size={14} /> };
      case "Pindah Masuk":
        return {
          color: "bg-emerald-100 text-emerald-700",
          icon: <Home size={14} />,
        };
      case "Kematian":
        return {
          color: "bg-red-100 text-red-700",
          icon: <HeartCrack size={14} />,
        };
      case "Pindah Keluar":
        return {
          color: "bg-orange-100 text-orange-700",
          icon: <Truck size={14} />,
        };
      default:
        return { color: "bg-gray-100", icon: null };
    }
  };

  // Quick stats calculation
  const stats = {
    lahir: initialData.filter((i) => i.jenis === "Kelahiran").length,
    mati: initialData.filter((i) => i.jenis === "Kematian").length,
    masuk: initialData.filter((i) => i.jenis === "Pindah Masuk").length,
    keluar: initialData.filter((i) => i.jenis === "Pindah Keluar").length,
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mutasi Warga</h1>
          <p className="text-gray-500 text-sm mt-1">
            Data dinamika kependudukan desa
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="bg-white border border-gray-200 text-green-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileDown size={16} />
            )}
            Export Excel
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors text-sm"
          >
            <Plus size={16} /> Catat Peristiwa
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Kelahiran"
          count={stats.lahir}
          icon={<Baby size={20} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Kematian"
          count={stats.mati}
          icon={<HeartCrack size={20} />}
          color="bg-red-500"
        />
        <StatCard
          title="Pendatang"
          count={stats.masuk}
          icon={<Home size={20} />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Pindah"
          count={stats.keluar}
          icon={<Truck size={20} />}
          color="bg-orange-500"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* FILTER BAR */}
        <div className="flex flex-col lg:flex-row border-b border-gray-100 bg-gray-50/50">
          <div className="flex overflow-x-auto scrollbar-hide flex-1">
            {[
              "semua",
              "Kelahiran",
              "Kematian",
              "Pindah Masuk",
              "Pindah Keluar",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap capitalize border-b-2 
                  ${
                    currentFilter === tab
                      ? "text-emerald-700 border-emerald-600 bg-emerald-50/50"
                      : "text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center p-3">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <select
                value={selectedMonth}
                onChange={(e) =>
                  handleCustomDateFilter("month", e.target.value)
                }
                className="text-sm border-none bg-transparent focus:ring-0 text-gray-700 font-medium cursor-pointer py-1"
              >
                <option value="">Bulan</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <div className="h-4 w-px bg-gray-300"></div>
              <select
                value={selectedYear}
                onChange={(e) => handleCustomDateFilter("year", e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-gray-700 font-medium cursor-pointer py-1"
              >
                <option value="">Tahun</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {(selectedMonth || selectedYear) && (
              <button
                onClick={() => {
                  setSelectedMonth("");
                  setSelectedYear("");
                  updateUrl("bulan", "");
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset Tanggal"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Jenis & Warga</th>
                <th className="px-6 py-4">Tanggal Kejadian</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-center">Status DB</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialData.map((item) => {
                const badge = getBadgeInfo(item.jenis);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${badge.color}`}
                        >
                          {badge.icon} {item.jenis}
                        </span>
                        <div>
                          <div className="font-bold text-gray-800 text-base">
                            {item.namaWarga}
                          </div>
                          {item.nik && item.nik !== "-" && (
                            <div className="text-xs text-gray-400 font-mono tracking-wide">
                              {item.nik}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 italic max-w-xs wrap-break-words">
                      {item.keterangan || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.jenis === "Kelahiran" ||
                      item.jenis === "Pindah Masuk" ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          + Warga
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                          - Warga
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setDeleteId(item.id);
                        }}
                        className="text-gray-300 hover:text-red-500 p-2 transition-colors hover:bg-red-50 rounded-lg"
                        title="Hapus Data"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {initialData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <Search className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium">
              Belum ada data mutasi untuk periode ini.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Cobalah mengganti filter bulan atau jenis mutasi.
            </p>
          </div>
        )}

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Hapus Data Mutasi?"
          message="Apakah anda yakin ingin menghapus data mutasi ini?"
        />

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">
                Catat Peristiwa Penting
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="text-gray-400 hover:text-gray-700" size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-5 overflow-y-auto"
            >
              {/* Select Jenis */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Jenis Peristiwa
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  value={formData.jenis}
                  onChange={(e) => {
                    setFormData({ ...initialFormState, jenis: e.target.value });
                    setSelectedResident(null);
                    setSearchResident("");
                  }}
                >
                  <option value="Kelahiran">Kelahiran (Lahir)</option>
                  <option value="Kematian">Kematian (Meninggal)</option>
                  <option value="Pindah Masuk">Pindah Masuk (Pendatang)</option>
                  <option value="Pindah Keluar">Pindah Keluar (Pergi)</option>
                </select>

                {/* Info Text Dynamic */}
                <div className="mt-2 text-xs flex gap-2 items-start text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  {formData.jenis === "Kelahiran" &&
                    "Akan menambah data warga baru."}
                  {formData.jenis === "Pindah Masuk" &&
                    "Akan menambah data warga baru dari luar."}
                  {formData.jenis === "Kematian" &&
                    "Status warga akan diubah menjadi Meninggal (Non-Aktif)."}
                  {formData.jenis === "Pindah Keluar" &&
                    "Status warga akan diubah menjadi Pindah (Non-Aktif)."}
                </div>
              </div>

              {/* Tanggal & NIK */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input text-xs font-bold text-gray-600 mb-1 block">
                    Tanggal Kejadian
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    required
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input text-xs font-bold text-gray-600 mb-1 block">
                    NIK (Opsional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="3312xxxx"
                    value={formData.nik}
                    readOnly={!!selectedResident} // Lock NIK jika pilih existing resident
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Input Nama dengan Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Nama Warga
                  {(formData.jenis === "Kematian" ||
                    formData.jenis === "Pindah Keluar") && (
                    <span className="text-red-500 ml-1 font-normal">
                      *Wajib pilih dari DB
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    autoComplete="off"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-sm transition-all
                      ${
                        selectedResident
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                          : "border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      }`}
                    required
                    placeholder={
                      formData.jenis === "Kelahiran"
                        ? "Nama bayi..."
                        : "Cari nama warga..."
                    }
                    value={
                      selectedResident ? selectedResident.nama : searchResident
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchResident(val);

                      // Jika user mengetik ulang saat sudah ada selected, reset selectednya
                      if (selectedResident) {
                        setSelectedResident(null);
                        setFormData((prev) => ({
                          ...prev,
                          pendudukId: null,
                          nik: "",
                          nama: "",
                        }));
                      }
                      setFormData((prev) => ({ ...prev, nama: val }));
                    }}
                  />

                  {/* Tombol Clear Input */}
                  {(searchResident || selectedResident) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedResident(null);
                        setSearchResident("");
                        setFormData((prev) => ({
                          ...prev,
                          pendudukId: null,
                          nik: "",
                          nama: "",
                        }));
                      }}
                      className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Dropdown Hasil Pencarian */}
                {!selectedResident &&
                  searchResident.length >= 2 &&
                  filteredResidents.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {filteredResidents.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => handleSelectResident(res)}
                          className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-0 text-sm group"
                        >
                          <span className="font-bold block text-gray-800 group-hover:text-emerald-700">
                            {res.nama}
                          </span>
                          <span className="text-xs text-gray-500 font-mono flex items-center gap-2">
                            <span>NIK: {res.nik}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Pesan jika tidak ketemu */}
                {!selectedResident &&
                  searchResident.length >= 2 &&
                  filteredResidents.length === 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-xl p-3 text-center text-sm text-gray-500">
                      Data tidak ditemukan di database.
                    </div>
                  )}
              </div>

              <div>
                <label className="label-input text-xs font-bold text-gray-600 mb-1 block">
                  Keterangan Detail
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
                  required
                  placeholder="Contoh: Lahir di RSUD / Pindah ke Jakarta ikut suami"
                  value={formData.ket}
                  onChange={(e) =>
                    setFormData({ ...formData, ket: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2 transition-colors text-sm disabled:opacity-70"
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
