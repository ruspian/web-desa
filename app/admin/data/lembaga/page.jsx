import AdminLembagaClient from "@/components/client/AdminLembagaClient";
import { prisma } from "@/lib/prisma";

export default async function AdminLembagaPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const page = Math.max(1, parseInt(params?.page) || 1); // Mencegah page bernilai negatif atau 0
  const limit = 4;

  const [lembaga, totalCount] = await prisma.$transaction([
    prisma.lembagaDesa.findMany({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { singkatan: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
    prisma.lembagaDesa.count({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { singkatan: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  const data = lembaga.map((item) => ({
    id: item.id,
    nama: item.nama,
    singkatan: item.singkatan,
    ketua: item.ketua,
    anggota: item.anggota,
    warna: item.warna,
    deskripsi: item.deskripsi,
    logo: item.logo || null,
  }));

  return (
    <AdminLembagaClient
      initialData={data}
      pagination={{ currentPage: page, totalPage, totalItems: totalCount }}
    />
  );
}
