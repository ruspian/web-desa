import Image from "next/image";
import { CheckCircle, Map, Target, History, ArrowRight } from "lucide-react";

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {" "}
      {/* pt-20 biar gak ketutup navbar fixed */}
      {/* === HEADER SECTION === */}
      <section className="bg-green-50 py-16 border-b border-green-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-green-600 font-bold tracking-wider uppercase text-sm">
            Profil Desa
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Mengenal Desa Makmur Jaya
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Sebuah desa yang terletak di kaki gunung, menjunjung tinggi adat
            istiadat dengan sentuhan inovasi teknologi untuk kesejahteraan
            warga.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-6 py-16 space-y-24">
        {/* === 1. VISI & MISI (Layout Kiri-Kanan) === */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="https://images.unsplash.com/photo-1516216628259-63eb6fd6932f?w=800&auto=format&fit=crop"
              alt="Suasana Desa"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="font-bold text-lg">Bapak Budi Santoso</p>
                <p className="text-sm opacity-80">
                  Kepala Desa Periode 2020 - 2026
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Target size={16} />
              Visi & Misi
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              &quot;Terwujudnya Desa Makmur Jaya yang Mandiri, Cerdas, dan
              Berakhlak Mulia.&quot;
            </h2>

            <div className="space-y-4">
              {/* List Misi dengan Style Card Kecil */}
              {[
                "Meningkatkan kualitas pelayanan publik berbasis digital.",
                "Mewujudkan transparansi pengelolaan keuangan desa.",
                "Mengembangkan potensi wisata dan UMKM lokal.",
                "Meningkatkan kualitas sumber daya manusia melalui pendidikan.",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === 2. SEJARAH DESA (Timeline Style) === */}
        <section className="relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
              <History size={16} />
              Perjalanan Kami
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Sejarah Singkat
            </h2>
          </div>

          {/* Garis Tengah Timeline (Hidden di Mobile) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

          <div className="space-y-12">
            {/* Timeline Item 1 (Kiri) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  1985 - Pembentukan
                </h3>
                <p className="text-gray-500 mt-2">
                  Desa Makmur Jaya resmi memisahkan diri dari Desa Induk.
                  Dipimpin oleh Kepala Desa pertama, Bpk. H. Soleh, dengan fokus
                  pada pembukaan lahan pertanian.
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-md hidden md:block"></div>
              <div className="w-full md:w-1/2 md:pl-12 order-1 md:order-2">
                <div className="h-64 relative rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1599930136576-c83584a053b0?w=800&auto=format&fit=crop"
                    alt="Sejarah Lama"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Item 2 (Kanan) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:w-1/2 md:pr-12 md:text-right order-1">
                <div className="h-64 relative rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1530840197133-fa290fa714eb?w=800&auto=format&fit=crop"
                    alt="Pembangunan Jalan"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-md hidden md:block"></div>
              <div className="w-full md:w-1/2 md:pl-12 order-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  2010 - Era Infrastruktur
                </h3>
                <p className="text-gray-500 mt-2">
                  Pengaspalan jalan utama desa sepanjang 5km dan pembangunan
                  Balai Desa yang baru. Ekonomi warga mulai meningkat pesat.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 (Kiri) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  2025 - Desa Digital
                </h3>
                <p className="text-gray-500 mt-2">
                  Transformasi menjadi desa berbasis digital dengan peluncuran
                  sistem pelayanan mandiri dan website resmi yang terintegrasi.
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-md hidden md:block"></div>
              <div className="w-full md:w-1/2 md:pl-12 order-1 md:order-2">
                <div className="h-64 relative rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop"
                    alt="Desa Digital"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === 3. GEOGRAFIS (Bento Grid Kecil) === */}
        <section className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Hiasan Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-4">
                <Map size={16} />
                Geografis
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Wilayah Strategis & Subur
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Desa Makmur Jaya terletak di ketinggian 500mdpl dengan curah
                hujan yang cukup, menjadikan tanah di sini sangat cocok untuk
                pertanian padi dan perkebunan kopi.
              </p>
              <button className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition">
                Lihat Peta Desa <ArrowRight size={18} />
              </button>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Luas Wilayah</p>
                <p className="text-2xl font-bold mt-1">
                  450{" "}
                  <span className="text-base font-normal text-gray-400">
                    Ha
                  </span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Jml. Dusun</p>
                <p className="text-2xl font-bold mt-1">
                  5{" "}
                  <span className="text-base font-normal text-gray-400">
                    Dusun
                  </span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Ketinggian</p>
                <p className="text-2xl font-bold mt-1">
                  500{" "}
                  <span className="text-base font-normal text-gray-400">
                    Mdpl
                  </span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Suhu Rata-rata</p>
                <p className="text-2xl font-bold mt-1">
                  24{" "}
                  <span className="text-base font-normal text-gray-400">
                    °C
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
