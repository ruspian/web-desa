import AdminPengaduanClient from "@/components/client/AdminPengaduanClient";
import { prisma } from "@/lib/prisma";

export default async function AdminPengaduanPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const status = params?.status || "all";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  const whereCondition = {
    AND: [
      status !== "all" ? { status: status } : {}, // Filter Status
      query
        ? {
            OR: [
              { tiketId: { contains: query, mode: "insensitive" } },
              { isi: { contains: query, mode: "insensitive" } },
              { nama: { contains: query, mode: "insensitive" } }, // Cari nama pelapor
            ],
          }
        : {},
    ],
  };

  const [pengaduanData, totalCount, statsGroup] = await prisma.$transaction([
    // Data Pengaduan
    prisma.pengaduan.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }, // Terbaru di atas
    }),

    // Total Data
    prisma.pengaduan.count({ where: whereCondition }),

    // Statistik
    prisma.pengaduan.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  // Mapping Data
  const data = pengaduanData.map((item) => ({
    id: item.id,
    ticket: item.tiketId,
    nama: item.isAnonim ? "Anonim" : item.nama || "Warga",
    nik: item.isAnonim ? "-" : item.nik || "-",
    nohp: item.isAnonim ? "-" : item.noHp || "-",
    isAnonim: item.isAnonim,
    kategori: item.kategori,
    lokasi: item.lokasi || "-",
    isi: item.isi,
    foto: item.foto || null,
    status: item.status, // pending, process, done, rejected
    tanggal: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    tanggapan: item.tanggapan || "",
  }));

  // Format Statistik
  const stats = {
    pending: statsGroup.find((s) => s.status === "pending")?._count.id || 0,
    process: statsGroup.find((s) => s.status === "process")?._count.id || 0,
    done: statsGroup.find((s) => s.status === "done")?._count.id || 0,
  };

  return (
    <AdminPengaduanClient
      initialData={data}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
      stats={stats}
    />
  );
}
