"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi Login (Nanti diganti Auth.js / NextAuth)
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* KIRI: Ilustrasi / Branding */}
        <div className="hidden md:flex flex-1 bg-slate-900 text-white flex-col justify-center p-12 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-600 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={32} className="text-green-500" />
              <span className="text-xl font-bold tracking-widest">
                SISKEUDES 2.0
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Sistem Informasi Manajemen Desa
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Kelola data kependudukan, surat menyurat, dan transparansi
              anggaran dalam satu pintu yang aman dan terintegrasi.
            </p>
          </div>
        </div>

        {/* KANAN: Form Login */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Selamat Datang Kembali
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Silakan masuk menggunakan akun perangkat desa.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username / NIP
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Masukkan NIP"
                  required
                />
                <User
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-500">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70"
            >
              {isLoading ? (
                "Memproses..."
              ) : (
                <>
                  Masuk Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              &copy; 2025 Pemerintah Desa Makmur Jaya.
              <br />
              Dilindungi undang-undang.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
