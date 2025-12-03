import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://desamakmur.vercel.app";

  // Ambil Data Dinamis dari Database
  // Ambil Berita
  const berita = await prisma.berita.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  // Ambil Potensi
  const potensi = await prisma.potensiDesa.findMany({
    select: { id: true, updatedAt: true },
  });

  // Ambil Agenda
  const agenda = await prisma.agenda.findMany({
    select: { id: true, date: true }, // Agenda biasanya jarang diupdate, pakai tanggal acara
  });

  //  Buat URL untuk Data Dinamis
  const beritaUrls = berita.map((post) => ({
    url: `${baseUrl}/informasi/berita/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const potensiUrls = potensi.map((item) => ({
    url: `${baseUrl}/profil/potensi/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // URL Statis
  const routes = [
    "",
    "/profil/tentang",
    "/profil/demografi",
    "/profil/peta",
    "/profil/potensi",
    "/pemerintahan/struktur",
    "/pemerintahan/lembaga",
    "/pemerintahan/transparansi",
    "/informasi/berita",
    "/informasi/agenda",
    "/informasi/galeri",
    "/layanan/surat",
    "/layanan/bantuan",
    "/layanan/pengaduan",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  }));

  // Gabungkan Semua
  return [...routes, ...beritaUrls, ...potensiUrls];
}
