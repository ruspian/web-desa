"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Gift,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import ConfirmModal from "../ui/confirmModal";
import { Button } from "../ui/button";
import { formatRupiah } from "@/lib/formatRupiah";

export default function AdminBansosClient({
  initialData,
  pagination,
  stats,
  residentList,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // State URL & Filter (List Utama)
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const currentJenis = searchParams.get("jenis") || "semua";

  // State CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    nik: "",
    nama: "",
    dusun: "",
    jenis: "BLT Dana Desa",
    periode: "2025",
    nominal: 0,
    status: "Aktif",
  });

  // State Pencarian Warga di Modal
  const [searchResidentQuery, setSearchResidentQuery] = useState("");
  const [showResidentSuggestions, setShowResidentSuggestions] = useState(false);

  // State Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // pencarian
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("query") || "")) {
      if (debouncedSearch) params.set("query", debouncedSearch);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterJenis = (jenis) => {
    const params = new URLSearchParams(searchParams);
    if (jenis !== "semua") params.set("jenis", jenis);
    else params.delete("jenis");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // cari data warga di modal
  const filteredResidents = useMemo(() => {
    if (!searchResidentQuery || searchResidentQuery.length < 2) return [];
    const lower = searchResidentQuery.toLowerCase();
    return residentList
      .filter(
        (r) => r.nik.includes(lower) || r.nama.toLowerCase().includes(lower)
      )
      .slice(0, 5);
  }, [searchResidentQuery, residentList]);

  const handleSelectResident = (resident) => {
    setFormData((prev) => ({
      ...prev,
      nik: resident.nik,
      nama: resident.nama,
      dusun: resident.dusun || "",
    }));
    setSearchResidentQuery(resident.nik); // Tampilkan NIK di input
    setShowResidentSuggestions(false);
  };

  const openModal = (item = null) => {
    if (item) {
      // Edit Mode
      setFormData({
        id: item.id,
        nik: item.penduduk?.nik || "", // Ambil dari relasi database
        nama: item.penduduk?.nama || "",
        dusun: item.penduduk?.dusun || "",
        jenis: item.jenisBansos,
        periode: item.periode,
        nominal: item.nominal ? parseInt(item.nominal) : 0,
        status: item.status,
      });
      setSearchResidentQuery(item.penduduk?.nik || ""); // Isi kolom search dengan NIK yang ada
    } else {
      // Add Mode
      setFormData({
        id: null,
        nik: "",
        nama: "",
        dusun: "",
        jenis: "BLT Dana Desa",
        periode: new Date().getFullYear().toString(),
        nominal: 300000,
        status: "Aktif",
      });
      setSearchResidentQuery("");
    }
    setShowResidentSuggestions(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validasi Manual
    if (!formData.nik || !formData.nama) {
      toast.error("Wajib memilih warga dari database!");
      return;
    }

    setIsSaving(true);
    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/bansos", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menyimpan data");
      }

      toast.success("Data Bansos berhasil disimpan!");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/bansos?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Data penerima dihapus");
      router.refresh();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getBadgeColor = (jenis) => {
    switch (jenis) {
      case "BLT Dana Desa":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PKH":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "BPNT / Sembako":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Data Bantuan Sosial
          </h1>
          <p className="text-gray-500 text-sm">
            Total Penerima:{" "}
            <span className="font-bold">{pagination.totalItems}</span> KPM
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} /> Tambah Penerima
          </button>
        </div>
      </div>

      {/* INFO BOX  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-200 text-emerald-700 rounded-lg flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-bold uppercase">
              BLT Dana Desa
            </p>
            <p className="text-lg font-bold text-emerald-900">
              {stats.blt} KPM
            </p>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase">
              PKH (Pusat)
            </p>
            <p className="text-lg font-bold text-blue-900">{stats.pkh} KPM</p>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-200 text-orange-700 rounded-lg flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <p className="text-xs text-orange-600 font-bold uppercase">
              BPNT / Sembako
            </p>
            <p className="text-lg font-bold text-orange-900">
              {stats.bpnt} KPM
            </p>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari NIK atau Nama KPM..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[180px]"
            value={currentJenis}
            onChange={(e) => handleFilterJenis(e.target.value)}
          >
            <option value="semua">Semua Bantuan</option>
            <option value="BLT Dana Desa">BLT Dana Desa</option>
            <option value="PKH">PKH</option>
            <option value="BPNT / Sembako">BPNT / Sembako</option>
            <option value="BST Kemensos">BST Kemensos</option>
            <option value="Lainnya">Bantuan Lainnya</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-450px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 border-b">Penerima (KPM)</th>
                <th className="px-6 py-4 border-b">Jenis Bantuan</th>
                <th className="px-6 py-4 border-b">Periode</th>
                <th className="px-6 py-4 border-b">Nominal/Bulan</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {initialData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">
                      {item.penduduk?.nama || item.nama}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {item.penduduk?.nik || "-"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.penduduk?.dusun || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold border ${getBadgeColor(
                        item.jenisBansos
                      )}`}
                    >
                      {item.jenisBansos}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {item.periode}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-700">
                    {item.nominal > 0 ? formatRupiah(item.nominal) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "Aktif" ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                        Non-Aktif
                      </span>
                    )}
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
              ))}
            </tbody>
          </table>
          {initialData.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Data tidak ditemukan.
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm bg-white">
            <span className="text-gray-500">
              Halaman <b>{pagination.currentPage}</b> dari{" "}
              {pagination.totalPages}
            </span>
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

      {/* MODAL CONFIRM DELETE */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Penerima?"
        message="Data penerima bantuan ini akan dihapus permanen."
      />

      {/*MODAL FORM*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Data KPM" : "Tambah Penerima Baru"}
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
                {/* input nik dan nama  */}
                <div className="col-span-2 relative">
                  <label className="label-input">NIK (Cari Warga)</label>
                  <input
                    type="text"
                    className="input-field font-mono"
                    required
                    maxLength={16}
                    value={searchResidentQuery}
                    onChange={(e) => {
                      setSearchResidentQuery(e.target.value);
                      setShowResidentSuggestions(true);
                      setFormData({ ...formData, nik: e.target.value });
                    }}
                    onFocus={() => setShowResidentSuggestions(true)}
                    placeholder="Ketik NIK atau Nama..."
                  />

                  {/* Dropdown Suggestion */}
                  {showResidentSuggestions && filteredResidents.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-xl max-h-40 overflow-y-auto">
                      {filteredResidents.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => handleSelectResident(res)}
                          className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-0 text-sm text-gray-700"
                        >
                          <span className="font-bold block">{res.nama}</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {res.nik} - {res.dusun}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    *NIK wajib terdaftar di Data Penduduk
                  </p>
                </div>

                {/* --- AUTO FILL FIELDS --- */}
                <div className="col-span-2">
                  <label className="label-input">Nama Lengkap</label>
                  <input
                    type="text"
                    className="input-field bg-gray-100 text-gray-500"
                    required
                    value={formData.nama}
                    readOnly
                    placeholder="Otomatis terisi"
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-input">Dusun</label>
                  <input
                    type="text"
                    className="input-field bg-gray-100 text-gray-500"
                    value={formData.dusun}
                    readOnly
                    placeholder="Otomatis terisi"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 my-2 pt-2"></div>

              <div>
                <label className="label-input">Jenis Bantuan</label>
                <select
                  className="input-field bg-white"
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis: e.target.value })
                  }
                >
                  <option value="semua">Semua Bantuan</option>
                  <option value="BLT Dana Desa">BLT Dana Desa</option>
                  <option value="PKH">PKH</option>
                  <option value="BPNT / Sembako">BPNT / Sembako</option>
                  <option value="BST Kemensos">BST Kemensos</option>
                  <option value="Lainnya">Bantuan Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Tahun Periode</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.periode}
                    onChange={(e) =>
                      setFormData({ ...formData, periode: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">Status</label>
                  <select
                    className="input-field bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Aktif</option>
                    <option>Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-input">Nominal per Bulan (Rp)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nominal: parseInt(e.target.value),
                    })
                  }
                  placeholder="0 jika barang"
                />
                <p className="text-xs text-gray-400 mt-1">
                  *Isi 0 jika bantuan berupa barang/sembako
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Simpan Data"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
