export default function robots() {
  // Gunakan logika fallback yang sama dengan sitemap.js
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://web-desa-six.vercel.app");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Larang Google masuk halaman Admin & API
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
