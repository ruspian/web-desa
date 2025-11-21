import LoginForm from "@/components/form/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* KIRI */}
        <div className="hidden md:flex flex-1 bg-slate-900 text-white flex-col justify-center p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-600 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={32} className="text-green-500" />
              <span className="text-xl font-bold tracking-widest">
                WEB DESA
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

        {/* KANAN */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Selamat Datang Kembali
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Silakan masuk menggunakan akun anda.
            </p>
          </div>

          <LoginForm />

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
