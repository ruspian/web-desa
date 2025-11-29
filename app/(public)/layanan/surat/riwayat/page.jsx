import PublicRiwayatSuratClient from "@/components/client/PublicRiwayatSuratClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const revalidate = 0; // selalu ambil data terbaru

export default async function RiwayatSuratPage() {
  const session = await auth();

  // Cek Login
  if (!session) {
    redirect("/login?callbackUrl=/layanan/surat/riwayat");
  }

  // Ambil NIK dari User Login
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: session.user.username }, { email: session.user.email }],
    },
    select: { nik: true },
  });

  if (!user || !user.nik) {
    return (
      <div className="min-h-screen pt-24 px-6 text-center">
        <p className="text-red-500 font-bold">
          Akun Anda tidak memiliki NIK yang valid.
        </p>
      </div>
    );
  }

  //  Cari Data Penduduk
  const penduduk = await prisma.penduduk.findUnique({
    where: { nik: user.nik },
    select: { id: true },
  });

  if (!penduduk) {
    return (
      <div className="min-h-screen pt-24 px-6 text-center">
        <p className="text-red-500 font-bold">
          Data kependudukan tidak ditemukan untuk NIK ini.
        </p>
      </div>
    );
  }

  // Ambil Riwayat Surat
  const requests = await prisma.suratRequest.findMany({
    where: { pendudukId: penduduk.id },
    orderBy: { createdAt: "desc" },
  });

  //  Mapping Data
  const data = requests.map((item) => ({
    id: item.id,
    jenis: item.jenisSurat,
    nomor: item.nomorSurat || "-",
    tanggal: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    status: item.status,
    fileUrl: item.fileSuratJadi,
    alasan: item.alasanTolak,
  }));

  return <PublicRiwayatSuratClient data={data} />;
}
