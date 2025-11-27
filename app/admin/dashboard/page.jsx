import AdminDashboardClient from "@/components/client/AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);
  const lastDayOfYear = new Date(currentYear, 11, 31);

  // --- QUERY PARALLEL ---
  const [
    totalPenduduk,
    suratPending,
    aduanBaru,
    transaksiStats,
    suratTahunan,
    recentSurat,
  ] = await prisma.$transaction([
    // Total Penduduk
    prisma.penduduk.count({ where: { status: "HIDUP" } }),

    // Surat Menunggu Verifikasi
    prisma.suratRequest.count({ where: { status: "PENDING" } }),

    // Pengaduan Belum Dibaca/Pending
    prisma.pengaduan.count({ where: { status: "pending" } }),

    //  Keuangan
    prisma.transaksiKeuangan.groupBy({
      by: ["tipe"],
      _sum: { nominal: true },
    }),

    // Data Grafik Surat
    prisma.suratRequest.findMany({
      where: {
        createdAt: {
          gte: firstDayOfYear,
          lte: lastDayOfYear,
        },
      },
      select: { createdAt: true, status: true },
    }),

    // Aktivitas Terbaru
    prisma.suratRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        penduduk: { select: { nama: true } }, // Ambil nama dari relasi
      },
    }),
  ]);

  //  Hitung Saldo Kas
  const totalMasuk = Number(
    transaksiStats.find((t) => t.tipe === "INCOME")?._sum.nominal || 0
  );
  const totalKeluar = Number(
    transaksiStats.find((t) => t.tipe === "EXPENSE")?._sum.nominal || 0
  );
  const saldoKas = totalMasuk - totalKeluar;

  //  Data Chart
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
  const chartData = months.map((bulan, index) => {
    // Filter data bulan ini
    const monthlyData = suratTahunan.filter(
      (s) => new Date(s.createdAt).getMonth() === index
    );

    return {
      name: bulan,
      masuk: monthlyData.length, // Total request bulan ini
      selesai: monthlyData.filter(
        (s) => s.status === "APPROVED" || s.status === "REJECTED"
      ).length, // Yg sudah diproses
    };
  });

  // Mapping Aktivitas Terbaru
  const recentActivity = recentSurat.map((item) => ({
    id: item.id,
    warga: item.namaSnapshot || item.penduduk?.nama || "Warga",
    jenis: item.jenisSurat,
    tanggal: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: item.status.toLowerCase(),
  }));

  // Gabungkan Statistik
  const stats = {
    penduduk: totalPenduduk,
    suratPending: suratPending,
    aduanPending: aduanBaru,
    saldoKas: saldoKas,
  };

  return (
    <AdminDashboardClient
      stats={stats}
      chartData={chartData}
      recentActivity={recentActivity}
    />
  );
}
