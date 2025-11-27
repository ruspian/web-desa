import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import CardStatistikPenduduk from "@/components/cards/CardStatistikPenduduk";
import CardStattistikApbdesPublic from "@/components/cards/CardStattistikApbdesPublic";
import CardJamPelayanan from "@/components/cards/CardJamPelayanan";
import BeritaSection from "@/components/BeritaSection";
import PotensiSection from "@/components/PotensiSection";

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
        <HeroSection profilDesa={profilDesa} />
      </section>

      {/* STATISTIK & FITUR */}
      <section className="py-20 container mx-auto px-6  relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/*  Statistik Penduduk */}
          <CardStatistikPenduduk
            persenLaki={persenLaki}
            totalLaki={totalLaki}
            totalPerempuan={totalPerempuan}
            totalPenduduk={totalPenduduk}
          />

          {/* APBDes */}
          <CardStattistikApbdesPublic persenApbdes={persenApbdes} />

          {/* Jam Layanan */}
          <CardJamPelayanan />

          {/*  Berita Utama */}
          <BeritaSection beritaTerbaru={beritaTerbaru} />
        </div>
      </section>

      {/* POTENSI DESA SECTION */}
      <section className="py-20 bg-white">
        <PotensiSection potensiUnggulan={potensiUnggulan} />
      </section>
    </div>
  );
}
