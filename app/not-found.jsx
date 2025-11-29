import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";

const BACKGROUND_URL = "/404.gif"; // Pastikan resolusi GIF/Gambarnya bagus

export default function NotFound() {
  return (
    <div className="absolute min-h-screen w-full top-0 left-0 z-50 ">
      <div className="relative  flex flex-col items-center justify-center text-center font-sans overflow-hidden">
        {/* GAMBAR ANIMASI */}
        <div className="absolute inset-0 z-0">
          <Image
            src={BACKGROUND_URL}
            alt="404 Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* KONTEN   */}
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center z-10 px-6 text-white animate-fade-in-up">
          <h1 className="absolute top-10 text-2xl md:text-4xl  font-extrabold mb-2 tracking-tighter text-emerald-600 drop-shadow-2xl">
            404 Not Found!
          </h1>

          {/* Tombol Navigasi */}
          <div className="absolute bottom-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 transition-all shadow-lg shadow-green-600/40 hover:shadow-green-500/60 hover:-translate-y-1 w-full sm:w-auto"
            >
              <Home size={20} /> Kembali ke Beranda
            </Link>

            <Link
              href="/informasi/berita"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-neutral-500 font-bold rounded-full hover:bg-white/20 transition-all shadow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
              <ArrowLeft size={20} /> Baca Berita Saja
            </Link>
          </div>

          {/* Footer kecil */}
          <div className="absolute bottom-22 text-sm text-gray-500 font-mono uppercase tracking-widest opacity-60">
            System Error: Halaman Tidak Ditemukan!
          </div>
        </div>
      </div>
    </div>
  );
}
