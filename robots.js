export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Larang Google masuk halaman Admin & API
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
