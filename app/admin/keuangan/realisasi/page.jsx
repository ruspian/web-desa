import AdminRealisasiClient from "@/components/client/AdminRealisasiClient";
import { prisma } from "@/lib/prisma";

export default async function RealisasiPage({ searchParams }) {
  const params = await searchParams;

  const currentYear = new Date().getFullYear();

  // Ambil params dari URL
  const query = params?.query || "";
  const tipe = params?.tipe || "all";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  //   Filter Database
  const whereCondition = {
    AND: [
      // Filter Tipe
      tipe !== "all" ? { tipe: tipe === "income" ? "INCOME" : "EXPENSE" } : {},

      // Search
      query ? { uraian: { contains: query, mode: "insensitive" } } : {},
    ],
  };

  const [rawTransactions, totalCount, rawBudget, statsAggregate, chartDataRaw] =
    await prisma.$transaction([
      // List Transaksi
      prisma.transaksiKeuangan.findMany({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { tanggal: "desc" },
      }),

      // Total Count
      prisma.transaksiKeuangan.count({ where: whereCondition }),

      // Kategori Anggaran
      prisma.apbdes.findMany({
        where: { tahun: currentYear },
        select: { id: true, kategori: true, tipe: true },
        orderBy: { kategori: "asc" },
      }),

      //  Hitung Saldo Kas Global
      prisma.transaksiKeuangan.groupBy({
        by: ["tipe"],
        _sum: { nominal: true },
      }),

      // Data Chart
      prisma.transaksiKeuangan.findMany({
        where: {
          tanggal: {
            gte: new Date(`${currentYear}-01-01`),
            lte: new Date(`${currentYear}-12-31`),
          },
        },
        select: { tanggal: true, tipe: true, nominal: true },
      }),
    ]);

  // Mapping List Transaksi
  const transactions = rawTransactions.map((t) => ({
    id: t.id,
    tanggal: t.tanggal.toISOString().split("T")[0],
    uraian: t.uraian,
    kategori: t.kategori,
    tipe: t.tipe === "INCOME" ? "income" : "expense",
    nominal: Number(t.nominal),
    bukti: t.bukti,
  }));

  // 2. Hitung Saldo Kas
  const totalMasuk = Number(
    statsAggregate.find((s) => s.tipe === "INCOME")?._sum.nominal || 0
  );
  const totalKeluar = Number(
    statsAggregate.find((s) => s.tipe === "EXPENSE")?._sum.nominal || 0
  );
  const saldoKas = totalMasuk - totalKeluar;

  // Siapkan Data Chart Bulanan
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const chartData = Array(12)
    .fill(0)
    .map((_, i) => ({ bulan: months[i], pendapatan: 0, belanja: 0 }));

  chartDataRaw.forEach((t) => {
    const monthIndex = t.tanggal.getMonth();
    const amount = Number(t.nominal);
    if (t.tipe === "INCOME") {
      chartData[monthIndex].pendapatan += amount;
    } else {
      chartData[monthIndex].belanja += amount;
    }
  });

  //  Mapping Budget Categories
  const budgetCategories = rawBudget.map((b) => ({
    id: b.id,
    label: b.kategori,
    type: b.tipe === "INCOME" ? "income" : "expense",
  }));

  const totalPage = Math.ceil(totalCount / limit);

  return (
    <AdminRealisasiClient
      initialTransactions={transactions}
      chartData={chartData}
      saldoKas={saldoKas}
      lastUpdate={rawTransactions[0]?.createdAt || new Date()}
      budgetCategories={budgetCategories}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
