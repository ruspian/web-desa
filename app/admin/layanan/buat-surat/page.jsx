import AdminBuatSuratClient from "@/components/client/AdminBuatSuratClient";
import { prisma } from "@/lib/prisma";

export default async function BuatSuratPage() {
  // Ambil data penduduk
  const rawResidents = await prisma.penduduk.findMany({
    where: { status: "HIDUP" },
    select: {
      id: true,
      nik: true,
      nama: true,
      jk: true,
      pekerjaan: true,
      dusun: true,
      tempatLahir: true,
      tglLahir: true,
      agama: true,
    },
    orderBy: { nama: "asc" },
  });

  const residentList = rawResidents.map((r) => ({
    id: r.id,
    nik: r.nik,
    nama: r.nama,
    jk: r.jk,
    pekerjaan: r.pekerjaan,
    alamat: r.dusun,
    tempatLahir: r.tempatLahir,
    tglLahir: r.tglLahir.toISOString().split("T")[0],
    agama: r.agama,
  }));

  // Ambil Data Template Surat
  const templates = await prisma.jenisSurat.findMany({
    orderBy: { nama: "asc" },
    select: {
      id: true,
      nama: true,
      kode: true,
      urlTemplate: true,
      fields: true,
    },
  });

  return (
    <AdminBuatSuratClient residentList={residentList} templates={templates} />
  );
}
