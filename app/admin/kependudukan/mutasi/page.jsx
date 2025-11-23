import AdminMutasiWargaClient from "@/components/client/AdminMutasiWargaClient";
import { prisma } from "@/lib/prisma";

export default async function MutasiWargaPage({ searchParams }) {
  const params = await searchParams;

  const jenis = params?.jenis || "semua";
  const bulan = params?.bulan || "";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  let dateFilter = {};
  if (bulan) {
    const [year, month] = bulan.split("-");
    // Awal bulan
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    // Akhir bulan
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    dateFilter = {
      tanggal: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  const whereCondition = {
    AND: [jenis !== "semua" ? { jenis: jenis } : {}, dateFilter],
  };

  // Query Transaksi
  const [mutasiData, totalCount, penduduk] = await prisma.$transaction([
    prisma.mutasiPenduduk.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { tanggal: "desc" }, // Urutkan kejadian terbaru di atas
      include: {
        penduduk: {
          select: { id: true, nik: true, nama: true }, // Ambil detail warga
        },
      },
    }),

    prisma.mutasiPenduduk.count({ where: whereCondition }),

    prisma.penduduk.findMany({
      select: { id: true, nik: true, nama: true },
      orderBy: { nama: "asc" },
      take: 1000,
    }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  // Mapping Data Mutasi
  const data = mutasiData.map((item) => ({
    id: item.id,
    jenis: item.jenis,
    tanggal: item.tanggal.toISOString().split("T")[0],
    keterangan: item.keterangan || "",

    //  Kalau relasi penduduk ada, pakai itu. Kalau dihapus, pakai backup namaWarga.
    namaWarga: item.penduduk ? item.penduduk.nama : item.namaWarga,
    nik: item.penduduk ? item.penduduk.nik : "-",

    // ID relasi
    pendudukId: item.pendudukId,
  }));

  // Mapping List Warga
  const pendudukList = penduduk.map((c) => ({
    id: c.id,
    nik: c.nik,
    nama: c.nama,
  }));

  return (
    <AdminMutasiWargaClient
      initialData={data}
      residentList={pendudukList}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
