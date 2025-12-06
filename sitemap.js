import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Pastikan sitemap selalu fresh

function normalizeUrl(url) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || "web-desa-six.vercel.app";
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
  ].map((route) => ({
    loc: `${url}${route}`,
    lastmod: new Date().toISOString(),
  }));

  const beritaUrls = berita.map((b) => ({
    loc: `${url}/informasi/berita/${b.slug}`,
    lastmod: new Date(b.updatedAt).toISOString(),
  }));

  const potensiUrls = potensi.map((p) => ({
    loc: `${url}/profil/potensi/${p.id}`,
    lastmod: new Date(p.updatedAt).toISOString(),
  }));

  const agendaUrls = agenda.map((a) => ({
    loc: `${url}/informasi/agenda/${a.id}`,
    lastmod: new Date(a.date).toISOString(),
  }));

  const urls = [...staticRoutes, ...beritaUrls, ...potensiUrls, ...agendaUrls];

  // **Generate XML**
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${u.loc}</loc>
  <lastmod>${u.lastmod}</lastmod>
</url>`
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
