"use client";

import { useEffect, useState } from "react";
import { Save, FileText, Target, Image as ImageIcon } from "lucide-react";
import ProfilDesaForm from "@/components/form/ProfilDesaForm";
import VisiMisiForm from "@/components/form/VisiMisiForm";
import { useToast } from "@/components/ui/Toast";

export default function AdminTentangPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profil"); // 'profil' or 'visimisi'

  // Initial Data
  const [formData, setFormData] = useState({
    namaDesa: "",
    tagline: "",
    sejarah: "",
    visi: "",
    misi: [],
    fotoUtama: "",
  });

  const toast = useToast();

  // fetch data awal profil desa untuk ditampilkan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profil-desa");

        if (response.ok) {
          const json = await response.json();
          // Jika ada data, isi formnya
          if (json.data) {
            setFormData({
              namaDesa: json.data.nama || "",
              tagline: json.data.tagline || "",
              sejarah: json.data.sejarah || "",
              visi: json.data.visi || "",
              misi: json.data.misi || [],
              fotoUtama: json.data.potoUrl || "",
            });
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    fetchData();
  }, []);

  // Handle Input Text Biasa
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Dinamis Misi
  const handleMisiChange = (index, value) => {
    const newMisi = [...formData.misi];
    newMisi[index] = value;
    setFormData({ ...formData, misi: newMisi });
  };

  // fuungsi tambah misi
  const addMisi = () => {
    setFormData({ ...formData, misi: [...formData.misi, ""] });
  };

  // fungsi hapus misi
  const removeMisi = (index) => {
    const newMisi = formData.misi.filter((_, i) => i !== index);
    setFormData({ ...formData, misi: newMisi });
  };

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      nama: formData.namaDesa,
      tagline: formData.tagline,
      sejarah: formData.sejarah,
      visi: formData.visi,
      misi: formData.misi,
      fotoUtama: formData.fotoUtama,
    };

    try {
      setIsLoading(true);

      const response = await fetch("/api/profil-desa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        toast.error(errData.message || "Gagal menyimpan data!", "Error");
        return;
      }

      toast.success("Berhasil menyimpan data!", "Success");
    } catch (error) {
      toast.error(error.message, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tentang Desa</h1>
          <p className="text-gray-500 text-sm">
            Kelola profil utama, sejarah, visi, dan misi desa.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            "Menyimpan..."
          ) : (
            <>
              <Save size={18} /> Simpan Perubahan
            </>
          )}
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-1 bg-white p-1 rounded-sm border border-gray-200 w-full justify-between">
        <button
          onClick={() => setActiveTab("profil")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 w-full
            ${
              activeTab === "profil"
                ? "bg-slate-100 text-slate-900"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          <FileText size={18} /> Profil & Sejarah
        </button>
        <button
          onClick={() => setActiveTab("visimisi")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 w-full
            ${
              activeTab === "visimisi"
                ? "bg-slate-100 text-slate-900"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          <Target size={18} /> Visi & Misi
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {/* TAB PROFIL */}
        {activeTab === "profil" && (
          <ProfilDesaForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            toast={toast}
          />
        )}

        {/* TAB  VISI & MISI */}
        {activeTab === "visimisi" && (
          <VisiMisiForm
            formData={formData}
            addMisi={addMisi}
            removeMisi={removeMisi}
            handleMisiChange={handleMisiChange}
            handleChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
