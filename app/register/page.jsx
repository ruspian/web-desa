import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import RegisterForm from "@/components/form/RegisterForm";

export const metadata = {
  title: "Register",
  description: "Halaman Register Web Desa",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* KIRI */}
        <div className="hidden md:flex flex-1 bg-green-900 text-white flex-col justify-center p-8 relative overflow-hidden">
          {/* Pattern Background */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={32} className="text-yellow-400" />
              <span className="text-xl font-bold tracking-widest">
                WEB DESA
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

        {/* KANAN */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h3>
            <p className="text-gray-500 text-sm mt-1">
              Pastikan data NIK sesuai dengan KTP asli.
            </p>
          </div>

          <RegisterForm />

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
