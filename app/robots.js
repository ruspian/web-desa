export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Larang Google masuk ke Admin
    },
    // Tulis URL lengkap secara manual agar pasti benar
    sitemap: "https://web-desa-six.vercel.app/sitemap.xml",
  };
}
