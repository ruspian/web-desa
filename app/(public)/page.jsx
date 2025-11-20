import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaRegFile, FaRegUser } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineDateRange } from "react-icons/md";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* hero section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
            alt="Pemandangan Desa"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient dari bawah ke atas */}
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        <div className="container mx-auto px-6 z-10 pt-20">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-400 text-green-300 text-sm font-semibold mb-4 backdrop-blur-md">
              🌱 Official Website Desa Digital
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Membangun Desa, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-200">
                Merawat Tradisi.
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              Portal pelayanan publik dan transparansi Desa Banuroja. Urus surat
              administrasi kini bisa dari rumah.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/layanan"
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
              >
                <FaRegFile size={20} />
                Layanan Mandiri
              </Link>
              <Link
                href="/profil"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Jelajahi Profil
                <FaArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === STATISTIK & FITUR (Bento Grid Style) === */}
      {/* Ini yang bikin beda dari web desa kuno. Kita pake Grid asimetris */}
      <section className="py-20 container mx-auto px-6 mt-5 relative ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1: Statistik Penduduk (Besar) */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FaRegUser size={32} />
              </div>
              <span className="text-gray-400 text-sm">Update Hari Ini</span>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">3,450</h3>
            <p className="text-gray-500 font-medium">Jiwa Penduduk Tercatat</p>
            <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[75%] rounded-full"></div>
            </div>
            <div className="mt-2 flex text-sm text-gray-400 justify-between">
              <span>Laki-laki: 1,700</span>
              <span>Perempuan: 1,750</span>
            </div>
          </div>

          {/* Card 2: Dana Desa (Transparansi) */}
          <div className="md:col-span-1 bg-green-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-700 rounded-full blur-2xl opacity-50"></div>
            <div>
              <IoMdTrendingUp className="mb-4 text-green-300" size={32} />
              <h4 className="text-lg font-medium text-green-200 mb-1">
                Realisasi APBDes
              </h4>
              <p className="text-3xl font-bold">85%</p>
            </div>
            <p className="text-sm text-green-300/80 mt-4">
              Transparansi anggaran tahun 2025.
            </p>
          </div>

          {/* Card 3: Jam Layanan */}
          <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3">
              <MdOutlineDateRange size={24} />
            </div>
            <h4 className="font-bold text-gray-900">Jam Operasional</h4>
            <p className="text-sm text-gray-500 mt-1">Senin - Jumat</p>
            <p className="text-lg font-bold text-gray-800">08:00 - 15:00</p>
            <span className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
              Buka Sekarang
            </span>
          </div>

          {/* Card 4: Berita Utama (Wide) */}
          <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Kabar Desa Terkini</h2>
              <Link
                href="/berita"
                className="text-green-600 font-semibold hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            {/* Grid Berita */}
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="group cursor-pointer">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        item === 1
                          ? "1625246333031-5030a2304a61"
                          : item === 2
                          ? "1560964645-a629e9c2bb5d"
                          : "1500937386664-56d1dfef3854"
                      }?w=800&auto=format&fit=crop`}
                      alt="Berita"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                    Pembangunan
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 group-hover:text-green-700 transition-colors">
                    Pemasangan Paving Block Dusun {item} Selesai Tepat Waktu
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    Kegiatan pembangunan infrastruktur desa telah mencapai
                    target...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
