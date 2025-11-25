import AdminApbdesClient from "@/components/client/AdminApbdesClient";
import { prisma } from "@/lib/prisma";

export default async function AdminApbdesPage({ searchParams }) {
  const params = await searchParams;

  const tahun = parseInt(params?.tahun) || new Date().getFullYear();
  const tab = params?.tab || "income"; // income / expense
  const query = params?.query || "";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  const whereCondition = {
    AND: [
      { tahun: tahun },
      { tipe: tab === "income" ? "INCOME" : "EXPENSE" },
      query ? { kategori: { contains: query, mode: "insensitive" } } : {},
    ],
  };

  const [dataApbdes, totalCount] = await prisma.$transaction([
    prisma.apbdes.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
    prisma.apbdes.count({ where: whereCondition }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  // Kita perlu hitung total Income & Expense terpisah tanpa filter
  const summaryAggregate = await prisma.apbdes.groupBy({
    by: ["tipe"],
    where: { tahun: tahun },
    _sum: {
      anggaran: true,
      realisasi: true,
    },
  });

  //  ambil nilai dari hasil groupBy
  const getSum = (tipe, field) => {
    const found = summaryAggregate.find((s) => s.tipe === tipe);
    return Number(found?._sum[field] || 0);
  };

  const summary = {
    totalIncome: getSum("INCOME", "anggaran"),
    totalExpense: getSum("EXPENSE", "anggaran"),
    // Surplus = Total Pendapatan - Total Belanja
    surplus: getSum("INCOME", "anggaran") - getSum("EXPENSE", "anggaran"),
  };

  // Mapping Data Tabel
  const data = dataApbdes.map((item) => ({
    id: item.id,
    tahun: item.tahun.toString(),
    jenis: item.tipe === "INCOME" ? "income" : "expense",
    kategori: item.kategori,
    anggaran: Number(item.anggaran),
    realisasi: Number(item.realisasi),
  }));

  return (
    <AdminApbdesClient
      initialData={data}
      initialYear={tahun.toString()}
      summary={summary} // Summary dikirim dari server
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
