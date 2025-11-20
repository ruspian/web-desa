"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Buat pindah halaman
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Ketik
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Khusus NIK cuma boleh angka
    if (name === "nik" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit
  const handleRegister = (e) => {
    e.preventDefault();

    // Validasi Sederhana
    if (formData.nik.length !== 16) {
      alert("NIK harus 16 digit!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    setIsLoading(true);

    // Simulasi Register ke Database
    setTimeout(() => {
      setIsLoading(false);
      alert("Pendaftaran Berhasil! Silakan Login.");
      router.push("/login"); // Lempar ke halaman login
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* KIRI: Branding (Sama kayak Login tapi beda warna dikit biar fresh) */}
        <div className="hidden md:flex flex-1 bg-green-900 text-white flex-col justify-center p-8 relative overflow-hidden">
          {/* Pattern Background */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={32} className="text-yellow-400" />
              <span className="text-xl font-bold tracking-widest">
                WARGA DIGITAL
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Bergabunglah Bersama Kami
            </h2>
            <p className="text-green-200 leading-relaxed mb-8">
              Dapatkan kemudahan akses layanan administrasi desa, pantau bantuan
              sosial, dan sampaikan aspirasi langsung dari genggaman Anda.
            </p>

            {/* Testimoni Kecil */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-sm italic">
                &quot;Sangat terbantu dengan aplikasi ini. Urus surat pindah
                jadi gak perlu bolak-balik kantor desa.&quot;
              </p>
              <p className="text-xs font-bold mt-2 text-yellow-400">
                - Budi, Warga Dusun Krajan
              </p>
            </div>
          </div>
        </div>

        {/* KANAN: Form Register */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h3>
            <p className="text-gray-500 text-sm mt-1">
              Pastikan data NIK sesuai dengan KTP asli.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-2">
            {/* NIK */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                NIK (Nomor Induk Kependudukan)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nik"
                  maxLength={16}
                  value={formData.nik}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono"
                  placeholder="16 Digit Angka"
                  required
                />
                <CreditCard
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="Sesuai KTP"
                  required
                />
                <User
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Email / No HP */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email / No. WhatsApp
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="contoh@email.com"
                  required
                />
                <Mail
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="••••••"
                    required
                  />
                  <Lock
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Ulangi Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all
                                    ${
                                      formData.confirmPassword &&
                                      formData.password !==
                                        formData.confirmPassword
                                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                                        : "border-gray-200 focus:ring-green-500"
                                    }
                                `}
                    placeholder="••••••"
                    required
                  />
                  <Lock
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Password tidak sama!
                    </p>
                  )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-70"
              >
                {isLoading ? (
                  "Mendaftarkan..."
                ) : (
                  <>
                    Daftar Sekarang <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-green-600 font-bold hover:underline"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
