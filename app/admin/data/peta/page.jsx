"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Plus, Trash2, Edit } from "lucide-react";
import PetaAdminForm from "@/components/form/PetaAdminForm";
import { useToast } from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/confirmModal";

// Import MapEditor secara Dynamic (Client Side Only)
const MapEditor = dynamic(() => import("@/components/MapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 rounded-2xl">
      Tunggu Sebentar...
    </div>
  ),
});

export default function AdminPetaPage() {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState([0.548321, 121.7891141]); // Pusat Peta Default
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "Fasilitas Umum",
    lat: "",
    lng: "",
  });

  const toast = useToast();

  // fetch data saat halaman di load
  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/peta-lokasi");
      const json = await res.json();
      if (res.ok) {
        setLocations(json.data);
      }
    } catch (error) {
      throw new Error(error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle klik di peta
  const handleMapClick = (latlng) => {
    setFormData({
      ...formData,
      lat: latlng.lat.toFixed(7), // Ambil 7 angka di belakang koma
      lng: latlng.lng.toFixed(7),
    });
  };

  // Handle Input Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simpan Data
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng)
      return toast.error(
        "Klik peta untuk menentukan titik koordinat!",
        "Error"
      );

    setIsSaving(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/peta-lokasi", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      toast.success(json.message, "Sukses");
      fetchLocations(); // Refresh data

      // Reset Form
      setFormData({
        id: null,
        name: "",
        category: "Fasilitas Umum",
        lat: "",
        lng: "",
      });
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan data", "Error");
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // hapus data
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/peta-lokasi?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Lokasi berhasil dihapus", "Sukses");
      fetchLocations(); // Refresh data
      setIsDeleteOpen(false); // Tutup modal
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus", "Error");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  // edit data
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      lat: item.lat.toString(),
      lng: item.lng.toString(),
    });
    setCenter([item.lat, item.lng]); // Pindah kamera peta ke lokasi item
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Peta Digital Desa
          </h1>
          <p className="text-gray-500 text-sm">
            Tandai lokasi kantor desa, sekolah, wisata, dan fasilitas umum.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* MAP preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm relative flex flex-col h-full min-h-[400px]">
          <div className="absolute top-4 right-4 z-400 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-medium shadow-md border border-gray-200">
            Klik peta untuk mengambil koordinat
          </div>
          <MapEditor
            center={center}
            markers={locations}
            selectedPos={
              formData.lat
                ? [parseFloat(formData.lat), parseFloat(formData.lng)]
                : null
            }
            onMapClick={handleMapClick}
          />
        </div>

        {/* form dan list */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          {/*  FORM INPUT */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              {formData.id ? (
                <Edit size={18} className="text-blue-500" />
              ) : (
                <Plus size={18} className="text-green-500" />
              )}
              {formData.id ? "Edit Lokasi" : "Tambah Lokasi Baru"}
            </h3>

            <PetaAdminForm
              formData={formData}
              setFormData={setFormData}
              handleSave={handleSave}
              handleChange={handleChange}
              isSaving={isSaving}
            />
          </div>

          {/* list lokasi */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-700 text-sm">
                Daftar Lokasi ({locations.length})
              </h3>
              {isLoading && (
                <span className="text-xs text-gray-400">Loading...</span>
              )}
            </div>
            <div className="overflow-y-auto p-2 space-y-1 flex-1">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-gray-100 transition-all"
                >
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => handleEdit(loc)}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-gray-500">{loc.category}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {loc.lat}, {loc.lng}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(loc)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(loc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title="Hapus Lokasi?"
                message="Lokasi yang dihapus tidak dapat dikembalikan lagi. Pastikan data sudah benar."
              />

              {!isLoading && locations.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Belum ada lokasi ditandai.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
