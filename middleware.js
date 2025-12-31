import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Simpan data rate limit di memori (Map: IP -> Timestamp Terakhir)
const rateLimitMap = new Map();

// Konfigurasi Rate Limit
const RATE_LIMIT_WINDOW = 3000; // Jeda waktu minimal per request -> 3 detik
const PUBLIC_API_PATHS = [
  "/api/cek-bansos",
  "/api/cek-pengaduan",
  "/api/search",
];
export default async function middleware(req) {
  // Ambil Token dari Session (Cookies)
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // --- DEBUGGING TINGKAT LANJUT ---
  console.log("========================================");
  console.log("DEBUG: Akses ke", req.nextUrl.pathname);

  // 1. Cek Cookie apa yang dikirim Browser
  const allCookies = req.cookies.getAll();
  console.log(
    "LIST COOKIE MASUK:",
    allCookies.map((c) => `${c.name}`)
  );

  // 2. Cek apakah ada cookie session utama
  const secureCookie = req.cookies.get("__Secure-authjs.session-token");
  const normalCookie = req.cookies.get("authjs.session-token");
  const nextAuthCookie = req.cookies.get("next-auth.session-token"); // Cek nama lama

  console.log("Cek Cookie Spesifik:");
  console.log(" - __Secure-authjs... :", secureCookie ? "ADA" : "KOSONG");
  console.log(" - authjs...          :", normalCookie ? "ADA" : "KOSONG");
  console.log(" - next-auth...       :", nextAuthCookie ? "ADA" : "KOSONG");

  // 3. Hasil getToken
  console.log("HASIL DECODE TOKEN:", token ? "BERHASIL" : "GAGAL (NULL)");
  console.log("========================================");

  const { pathname } = req.nextUrl;
  const userRole = token?.role; // Ambil role

  // Ambil IP client
  const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

  // Cek apakah URL yang diakses termasuk API publik yang perlu dibatasi
  if (PUBLIC_API_PATHS.some((path) => pathname.startsWith(path))) {
    const lastRequest = rateLimitMap.get(ip);
    const now = Date.now();

    if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
      // Hitung sisa waktu tunggu
      const timeLeft = Math.ceil(
        (RATE_LIMIT_WINDOW - (now - lastRequest)) / 1000
      );

      return NextResponse.json(
        {
          message: `Terlalu banyak permintaan. Tunggu ${timeLeft} detik lagi.`,
        },
        { status: 429, headers: { "Retry-After": timeLeft } }
      );
    }

    // Update waktu request terakhir
    rateLimitMap.set(ip, now);

    // Bersihkan memori dari IP lama setiap 5 menit (Optional, biar RAM gak penuh)
    if (rateLimitMap.size > 1000) {
      rateLimitMap.clear();
    }
  }

  // PROTEKSI HALAMAN ADMIN
  if (pathname.startsWith("/admin")) {
    // Kalau belum login, tendang ke login
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname); // Biar abis login balik ke /admin
      return NextResponse.redirect(url);
    }

    // Kalau login tapi bukan ADMIN, tendang ke home
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // PROTEKSI HALAMAN LAYANAN
  if (pathname.startsWith("/layanan/surat")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Kalau sudah login, gak boleh masuk halaman Login/Register lagi
  const authPages = ["/login", "/register"];
  if (authPages.includes(pathname) && token) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// KONFIGURASI HALAMAN PROTEKSI
export const config = {
  matcher: [
    // amankan halaman ui
    "/admin/:path*",
    "/layanan/surat/:path*",
    "/login",
    "/register",

    // amankan halaman api -> rate limit
    "/api/cek-bansos",
    "/api/cek-pengaduan",
    "/api/search",
  ],
};
