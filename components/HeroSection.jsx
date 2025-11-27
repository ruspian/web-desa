import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = ({ profilDesa }) => {
  return (
    <>
      <div className="absolute inset-0 z-0">
        {/* Background */}
        <Image
          src={
            profilDesa?.potoUrl ||
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
          }
          alt="Background Desa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 z-10 pt-20">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-500/20 border border-green-400 text-green-300 text-sm font-semibold mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Official Website Desa Digital
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Membangun Desa, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-200">
              Merawat Tradisi.
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
            Portal pelayanan publik dan transparansi Desa {profilDesa?.nama}.
            Urus surat administrasi kini bisa dari rumah dengan mudah dan cepat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/layanan/surat"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Layanan Mandiri
            </Link>
            <Link
              href="/profil/tentang"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Jelajahi Profil
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
