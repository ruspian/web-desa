import AdminVerifikasiSuratClient from "@/components/client/AdminVerifikasiSuratClient";
import { prisma } from "@/lib/prisma";

export default async function VerifikasiSuratPage({ searchParams }) {
  const params = await searchParams;

  const statusFilter = params?.status || "all";
  const query = params?.query || "";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  const whereCondition = {
    AND: [
      // Filter Status
      statusFilter !== "all" ? { status: statusFilter.toUpperCase() } : {},

      // pencarian
      query
        ? {
            OR: [
              { namaSnapshot: { contains: query, mode: "insensitive" } },
              { jenisSurat: { contains: query, mode: "insensitive" } },
              { nikSnapshot: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [suratData, totalCount, statsGroup] = await prisma.$transaction([
    // Ambil Data Surat
    prisma.suratRequest.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),

    // Hitung Total data
    prisma.suratRequest.count({ where: whereCondition }),

    // Hitung Statistik
    prisma.suratRequest.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  // Format Statistik
  const stats = {
    pending: statsGroup.find((s) => s.status === "PENDING")?._count.status || 0,
    approved:
      statsGroup.find((s) => s.status === "APPROVED")?._count.status || 0,
    rejected:
      statsGroup.find((s) => s.status === "REJECTED")?._count.status || 0,
    total: statsGroup.reduce((acc, curr) => acc + curr._count.status, 0),
  };

  const data = suratData.map((item) => ({
    id: item.id,
    nik: item.nikSnapshot,
    nama: item.namaSnapshot,
    jenisSurat: item.jenisSurat,
    status: item.status.toLowerCase(),
    tanggal: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    keperluan: item.keperluan,
    whatsapp: item.noHp || item.penduduk?.noHp || "-", // Prioritas snapshot, fallback ke relasi
    alasanTolak: item.alasanTolak,
    lampiran: {
      ktp: item.fileKtp,
      kk: item.fileKk,
      pengantar: item.filePengantar,
    },
    extraData: item.extraData,
  }));

  const totalPage = Math.ceil(totalCount / limit);

  return (
    <AdminVerifikasiSuratClient
      initialData={data}
      stats={stats}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
