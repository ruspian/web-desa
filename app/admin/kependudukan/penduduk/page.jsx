import AdminPendudukClient from "@/components/client/AdminPendudukClient";
import { prisma } from "@/lib/prisma";

export default async function DataPendudukPage({ searchParams }) {
  const params = await searchParams;

  const alamat = params?.alamat || "semua";
  const query = params?.query || "";
  const page = Math.max(1, parseInt(params?.page) || 1); // cegah page bernilai negatif atau 0
  const limit = 10;

  const whereCondition = {
    AND: [
      // Filter alamat Jika ada
      alamat !== "semua" ? { dusun: alamat } : {},

      // Filter Search
      query
        ? {
            OR: [
              { nama: { contains: query, mode: "insensitive" } },
              { nik: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [penduduk, totalCount] = await prisma.$transaction([
    prisma.penduduk.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.penduduk.count({
      where: whereCondition,
    }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  const data = penduduk.map((item) => ({
    id: item.id,
    nik: item.nik,
    nama: item.nama,
    jk: item.jk,
    tglLahir: item.tglLahir.toISOString().split("T")[0],
    tempatLahir: item.tempatLahir,
    agama: item.agama,
    pendidikan: item.pendidikan,
    pekerjaan: item.pekerjaan,
    dusun: item.dusun,
    status: item.status,
  }));
  return (
    <AdminPendudukClient
      initialData={data}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
