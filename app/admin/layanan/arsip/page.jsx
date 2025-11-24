import AdminArsipSuratClient from "@/components/client/AdminArsipSuratClient";
import { prisma } from "@/lib/prisma";

export default async function ArsipSuratPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const status = params?.status || "all";
  const tanggal = params?.tanggal || "";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  // Filter Tanggal
  let dateFilter = {};
  if (tanggal) {
    const startDate = new Date(`${tanggal}T00:00:00`);
    const endDate = new Date(`${tanggal}T23:59:59`);

    dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  // buat where condition
  const whereCondition = {
    AND: [
      status !== "all"
        ? { status: status.toUpperCase() }
        : { status: { in: ["APPROVED", "REJECTED"] } },

      dateFilter, // Filter tanggal spesifik

      query
        ? {
            OR: [
              { namaSnapshot: { contains: query, mode: "insensitive" } },
              { nomorSurat: { contains: query, mode: "insensitive" } },
              { jenisSurat: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  // Query Database
  const [suratData, totalCount] = await prisma.$transaction([
    prisma.suratRequest.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }, // Terbaru di atas
    }),
    prisma.suratRequest.count({ where: whereCondition }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  // Mapping Data
  const data = suratData.map((item) => ({
    id: item.id,
    tanggal: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    rawTanggal: item.createdAt.toISOString(),
    pemohon: item.namaSnapshot,
    nik: item.nikSnapshot,
    jenis: item.jenisSurat,
    nomorSurat: item.nomorSurat || "-",
    status: item.status.toLowerCase(),
    admin: "Admin Desa",
  }));

  return (
    <AdminArsipSuratClient
      initialData={data}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
