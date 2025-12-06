import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Pastikan selalu render ulang

function normalizeUrl(url) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

export async function GET() {
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
    console.error("Gagal ambil data sitemap:", error);
  }

  // --- BUILD XML CONTENT MANUAL ---

  // 1. Static Routes
  const staticRoutes = [
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
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add Static
  staticRoutes.forEach((route) => {
    xml += `
  <url>
    <loc>${url}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  });

  // Add Berita
  berita.forEach((item) => {
    xml += `
  <url>
    <loc>${url}/informasi/berita/${item.slug}</loc>
    <lastmod>${(item.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add Potensi
  potensi.forEach((item) => {
    xml += `
  <url>
    <loc>${url}/profil/potensi/${item.id}</loc>
    <lastmod>${(item.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add Agenda
  agenda.forEach((item) => {
    xml += `
  <url>
    <loc>${url}/informasi/agenda</loc>
    <lastmod>${(item.date || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  // --- RETURN RESPONSE DENGAN HEADER XML ---
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=30, stale-while-revalidate", // Cache sebentar biar cepet
    },
  });
}
