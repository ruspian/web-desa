"use client";

import dynamic from "next/dynamic";
import { MapPin, Compass, ArrowRight, Navigation } from "lucide-react";

// Import Map secara Dynamic (PENTING BUAT NEXT.JS)
const PetaDesa = dynamic(() => import("@/components/PetaDesa"), {
  ssr: false, // Disable Server Side Rendering buat map
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-3xl flex items-center justify-center text-gray-400">
      Memuat Peta...
    </div>
  ),
});

export default function PetaPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Compass size={16} />
            Peta Wilayah
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Jelajahi Wilayah Desa
          </h1>
          <p className="text-gray-500 text-lg">
            Peta digital yang menampilkan lokasi kantor pemerintahan, fasilitas
            umum, dan batas wilayah administrasi Desa Makmur Jaya.
          </p>
        </div>

        {/* LAYOUT UTAMA */}
        <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
          {/* KOLOM KIRI: PETA (Besar) */}
          <div className="lg:col-span-2 h-[400px] lg:h-full">
            <PetaDesa />
          </div>

          {/* KOLOM KANAN: INFO DETAIL (Bento Style) */}
          <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Card Alamat */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Kantor Kepala Desa
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm leading-relaxed">
                    Jl. Raya Makmur No. 1, RT 01 / RW 02, Kecamatan Sukamaju,
                    Kabupaten Wonogiri, Jawa Tengah 57611
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-500"
                  >
                    Buka di Google Maps <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card Batas Wilayah */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation size={18} className="text-orange-500" /> Batas
                Wilayah
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Utara</span>
                  <span className="font-medium text-gray-800">
                    Desa Suka Maju
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Selatan</span>
                  <span className="font-medium text-gray-800">
                    Sungai Bengawan
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Timur</span>
                  <span className="font-medium text-gray-800">
                    Kecamatan Sebelah
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Barat</span>
                  <span className="font-medium text-gray-800">
                    Hutan Lindung
                  </span>
                </li>
              </ul>
            </div>

            {/* Card Statistik Wilayah Kecil */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-center">
                <span className="text-xs text-blue-600 font-bold uppercase">
                  Luas Wilayah
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  450{" "}
                  <span className="text-xs text-gray-500 font-normal">Ha</span>
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl text-center">
                <span className="text-xs text-purple-600 font-bold uppercase">
                  Ketinggian
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  500{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    MDPL
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
