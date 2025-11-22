"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  Save,
  X,
  Camera,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { CldUploadButton } from "next-cloudinary";
import ConfirmModal from "../ui/confirmModal";
import Pagination from "../ui/pagination";
import { Button } from "../ui/button";

export default function AdminPerangkatClient({ initialData, pagination }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  // FORM STATE
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    nip: "",
    jabatan: "Kepala Seksi",
    noHp: "",
    status: "Aktif",
    foto: null,
    urutan: null,
  });

  // MUAT ULANG SAAT PENCARIAN BERUBAH
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
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
  }, [debouncedSearch, pathname, router, searchParams]);

  // FUNGSI UPLOAD FOTO
  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({
      ...prev,
      foto: result.info.secure_url,
    }));
    toast.success("Foto berhasil diupload!", "Success");
  };

  // FUNGSI HAPUS FOTO DARI STATE
  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, foto: null }));
  };

  // FUNGSI GANTI PAGE PAGINATION
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  //   FUNGSI OPEN MODAL BUAT DAN EDIT
  const openModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        nama: item.nama,
        nip: item.nip || "",
        jabatan: item.jabatan,
        noHp: item.noHp || "",
        status: item.status,
        foto: item.foto,
        urutan: item.urutan,
      });
    } else {
      setFormData({
        id: null,
        nama: "",
        nip: "",
        jabatan: "Staf",
        noHp: "",
        status: "Aktif",
        foto: null,
        urutan: null,
      });
    }
    setIsModalOpen(true);
  };

  //   FUNGSI SIMPAN
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.foto) {
      toast.warning("Foto belum diupload!", "Peringatan");
      return;
    }

    try {
      setIsSaving(true);
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch("/api/perangkat-desa", {
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

  //   FUNGSI SAAT KLIK HAPUS
  const onDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  //   FUNGSI HAPUS
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/perangkat-desa?id=${deleteId}`, {
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

  // Jabatan Options
  const jabatanOptions = [
    "Kepala Desa",
    "Sekretaris Desa",
    "Kaur Keuangan",
    "Kaur Umum & Tata Usaha",
    "Kaur Perencanaan",
    "Kasi Pemerintahan",
    "Kasi Kesejahteraan",
    "Kasi Pelayanan",
    "Kepala Dusun",
    "Staf",
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perangkat Desa</h1>
          <p className="text-gray-500 text-sm">
            Kelola data struktural, jabatan, dan profil pegawai.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all"
        >
          <Plus size={20} /> Tambah Pegawai
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
        <Search className="absolute left-6 top-6.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama atau jabatan..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {initialData.map((item) => {
          const isKades = item.jabatan === "Kepala Desa";
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden group transition-all hover:-translate-y-1 ${
                isKades
                  ? "border-2 border-yellow-400 ring-4 ring-yellow-400/10"
                  : "border border-gray-100"
              }`}
            >
              {/* FOTO PROFIL */}
              <div className="h-64 relative bg-gray-100 overflow-hidden">
                {item.foto ? (
                  <Image
                    src={item.foto}
                    alt={item.nama}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <User size={64} />
                    <span className="text-xs mt-2">Tidak ada foto</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm
                                ${
                                  item.status === "Aktif"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-500 text-white"
                                }
                            `}
                  >
                    {item.status}
                  </span>
                </div>

                {/* KADES BADGE */}
                {isKades && (
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-400 text-yellow-900 text-center text-xs font-bold py-1">
                    KEPALA DESA
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="p-5">
                <div className="mb-4">
                  <p
                    className={`text-xs font-bold uppercase mb-1 tracking-wider ${
                      isKades ? "text-yellow-600" : "text-emerald-600"
                    }`}
                  >
                    {item.jabatan}
                  </p>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 truncate">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    NIP: {item.nip || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-gray-50 p-2 rounded-lg">
                  <Phone size={14} />
                  <span>{item.noHp || "-"}</span>
                </div>

                {/* AKSI */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openModal(item)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteClick(item.id)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL HAPUS */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Perangkat Desa?"
        message="Perangkat desa yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
      />

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id
                  ? "Edit Perangkat Desa"
                  : "Tambah Perangkat Desa Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* UPLOAD FOTO  */}
              <div className="w-full">
                <label className="label-input mb-2">Foto Profil</label>

                {formData.foto ? (
                  // PREWIEW
                  <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
                    <Image
                      src={formData.foto}
                      alt="Preview"
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                    {/* OVERLAY HAPUS */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                      <p className="text-sm font-medium">Ingin ganti foto?</p>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={14} /> Hapus Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  // Tampilan Tombol Upload jika belum ada foto
                  <CldUploadButton
                    uploadPreset="ml_default"
                    onSuccess={handleUploadSuccess}
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                      clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                      maxFileSize: 5000000, // 5MB
                    }}
                    className="w-full"
                  >
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer gap-3 bg-white">
                      <div className="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors">
                        <UploadCloud size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-600">
                          Klik untuk Upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG/PNG, Maks 5MB
                        </p>
                      </div>
                    </div>
                  </CldUploadButton>
                )}
              </div>

              <div>
                <label className="label-input">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.nama}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Contoh: H. Budi Santoso, S.IP"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">NIP</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.nip}
                    onChange={(e) =>
                      setFormData({ ...formData, nip: e.target.value })
                    }
                    placeholder="Kosongkan jika belum ada"
                  />
                </div>
                <div>
                  <label className="label-input">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Aktif</option>
                    <option>Cuti</option>
                    <option>Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-input">Jabatan Struktural</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={formData.jabatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatan: e.target.value })
                  }
                >
                  {jabatanOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-input">Nomor WhatsApp</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                  placeholder="0812xxxx"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary cursor-pointer"
                disabled={isSaving}
                variant="outline"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                className="btn-primary cursor-pointer"
                disabled={isSaving}
              >
                {isSaving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={18} /> Simpan Data
                  </>
                )}
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
          @apply px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed;
        }
        .btn-secondary {
          @apply px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed;
        }
      `}</style>
    </div>
  );
}
