"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Image as ImageIcon,
  Shield,
  Upload,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary"; // Import Cloudinary
import { useToast } from "@/components/ui/Toast";
import SkeletonPengaturan from "@/components/SkeletonPengaturan";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("identitas");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  const LABEL_STYLE = "block text-xs font-bold text-gray-500 uppercase mb-1.5";
  const INPUT_STYLE =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-800 bg-white";
  const BTN_STYLE =
    "text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all";

  const [generalConfig, setGeneralConfig] = useState({
    namaDesa: "",
    alamat: "",
    email: "",
    telepon: "",
    facebook: "",
    instagram: "",
    runningText: "",
    logo: "",
    favicon: "",
    maintenanceMode: false,
  });

  const [securityConfig, setSecurityConfig] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/pengaturan");
        const json = await res.json();
        if (res.ok && json.data) {
          setGeneralConfig({
            namaDesa: json.data.namaDesa || "",
            alamat: json.data.alamat || "",
            email: json.data.email || "",
            telepon: json.data.telepon || "",
            facebook: json.data.facebook || "",
            instagram: json.data.instagram || "",
            runningText: json.data.runningText || "",
            logo: json.data.logo || "",
            favicon: json.data.favicon || "",
            maintenanceMode: json.data.maintenance || false,
          });
        }
      } catch (e) {
        toast.error("Gagal memuat pengaturan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSaveToDatabase = async (newData) => {
    setIsSaving(true);
    try {
      const { maintenanceMode, ...restConfig } = newData;

      const payload = {
        ...restConfig,
        maintenance: maintenanceMode,
      };

      const res = await fetch("/api/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Pengaturan berhasil disimpan!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneralChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    setGeneralConfig({ ...generalConfig, [name]: value });
  };

  const handleSecurityChange = (e) => {
    setSecurityConfig({ ...securityConfig, [e.target.name]: e.target.value });
  };

  const handleUploadLogo = async (result) => {
    const newLogoUrl = result.info.secure_url;

    const newConfig = { ...generalConfig, logo: newLogoUrl };
    setGeneralConfig(newConfig);

    const success = await handleSaveToDatabase(newConfig);
    if (success) {
      toast.success("Logo berhasil diupload!");

      // kembalikan scroll ke auto setelah upload
      document.body.style.overflow = "auto";
    }
  };

  const handleUploadFavicon = async (result) => {
    const newFaviconUrl = result.info.secure_url;

    const newConfig = { ...generalConfig, favicon: newFaviconUrl };
    setGeneralConfig(newConfig);

    const success = await handleSaveToDatabase(newConfig);
    if (success) {
      toast.success("Favicon berhasil diupload!");

      // kembalikan scroll ke auto setelah upload
      document.body.style.overflow = "auto";
    }
  };

  const handleSaveSettings = async () => {
    const success = await handleSaveToDatabase(generalConfig);
    if (success) toast.success("Pengaturan berhasil disimpan!");
  };

  const handleChangePassword = async () => {
    if (securityConfig.newPassword !== securityConfig.confirmPassword)
      return toast.error("Konfirmasi password tidak cocok!");
    if (securityConfig.newPassword.length < 6)
      return toast.error("Password minimal 6 karakter!");
    setIsSaving(true);
    try {
      const res = await fetch("/api/pengaturan/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: securityConfig.currentPassword,
          newPassword: securityConfig.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success("Password berhasil diubah!");
      setSecurityConfig({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(generalConfig));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "settings_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Backup didownload!");
  };

  // SKELETON LOADER
  if (isLoading) {
    return <SkeletonPengaturan />;
  }

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
            className={`${BTN_STYLE} ${
              activeTab === "identitas"
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <Globe size={18} /> Identitas Desa
          </button>
          <button
            onClick={() => setActiveTab("tampilan")}
            className={`${BTN_STYLE} ${
              activeTab === "tampilan"
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <ImageIcon size={18} /> Tampilan & Logo
          </button>
          <button
            onClick={() => setActiveTab("keamanan")}
            className={`${BTN_STYLE} ${
              activeTab === "keamanan"
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            <Shield size={18} /> Keamanan Akun
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          {/*  IDENTITAS */}
          {activeTab === "identitas" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                Profil Instansi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={LABEL_STYLE}>Nama Desa</label>
                  <input
                    type="text"
                    name="namaDesa"
                    className={INPUT_STYLE}
                    value={generalConfig.namaDesa}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="col-span-2">
                  <label className={LABEL_STYLE}>Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    name="alamat"
                    className={`${INPUT_STYLE} resize-none`}
                    value={generalConfig.alamat}
                    onChange={handleGeneralChange}
                  ></textarea>
                </div>
                <div>
                  <label className={LABEL_STYLE}>Email Resmi</label>
                  <input
                    type="email"
                    name="email"
                    className={INPUT_STYLE}
                    value={generalConfig.email}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div>
                  <label className={LABEL_STYLE}>Nomor WhatsApp Admin</label>
                  <input
                    type="tel"
                    name="telepon"
                    className={INPUT_STYLE}
                    value={generalConfig.telepon}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className={LABEL_STYLE}>
                  Teks Berjalan (Running Text)
                </label>
                <input
                  type="text"
                  name="runningText"
                  className={INPUT_STYLE}
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
                    <label className={LABEL_STYLE}>Facebook URL</label>
                    <input
                      type="text"
                      name="facebook"
                      className={INPUT_STYLE}
                      value={generalConfig.facebook}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  <div>
                    <label className={LABEL_STYLE}>Instagram Username</label>
                    <input
                      type="text"
                      name="instagram"
                      className={INPUT_STYLE}
                      value={generalConfig.instagram}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*  TAMPILAN */}
          {activeTab === "tampilan" && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                Aset Visual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div>
                  <label className={`${LABEL_STYLE} mb-3`}>Logo Desa</label>
                  {generalConfig.logo ? (
                    <div className="relative w-32 h-32 mx-auto mb-4 border rounded-lg p-2 bg-gray-50">
                      <Image
                        src={generalConfig.logo}
                        alt="Logo"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <CldUploadButton
                      uploadPreset="ml_default"
                      onSuccess={handleUploadLogo}
                      className="w-full"
                    >
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="p-2 bg-slate-100 rounded-full mb-2">
                          <Upload size={20} />
                        </div>
                        <span className="text-xs font-bold">Upload Logo</span>
                        <span className="text-xs text-gray-400">
                          (PNG, Background Transparant)
                        </span>
                      </div>
                    </CldUploadButton>
                  )}
                </div>

                {/* Favicon Upload */}
                <div>
                  <label className={`${LABEL_STYLE} mb-3`}>
                    Favicon (Browser Tab)
                  </label>
                  {generalConfig.favicon ? (
                    <div className="relative w-16 h-16 mb-4 border rounded-lg p-2 bg-gray-50">
                      <Image
                        src={generalConfig.favicon}
                        alt="Icon"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <CldUploadButton
                      uploadPreset="ml_default"
                      onSuccess={handleUploadFavicon}
                      className="w-full"
                    >
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="p-2 bg-slate-100 rounded-full mb-2">
                          <Globe size={20} />
                        </div>
                        <span className="text-xs font-bold">Upload Icon</span>
                        <span className="text-xs text-gray-400">
                          (ICO atau PNG 32x32px)
                        </span>
                      </div>
                    </CldUploadButton>
                  )}
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
                    <label className={LABEL_STYLE}>Password Lama</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className={INPUT_STYLE}
                      value={securityConfig.currentPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1"></div>
                  <div>
                    <label className={LABEL_STYLE}>Password Baru</label>
                    <input
                      type="password"
                      name="newPassword"
                      className={INPUT_STYLE}
                      value={securityConfig.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div>
                    <label className={LABEL_STYLE}>
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className={INPUT_STYLE}
                      value={securityConfig.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={isSaving}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? "Memproses..." : "Ganti Password"}
                  </button>
                </div>
              </div>

              {/* System Actions */}
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Tindakan Sistem
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div>
                      <h5 className="font-bold text-gray-800">
                        Mode Perbaikan (Maintenance)
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Jika aktif, website publik tidak dapat diakses.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        className="sr-only peer"
                        checked={generalConfig.maintenanceMode}
                        onChange={handleGeneralChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h5 className="font-bold text-gray-800">
                        Backup Konfigurasi
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Unduh data pengaturan saat ini dalam format JSON.
                      </p>
                    </div>
                    <button
                      onClick={handleBackup}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <RefreshCw size={16} /> Download JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTION (Hanya muncul di tab Identitas & Tampilan) */}
          {activeTab !== "keamanan" && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} /> Simpan Pengaturan
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
