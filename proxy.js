import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  // Ambil Token dari Session (Cookies)
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const { pathname } = req.nextUrl;
  const userRole = token?.role; // Ambil role

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
  // Hanya untuk yang butuh login
  // Halaman Cek Bansos & Pengaduan (publik) tidak perlu dicek
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

// KONFIGURASI MATCHER
// Tentukan halaman mana saja yang mau dipantau oleh Middleware
export const config = {
  matcher: [
    "/admin/:path*", // Semua halaman admin
    "/layanan/surat/:path*", // Semua layanan surat
    "/login",
    "/register",
  ],
};
