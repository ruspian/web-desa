"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  Plus,
  Trash2,
  FileText,
  Target,
  Image as ImageIcon,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function AdminTentangPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profil"); // 'profil' or 'visimisi'

  // Initial Data (Simulasi Database)
  const [formData, setFormData] = useState({
    namaDesa: "Desa Makmur Jaya",
    tagline: "Membangun Desa, Merawat Tradisi",
    sejarah:
      "Desa Makmur Jaya didirikan pada tahun 1985, berawal dari pemekaran wilayah...",
    videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    visi: "Terwujudnya Desa Makmur Jaya yang Mandiri, Cerdas, dan Berakhlak Mulia.",
    misi: [
      "Meningkatkan kualitas pelayanan publik berbasis digital.",
      "Mewujudkan transparansi pengelolaan keuangan desa.",
      "Mengembangkan potensi wisata dan UMKM lokal.",
    ],
    fotoUtama:
      "https://images.unsplash.com/photo-1516216628259-63eb6fd6932f?w=800&q=80",
  });

  // Handle Input Text Biasa
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Dinamis Misi (Tambah/Hapus/Edit List)
  const handleMisiChange = (index, value) => {
    const newMisi = [...formData.misi];
    newMisi[index] = value;
    setFormData({ ...formData, misi: newMisi });
  };

  const addMisi = () => {
    setFormData({ ...formData, misi: [...formData.misi, ""] });
  };

  const removeMisi = (index) => {
    const newMisi = formData.misi.filter((_, i) => i !== index);
    setFormData({ ...formData, misi: newMisi });
  };

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi API Save
    setTimeout(() => {
      setIsLoading(false);
      alert("Perubahan berhasil disimpan!");
    }, 1500);
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
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-70"
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
        {/* TAB 1: PROFIL & SEJARAH */}
        {activeTab === "profil" && (
          <div className="space-y-8 animate-fade-in">
            {/* Upload Foto Utama */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Foto Utama / Cover Website
              </label>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Preview Image */}
                <div className="md:col-span-1 relative h-48 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image
                    src={formData.fotoUtama}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                    Preview Tampilan
                  </div>
                </div>
                {/* Upload Box */}
                <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors p-6">
                  <div className="bg-slate-100 p-3 rounded-full mb-3">
                    <Upload size={24} className="text-slate-600" />
                  </div>
                  <p className="font-bold text-sm">Klik untuk ganti foto</p>
                  <p className="text-xs text-gray-400">
                    JPG/PNG, Maks 2MB. Disarankan rasio 16:9
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Desa (Branding)
                </label>
                <input
                  name="namaDesa"
                  value={formData.namaDesa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tagline / Semboyan
                </label>
                <input
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Video Profil */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Link Video Profil (YouTube)
              </label>
              <div className="relative">
                <input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-blue-600 font-medium"
                />
                <PlayCircle
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Video akan ditampilkan di halaman Tentang Desa.
              </p>
            </div>

            {/* Sejarah (Textarea Panjang) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Sejarah Desa
              </label>
              <textarea
                name="sejarah"
                value={formData.sejarah}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed resize-y"
              ></textarea>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Mendukung format paragraf sederhana.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MISI */}
        {activeTab === "visimisi" && (
          <div className="space-y-8 animate-fade-in">
            {/* Visi */}
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <label className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <Target size={18} /> Visi Desa
              </label>
              <textarea
                name="visi"
                value={formData.visi}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-center text-emerald-900 bg-white"
              ></textarea>
              <p className="text-xs text-emerald-600 mt-2 text-center">
                &quot;Gambaran masa depan yang ingin dicapai dalam kurun waktu
                tertentu.&quot;
              </p>
            </div>

            {/* Misi (Dynamic List) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-gray-700">
                  Daftar Misi
                </label>
                <button
                  onClick={addMisi}
                  className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Tambah Misi
                </button>
              </div>

              <div className="space-y-3">
                {formData.misi.map((item, index) => (
                  <div key={index} className="flex gap-3 group">
                    <div className="w-8 h-11 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleMisiChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Tulis poin misi..."
                    />
                    <button
                      onClick={() => removeMisi(index)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus poin ini"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {formData.misi.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Belum ada data misi. Klik tombol tambah di atas.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
