import PublicLayananSuratClient from "@/components/client/PublicLayananSuratClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0; // Selalu ambil data terbaru

export default async function LayananSuratPage() {
  const session = await auth();

  // Cek Login
  if (!session) {
    redirect("/login?callbackUrl=/layanan/surat");
  }

  const userAkun = await prisma.user.findFirst({
    where: {
      OR: [{ username: session.user.username }, { email: session.user.email }],
    },
    select: { nik: true },
  });

  // cek apakah user memiliki data NIK
  if (!userAkun || !userAkun.nik) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Akun Bermasalah
          </h2>
          <p className="text-gray-600 mb-6">
            Akun Anda tidak memiliki data NIK yang terhubung. Silakan hubungi
            admin.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Ambil Data Penduduk
  const penduduk = await prisma.penduduk.findUnique({
    where: { nik: userAkun.nik },
    select: {
      id: true,
      nik: true,
      nama: true,
      dusun: true,
    },
  });

  // Jika tidak ditemukan di data penduduk

  // Ambil Daftar Template Surat
  const templates = await prisma.jenisSurat.findMany({
    orderBy: { nama: "asc" },
    select: {
      id: true,
      nama: true,
      fields: true,
    },
  });

  return (
    <PublicLayananSuratClient userPenduduk={penduduk} templates={templates} />
  );
}
