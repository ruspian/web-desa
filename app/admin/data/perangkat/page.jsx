import AdminPerangkatClient from "@/components/client/AdminPerangkatClient";

export default async function AdminPerangkatPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const page = Math.max(1, parseInt(params?.page) || 1); // Mencegah page bernilai negatif atau 0
  const limit = 4;

  const [perangkatDesa, totalCount] = await prisma.$transaction([
    prisma.perangkatDesa.findMany({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { jabatan: { contains: query, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.perangkatDesa.count({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { jabatan: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  const data = perangkatDesa.map((item) => ({
    id: item.id,
    nama: item.nama,
    nip: item.nip,
    jabatan: item.jabatan,
    noHp: item.noHp,
    status: item.status,
    foto: item.foto,
    urutan: item.urutan,
  }));

  return (
    <AdminPerangkatClient
      initialData={data}
      pagination={{
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      }}
    />
  );
}
