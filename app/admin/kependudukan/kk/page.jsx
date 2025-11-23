import AdminKartuKeluargaClient from "@/components/client/AdminKartuKeluargaClient";

export default async function KartuKeluargaPage({ searchParams }) {
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
              { kepalaKeluarga: { contains: query, mode: "insensitive" } },
              { noKK: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [rawKK, totalCount, rawCandidates] = await prisma.$transaction([
    //  Ambil Data KK
    prisma.kartuKeluarga.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        anggota: true,
      },
    }),

    //  Hitung Total KK
    prisma.kartuKeluarga.count({
      where: whereCondition,
    }),

    // AMBIL PENDUDUK TANPA KK
    prisma.penduduk.findMany({
      where: {
        kkId: null, // Cari yang belum punya KK
        status: "HIDUP", // Hanya yang masih hidup
      },
      select: {
        id: true,
        nik: true,
        nama: true,
      },
      orderBy: { nama: "asc" },
      take: 1000, // Batasi agar tidak terlalu berat jika data ribuan
    }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  // mapping data kk
  const data = rawKK.map((item) => ({
    id: item.id,
    noKK: item.noKK,
    kepalaKeluarga: item.kepalaKeluarga,
    alamat: item.alamat || "",
    dusun: item.dusun,

    anggota: item.anggota.map((anggota) => ({
      id: anggota.id,
      nik: anggota.nik,
      nama: anggota.nama,
      hubungan: anggota.statusKeluarga || "Anggota", // Pastikan field ini sesuai schema
    })),

    // Serialisasi Tanggal
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  // Mapping Data penduduk
  const candidateList = rawCandidates.map((c) => ({
    id: c.id,
    nik: c.nik,
    nama: c.nama,
  }));

  return (
    <AdminKartuKeluargaClient
      initialData={data}
      candidateList={candidateList}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
