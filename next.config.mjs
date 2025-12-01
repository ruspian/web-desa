/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-940ccf6255b54fa799a9b01050e6c227.r2.dev",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Kontrol security HTTP Headers
  async headers() {
    return [
      {
        // Terapkan aturan ini ke semua rute
        source: "/:path*",
        headers: [
          {
            // Mencegah browser menebak tipe file
            // Biar browser gak salah eksekusi file gambar jadi script
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Mencegah Clickjacking
            // Website ini TIDAK BOLEH di-embed di dalam iframe website lain
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Perlindungan XSS dasar di browser lama
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Kontrol informasi Referrer saat user klik link keluar
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            // Kontrol DNS Prefetching
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // Memaksa penggunaan HTTPS
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Mengunci akses fitur browser yang sensitif
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
