"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  X,
  Save,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserPlus,
  MinusCircle,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useToast } from "@/components/ui/Toast";
import ConfirmModal from "../ui/confirmModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { dusunFilter } from "@/lib/dataFilter";

export default function AdminKartuKeluargaClient({
  initialData,
  pagination,
  candidateList,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  // STATE UTAMA
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // STATE CRUD KK
  const [modalType, setModalType] = useState(null);
  const [selectedKK, setSelectedKK] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    kepalaKeluargaId: null,
    noKK: "",
    kepalaKeluarga: "",
    dusun: "",
  });

  // STATE PENCARIAN KEPALA KELUARGA
  const [searchHeadQuery, setSearchHeadQuery] = useState("");
  const [selectedHead, setSelectedHead] = useState(null);

  // STATE HAPUS KK
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // STATE MANAJEMEN ANGGOTA
  const [searchCandidateQuery, setSearchCandidateQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hubungan, setHubungan] = useState("Istri");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch !== (searchParams.get("query") || "")) {
      if (debouncedSearch) params.set("query", debouncedSearch);
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleFilterDusun = (dusun) => {
    const params = new URLSearchParams(searchParams);
    if (dusun !== "semua") params.set("alamat", dusun);
    else params.delete("alamat");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // FILTER CALON KEPALA KELUARGA
  const filteredHeads = useMemo(() => {
    if (!searchHeadQuery || searchHeadQuery.length < 2) return [];
    const lowerQuery = searchHeadQuery.toLowerCase();
    return candidateList
      .filter(
        (c) =>
          c.nama.toLowerCase().includes(lowerQuery) ||
          c.nik.includes(lowerQuery)
      )
      .slice(0, 5);
  }, [searchHeadQuery, candidateList]);

  // FILTER CALON ANGGOTA
  const filteredCandidates = useMemo(() => {
    if (!searchCandidateQuery || searchCandidateQuery.length < 2) return [];
    const lowerQuery = searchCandidateQuery.toLowerCase();
    return candidateList
      .filter(
        (c) =>
          c.nama.toLowerCase().includes(lowerQuery) ||
          c.nik.includes(lowerQuery)
      )
      .slice(0, 5);
  }, [searchCandidateQuery, candidateList]);

  // UPDATE OPEN MODAL UNTUK HANDLE SEARCH KEPALA KELUARGA
  const openFormModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        kepalaKeluargaId: null,
        noKK: item.noKK,
        kepalaKeluarga: item.kepalaKeluarga,
        dusun: item.dusun,
      });
      // Set initial search query dengan nama yang sudah ada
      setSearchHeadQuery(item.kepalaKeluarga);
      // set selectedHead sebagai object dummy agar tombol X muncul
      setSelectedHead({ nama: item.kepalaKeluarga });
    } else {
      setFormData({
        id: null,
        kepalaKeluargaId: null,
        noKK: "",
        kepalaKeluarga: "",
        dusun: "",
      });
      setSearchHeadQuery("");
      setSelectedHead(null);
    }
    setModalType("form");
  };

  const openDetailModal = (item) => {
    setSelectedKK(item);
    setModalType("detail");
    setSearchCandidateQuery("");
    setSelectedCandidate(null);
  };

  const handleSaveKK = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/kartu-keluarga", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data KK");
      toast.success("Data Kartu Keluarga berhasil disimpan!");
      router.refresh();
      setModalType(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKK = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/kartu-keluarga?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus KK");
      toast.success("Kartu Keluarga berhasil dihapus!");
      router.refresh();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedCandidate || !selectedKK) return;
    setIsAddingMember(true);

    try {
      const res = await fetch("/api/kartu-keluarga/anggota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kkId: selectedKK.id,
          pendudukId: selectedCandidate.id,
          hubungan: hubungan,
        }),
      });

      if (!res.ok) throw new Error("Gagal menambah anggota");

      toast.success("Anggota berhasil ditambahkan!");
      router.refresh();

      const newMember = {
        id: selectedCandidate.id,
        nik: selectedCandidate.nik,
        nama: selectedCandidate.nama,
        hubungan: hubungan,
      };

      setSelectedKK((prev) => ({
        ...prev,
        anggota: [...prev.anggota, newMember],
      }));

      setSearchCandidateQuery("");
      setSelectedCandidate(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/kartu-keluarga/anggota?id=${deleteMemberId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Warga dikeluarkan dari KK");
      router.refresh();

      setIsDeleteOpen(false);

      setSelectedKK((prev) => ({
        ...prev,
        anggota: prev.anggota.filter((m) => m.id !== deleteMemberId),
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Kartu Keluarga (KK)
            </h1>
            <p className="text-gray-500 text-sm">
              Total Data:{" "}
              <span className="font-bold">{pagination.totalItems}</span> Kepala
              Keluarga
            </p>
          </div>
          <button
            onClick={() => openFormModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
          >
            <Plus size={18} /> Buat KK Baru
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari No. KK atau Kepala Keluarga..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[180px]"
              value={searchParams.get("alamat") || "semua"}
              onChange={(e) => handleFilterDusun(e.target.value)}
            >
              <option value="semua">Semua Dusun</option>
              {dusunFilter.map((dusun) => (
                <option key={dusun.value} value={dusun.value}>
                  {dusun.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE KK */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 border-b">Nomor KK</th>
                  <th className="px-6 py-4 border-b">Kepala Keluarga</th>
                  <th className="px-6 py-4 border-b">Alamat</th>
                  <th className="px-6 py-4 border-b text-center">Anggota</th>
                  <th className="px-6 py-4 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {initialData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      {item.noKK}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.kepalaKeluarga}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-emerald-500" />
                        {item.dusun}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                        <Users size={12} />{" "}
                        {item.anggota ? item.anggota.length : 0} Jiwa
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                          title="Detail Anggota"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openFormModal(item)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                          title="Edit KK"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteType("kk");
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
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
              <div className="p-12 text-center text-gray-400">
                Data tidak ditemukan.
              </div>
            )}
          </div>

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

        {/* MODAL BUAT DAN EDIT KK */}
        {modalType === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {formData.id ? "Edit Kartu Keluarga" : "Buat KK Baru"}
                </h3>
                <button onClick={() => setModalType(null)}>
                  <X className="text-gray-400 hover:text-gray-700" />
                </button>
              </div>
              <form onSubmit={handleSaveKK} className="p-6 space-y-4">
                {/* NOMOR KK  */}
                <div>
                  <label className="label-text">Nomor KK</label>
                  <Input
                    type="text"
                    className="input-field font-mono"
                    maxLength={16}
                    value={formData.noKK}
                    onChange={(e) =>
                      setFormData({ ...formData, noKK: e.target.value })
                    }
                    placeholder="16 Digit Angka"
                    required
                  />
                </div>

                {/* KEPALA KELUARGA */}
                <div>
                  <label className="label-text">Kepala Keluarga</label>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Ketik NIK atau Nama Warga..."
                      className="input-field pl-10"
                      value={searchHeadQuery}
                      onChange={(e) => {
                        setSearchHeadQuery(e.target.value);
                        setSelectedHead(null);
                      }}
                    />
                    {selectedHead && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHead(null);
                          setSearchHeadQuery("");
                          setFormData({ ...formData, kepalaKeluarga: "" });
                        }}
                        className="absolute right-3 top-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {/* DROPDOWN HASIL SEARCH KEPALA KELUARGA */}
                  {searchHeadQuery.length >= 2 &&
                    !selectedHead &&
                    filteredHeads.length > 0 && (
                      <div className="absolute z-10 w-sm bg-white border border-gray-200 rounded-xl mt-1 shadow-xl max-h-40 overflow-y-auto">
                        {filteredHeads.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setSelectedHead(c);
                              setSearchHeadQuery(`${c.nama}`);
                              setFormData({
                                ...formData,
                                kepalaKeluarga: c.nama,
                                kepalaKeluargaId: c.id,
                              });
                            }}
                            className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-0 text-sm text-gray-700"
                          >
                            <span className="font-bold block">{c.nama}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  {searchHeadQuery.length >= 2 &&
                    !selectedHead &&
                    filteredHeads.length === 0 && (
                      <div className="absolute z-10 w-sm bg-white border border-gray-200 rounded-xl mt-1 p-3 text-sm text-gray-500 text-center">
                        Warga tidak ditemukan atau sudah punya KK.
                      </div>
                    )}
                </div>

                {/* --- ALAMAT --- */}
                <div>
                  <label className="label-text">Dusun</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.dusun}
                    onChange={(e) =>
                      setFormData({ ...formData, dusun: e.target.value })
                    }
                  >
                    <option value="">Pilih Dusun</option>
                    {dusunFilter.map((dusun) => (
                      <option key={dusun.value} value={dusun.value}>
                        {dusun.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                  <Button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="btn-secondary"
                    disabled={isSaving}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}{" "}
                    Simpan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/*MODAL DETAIL & MANAJEMEN ANGGOTA */}
        {modalType === "detail" && selectedKK && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 bg-slate-900 text-white rounded-t-2xl flex justify-between items-start shrink-0">
                <div>
                  <h3 className="text-lg font-bold">Manajemen Anggota KK</h3>
                  <p className="text-slate-400 text-sm font-mono mt-1">
                    NO. KK: {selectedKK.noKK}
                  </p>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/*  TABEL LIST ANGGOTA */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">
                    Daftar Anggota Keluarga
                  </h4>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
                        <tr>
                          <th className="px-4 py-3">NIK</th>
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3">Hubungan</th>
                          <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {selectedKK.anggota &&
                          selectedKK.anggota.map((member) => (
                            <tr key={member.id}>
                              <td className="px-4 py-3 font-mono text-gray-600">
                                {member.nik}
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800">
                                {member.nama}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-bold ${
                                    member.hubungan === "Kepala Keluarga"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {member.hubungan}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Button
                                  onClick={() => {
                                    setDeleteMemberId(member.id);
                                    setDeleteType("anggota");
                                    setIsDeleteOpen(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                                  title="Keluarkan dari KK"
                                >
                                  <MinusCircle size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        {(!selectedKK.anggota ||
                          selectedKK.anggota.length === 0) && (
                          <tr>
                            <td
                              colSpan={4}
                              className="p-6 text-center text-gray-400"
                            >
                              Belum ada anggota terdaftar.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. FORM TAMBAH ANGGOTA */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                    <UserPlus size={18} /> Tambah Anggota Baru
                  </h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="label-text">Cari Anggota</label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Ketik NIK atau Nama..."
                          className="input-field pl-10"
                          value={
                            selectedCandidate
                              ? `${selectedCandidate.nama} (${selectedCandidate.nik})`
                              : searchCandidateQuery
                          }
                          onChange={(e) => {
                            setSearchCandidateQuery(e.target.value);
                            setSelectedCandidate(null);
                          }}
                        />
                        {selectedCandidate && (
                          <button
                            onClick={() => {
                              setSelectedCandidate(null);
                              setSearchCandidateQuery("");
                            }}
                            className="absolute right-3 top-2 text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>

                      {/* DROPDOWN SEARCH RESULT */}
                      {searchCandidateQuery.length >= 2 &&
                        !selectedCandidate &&
                        filteredCandidates.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-xl max-h-40 overflow-y-auto">
                            {filteredCandidates.map((c) => (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setSelectedCandidate(c);
                                  setSearchCandidateQuery(
                                    `${c.nama} (${c.nik})`
                                  );
                                }}
                                className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-0 text-sm text-gray-700"
                              >
                                <span className="font-bold block">
                                  {c.nama}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                  {c.nik}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      {searchCandidateQuery.length >= 2 &&
                        !selectedCandidate &&
                        filteredCandidates.length === 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 p-3 text-sm text-gray-500 text-center">
                            Tidak ditemukan / Sudah punya KK
                          </div>
                        )}
                    </div>

                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="label-text">Hubungan Keluarga</label>
                        <select
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          value={hubungan}
                          onChange={(e) => setHubungan(e.target.value)}
                        >
                          <option value="Istri">Istri</option>
                          <option value="Anak">Anak</option>
                          <option value="Menantu">Menantu</option>
                          <option value="Cucu">Cucu</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Mertua">Mertua</option>
                          <option value="Famili Lain">Famili Lain</option>
                        </select>
                      </div>
                      <button
                        onClick={handleAddMember}
                        disabled={!selectedCandidate || isAddingMember}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isAddingMember ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Plus size={18} />
                        )}{" "}
                        Tambahkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-white text-right rounded-b-2xl">
                <Button
                  onClick={() => setModalType(null)}
                  className="btn-secondary text-sm"
                >
                  Selesai & Tutup
                </Button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={deleteType === "kk" ? handleDeleteKK : handleRemoveMember}
          isLoading={isDeleting}
          title={
            deleteType === "kk" ? "Hapus Kartu Keluarga?" : "Hapus Anggota KK?"
          }
          message={
            deleteType === "kk"
              ? "Data KK dan relasi anggotanya akan dihapus. Pastikan data sudah benar."
              : "Data anggota KK akan dihapus. Pastikan data sudah benar."
          }
        />

        <style jsx>{`
          .label-text {
            @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
          }
          .input-field {
            @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-800;
          }
          .btn-primary {
            @apply px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2 disabled:opacity-70;
          }
          .btn-secondary {
            @apply px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 disabled:opacity-50;
          }
        `}</style>
      </div>
    </>
  );
}
