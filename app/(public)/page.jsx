import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  FileText,
  Users,
  TrendingUp,
  CalendarClock,
} from "lucide-react";
import { formatDateDisplay } from "@/lib/date";

export const revalidate = 60; // perbaharui data setiap 60 detik

export default async function Home() {
  // FETCH DATA STATISTIK PENDUDUK
  const totalPenduduk = await prisma.penduduk.count({
    where: { status: "HIDUP" },
  });
  const totalLaki = await prisma.penduduk.count({
    where: { status: "HIDUP", jk: "L" },
  });
  const totalPerempuan = await prisma.penduduk.count({
    where: { status: "HIDUP", jk: "P" },
  });

  // Hitung Persentase Laki/Perempuan
  const persenLaki =
    totalPenduduk > 0 ? Math.round((totalLaki / totalPenduduk) * 100) : 0;

  // FETCH DATA APBDES TAHUN INI
  const currentYear = new Date().getFullYear();
  const apbdesData = await prisma.apbdes.findMany({
    where: { tahun: currentYear },
  });

  const totalAnggaran = apbdesData.reduce(
    (acc, curr) => acc + Number(curr.anggaran),
    0
  );
  const totalRealisasi = apbdesData.reduce(
    (acc, curr) => acc + Number(curr.realisasi),
    0
  );
  const persenApbdes =
    totalAnggaran > 0 ? Math.round((totalRealisasi / totalAnggaran) * 100) : 0;

  //  FETCH BERITA TERBARU
  const beritaTerbaru = await prisma.berita.findMany({
    where: { status: "PUBLISHED" },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // FETCH POTENSI DESA
  const potensiUnggulan = await prisma.potensiDesa.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  // FETCH PROFIL DESA
  const profilDesa = await prisma.profilDesa.findFirst({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center">
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
              Urus surat administrasi kini bisa dari rumah dengan mudah dan
              cepat.
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
      </section>

      {/* STATISTIK & FITUR */}
      <section className="py-20 container mx-auto px-6  relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/*  Statistik Penduduk */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={32} />
              </div>
              <span className="text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
                Update Realtime
              </span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-2">
              {totalPenduduk.toLocaleString()}
            </h3>
            <p className="text-gray-500 font-medium">Jiwa Penduduk Tercatat</p>

            {/* Progress Bar Gender */}
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-blue-600">{persenLaki}% Laki-laki</span>
                <span className="text-pink-500">
                  {100 - persenLaki}% Perempuan
                </span>
              </div>
              <div className="h-3 w-full bg-pink-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${persenLaki}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{totalLaki} Jiwa</span>
                <span>{totalPerempuan} Jiwa</span>
              </div>
            </div>
          </div>

          {/* APBDes */}
          <div className="md:col-span-1 bg-linear-to-br from-emerald-900 to-emerald-800 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div>
              <TrendingUp className="mb-4 text-emerald-300" size={32} />
              <h4 className="text-lg font-medium text-emerald-100 mb-1">
                Realisasi APBDes {currentYear}
              </h4>
              <p className="text-4xl font-bold">{persenApbdes}%</p>
            </div>
            <div>
              <p className="text-sm text-emerald-200/80 mt-4 mb-2">
                Serapan Anggaran
              </p>
              <div className="w-full bg-emerald-900/50 rounded-full h-1.5">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${persenApbdes}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Jam Layanan */}
          <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center hover:border-orange-200 transition-colors">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-4">
              <CalendarClock size={28} />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Jam Operasional</h4>
            <p className="text-sm text-gray-500 mt-1">Senin - Kamis</p>
            <p className="text-2xl font-bold text-gray-800 my-2">
              08:00 - 15:00
            </p>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              Jum&apos;at 08:00 - 11:00
            </span>
          </div>

          {/*  Berita Utama */}
          <div className="md:col-span-4 bg-white p-8 rounded-3xl -z-50 shadow-xl border border-gray-100 mt-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Kabar Desa Terkini
                </h2>
                <p className="text-gray-500 mt-2">
                  Ikuti perkembangan dan kegiatan terbaru di desa kami.
                </p>
              </div>
              <Link
                href="/informasi/berita"
                className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {beritaTerbaru.length > 0 ? (
                beritaTerbaru.map((item) => (
                  <Link
                    key={item.id}
                    href={`/informasi/berita/${item.slug}`}
                    className="group cursor-pointer block"
                  >
                    <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-4 border border-gray-100">
                      <Image
                        src={item.image || "/noImage.jpg"} // Fallback image
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-800 uppercase tracking-wide">
                        {item.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <CalendarClock size={14} />{" "}
                      {formatDateDisplay(item.createdAt)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400">
                    Belum ada berita yang diterbitkan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* POTENSI DESA SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-green-600 font-bold tracking-wider uppercase text-sm bg-green-50 px-3 py-1 rounded-full">
              Jelajahi Potensi
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
              Kekayaan Alam & Produk Lokal
            </h2>
            <p className="text-gray-500">
              Desa Makmur Jaya memiliki berbagai potensi wisata dan produk UMKM
              yang siap mendunia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {potensiUnggulan.map((item) => (
              <div
                key={item.id}
                className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/profil/potensi"
              className="inline-flex items-center gap-2 text-gray-600 font-semibold hover:text-green-600 transition-colors"
            >
              Lihat Semua Potensi <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
