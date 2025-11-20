"use client";

import { useState } from "react";
import {
  Save,
  Globe,
  Lock,
  Image as ImageIcon,
  Bell,
  Shield,
  Upload,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("identitas"); // identitas, tampilan, keamanan
  const [isLoading, setIsLoading] = useState(false);

  // State Data Pengaturan
  const [generalConfig, setGeneralConfig] = useState({
    namaDesa: "Desa Makmur Jaya",
    alamat: "Jl. Raya Desa No. 1, Kec. Sukamaju",
    email: "admin@desamakmur.id",
    telepon: "+62 812-3456-7890",
    facebook: "facebook.com/desamakmur",
    instagram: "@desamakmur_official",
    runningText:
      "Selamat Datang di Website Resmi Desa Makmur Jaya. Pelayanan Surat Senin-Jumat 08.00 - 15.00 WIB.",
  });

  const [securityConfig, setSecurityConfig] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    maintenanceMode: false,
  });

  // Handle Changes
  const handleGeneralChange = (e) => {
    setGeneralConfig({ ...generalConfig, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSecurityConfig({ ...securityConfig, [e.target.name]: value });
  };

  // Save Function
  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Pengaturan berhasil disimpan!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
        <p className="text-gray-500 text-sm">
          Konfigurasi website, identitas desa, dan keamanan akun.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("identitas")}
            className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all
                ${
                  activeTab === "identitas"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }
              `}
          >
            <Globe size={18} /> Identitas Desa
          </button>
          <button
            onClick={() => setActiveTab("tampilan")}
            className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all
                ${
                  activeTab === "tampilan"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }
              `}
          >
            <ImageIcon size={18} /> Tampilan & Logo
          </button>
          <button
            onClick={() => setActiveTab("keamanan")}
            className={`text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all
                ${
                  activeTab === "keamanan"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }
              `}
          >
            <Shield size={18} /> Keamanan Akun
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          {/* TAB 1: IDENTITAS */}
          {activeTab === "identitas" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                Profil Instansi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="label-input">Nama Instansi / Desa</label>
                  <Input
                    type="text"
                    name="namaDesa"
                    className="input-field font-bold"
                    value={generalConfig.namaDesa}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-input">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    name="alamat"
                    className="input-field resize-none"
                    value={generalConfig.alamat}
                    onChange={handleGeneralChange}
                  ></textarea>
                </div>
                <div>
                  <label className="label-input">Email Resmi</label>
                  <Input
                    type="email"
                    name="email"
                    className="input-field"
                    value={generalConfig.email}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div>
                  <label className="label-input">
                    Nomor Telepon / WhatsApp
                  </label>
                  <Input
                    type="tel"
                    name="telepon"
                    className="input-field"
                    value={generalConfig.telepon}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="label-input">
                  Teks Berjalan (Running Text)
                </label>
                <Input
                  type="text"
                  name="runningText"
                  className="input-field"
                  value={generalConfig.runningText}
                  onChange={handleGeneralChange}
                  placeholder="Info singkat yang muncul di header website..."
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4">
                  Sosial Media
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-input">Facebook URL</label>
                    <Input
                      type="text"
                      name="facebook"
                      className="input-field"
                      value={generalConfig.facebook}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  <div>
                    <label className="label-input">Instagram Username</label>
                    <Input
                      type="text"
                      name="instagram"
                      className="input-field"
                      value={generalConfig.instagram}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TAMPILAN */}
          {activeTab === "tampilan" && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                Aset Visual
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="label-input mb-3">Logo Desa (Header)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer h-48">
                    <div className="w-16 h-16 relative mb-3">
                      {/* Placeholder Logo */}
                      <div className="w-full h-full bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                        D
                      </div>
                    </div>
                    <button className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                      <Upload size={14} /> Ganti Logo
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">
                      PNG Transparan, Max 1MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="label-input mb-3">
                    Favicon (Browser Tab)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer h-48">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white mb-3">
                      <Globe size={20} />
                    </div>
                    <button className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                      <Upload size={14} /> Ganti Icon
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">
                      ICO/PNG, 32x32px
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                <div className="text-blue-600 shrink-0 mt-1">
                  <AlertTriangle size={18} />
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-bold">Catatan:</p>
                  <p className="opacity-80">
                    Perubahan logo mungkin memerlukan waktu beberapa saat untuk
                    tampil di semua perangkat karena *caching*.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEAMANAN */}
          {activeTab === "keamanan" && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                Keamanan & Sistem
              </h3>

              {/* Ganti Password */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Ganti Password Admin
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="label-input">Password Lama</label>
                    <Input
                      type="password"
                      name="currentPassword"
                      className="input-field"
                      value={securityConfig.currentPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1"></div>{" "}
                  {/* Spacer */}
                  <div>
                    <label className="label-input">Password Baru</label>
                    <Input
                      type="password"
                      name="newPassword"
                      className="input-field"
                      value={securityConfig.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div>
                    <label className="label-input">
                      Konfirmasi Password Baru
                    </label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      className="input-field"
                      value={securityConfig.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                </div>
              </div>

              {/* System Actions */}
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Tindakan Sistem
                </h4>

                <div className="flex flex-col gap-4">
                  {/* Maintenance Mode Toggle */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div>
                      <h5 className="font-bold text-gray-800">
                        Mode Perbaikan (Maintenance)
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Jika aktif, website publik tidak dapat diakses oleh
                        warga.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <Input
                        type="checkbox"
                        name="maintenanceMode"
                        className="sr-only peer"
                        checked={securityConfig.maintenanceMode}
                        onChange={handleSecurityChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Backup Button */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h5 className="font-bold text-gray-800">
                        Backup Database
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Unduh cadangan data penduduk dan surat dalam format
                        SQL/Excel.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                      <RefreshCw size={16} /> Backup Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTION */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70"
            >
              {isLoading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save size={20} /> Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .label-input {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-800 bg-white;
        }
      `}</style>
    </div>
  );
}
