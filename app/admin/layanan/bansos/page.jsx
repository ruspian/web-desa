import AdminBansosClient from "@/components/client/AdminBansosClient";
import { prisma } from "@/lib/prisma";

export default async function AdminBansosPage({ searchParams }) {
  const params = await searchParams;

  const jenis = params?.jenis || "semua";
  const query = params?.query || "";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  // where consition
  const whereCondition = {
    AND: [
      jenis !== "semua" ? { jenisBansos: jenis } : {},
      query
        ? {
            OR: [
              { penduduk: { nama: { contains: query, mode: "insensitive" } } },
              { penduduk: { nik: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {},
    ],
  };

  const [rawBansosData, totalCount, statsGroup, rawResidents] =
    await prisma.$transaction([
      // Data Bansos
      prisma.bansosPenerima.findMany({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          penduduk: { select: { nik: true, nama: true, dusun: true } },
        },
      }),
      prisma.bansosPenerima.count({ where: whereCondition }),
      prisma.bansosPenerima.groupBy({
        by: ["jenisBansos"],
        where: { status: "Aktif" },
        _count: { id: true },
      }),
      // data penduduk
      prisma.penduduk.findMany({
        where: { status: "HIDUP" },
        select: { id: true, nik: true, nama: true, dusun: true },
        orderBy: { nama: "asc" },
        take: 2000,
      }),
    ]);

  const totalPage = Math.ceil(totalCount / limit);

  const bansosData = rawBansosData.map((item) => ({
    id: item.id,
    jenisBansos: item.jenisBansos,
    periode: item.periode,

    // Konversi Decimal ke Number
    nominal: item.nominal ? Number(item.nominal) : 0,

    status: item.status,
    penduduk: {
      nik: item.penduduk.nik,
      nama: item.penduduk.nama,
      dusun: item.penduduk.dusun,
    },
  }));
  // ----------------------------------------

  // Mapping Stats
  const stats = {
    blt:
      statsGroup.find((s) => s.jenisBansos === "BLT Dana Desa")?._count.id || 0,
    pkh: statsGroup.find((s) => s.jenisBansos === "PKH")?._count.id || 0,
    bpnt:
      statsGroup.find((s) => s.jenisBansos === "BPNT / Sembako")?._count.id ||
      0,
  };

  // Mapping Resident List
  const residentList = rawResidents.map((r) => ({
    id: r.id,
    nik: r.nik,
    nama: r.nama,
    dusun: r.dusun || "",
  }));

  return (
    <AdminBansosClient
      initialData={bansosData}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
      stats={stats}
      residentList={residentList}
    />
  );
}
