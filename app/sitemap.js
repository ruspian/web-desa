import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Pastikan sitemap selalu fresh

// fungsi untuk memastikan URL valid
function normalizeUrl(url) {
  if (!url) return "https://web-desa-six.vercel.app"; // Fallback URL
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

export default async function sitemap() {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    "web-desa-six.vercel.app";
  const url = normalizeUrl(baseUrl);

  // Data Default
  let berita = [];
  let potensi = [];
  let agenda = [];

  try {
    // Ambil Data Dinamis dari Database
    const [beritaData, potensiData, agendaData] = await prisma.$transaction([
      prisma.berita.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.potensiDesa.findMany({
        select: { id: true, updatedAt: true },
      }),
      prisma.agenda.findMany({
        select: { id: true, date: true },
      }),
    ]);

    berita = beritaData;
    potensi = potensiData;
    agenda = agendaData;
  } catch (error) {
    console.error("Gagal generate sitemap data:", error);
  }

  //  Buat URL untuk Data Dinamis
  const beritaUrls = berita.map((post) => ({
    url: `${url}/informasi/berita/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const potensiUrls = potensi.map((item) => ({
    url: `${url}/profil/potensi/${item.id}`,
    lastModified: item.updatedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const agendaUrls = agenda.map((item) => ({
    url: `${url}/informasi/agenda`,
    lastModified: item.date || new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // URL Statis Utama
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
    "/layanan/surat/status",
    "/layanan/pengaduan/status",
  ].map((route) => ({
    url: `${url}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  }));

  // Gabungkan Semua
  return [...routes, ...beritaUrls, ...potensiUrls, ...agendaUrls];
}
