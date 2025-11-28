import PublicApbdesClient from "@/components/client/PublicApbdesPage";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR 60 detik

export default async function TransparansiPage({ searchParams }) {
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const selectedYear = params?.tahun ? parseInt(params.tahun) : currentYear;

  // Ambil Data APBDes sesuai Tahun
  const apbdesData = await prisma.apbdes.findMany({
    where: { tahun: selectedYear },
  });

  //  Ambil List Tahun yang tersedia
  const yearsData = await prisma.apbdes.findMany({
    distinct: ["tahun"],
    select: { tahun: true },
    orderBy: { tahun: "desc" },
  });

  // Kalau kosong, default tahun ini
  const yearsList =
    yearsData.length > 0
      ? yearsData.map((y) => y.tahun)
      : [currentYear, currentYear - 1];

  //  PENDAPATAN
  const dataIncome = apbdesData
    .filter((item) => item.tipe === "INCOME")
    .map((item) => ({
      name: item.kategori,
      value: Number(item.anggaran), // Pagu Anggaran Pendapatan
    }));

  // BELANJA
  const dataExpense = apbdesData
    .filter((item) => item.tipe === "EXPENSE")
    .map((item) => ({
      id: item.id,
      category: item.kategori,
      budget: Number(item.anggaran),
      realization: Number(item.realisasi),
    }));

  //  RINGKASAN TOTAL
  const totalIncome = apbdesData
    .filter((i) => i.tipe === "INCOME")
    .reduce((acc, curr) => acc + Number(curr.anggaran), 0);

  const totalExpense = apbdesData
    .filter((i) => i.tipe === "EXPENSE")
    .reduce((acc, curr) => acc + Number(curr.anggaran), 0); // Pagu Belanja

  const summary = {
    income: totalIncome,
    expense: totalExpense,
    surplus: totalIncome - totalExpense,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <PublicApbdesClient
        summary={summary}
        dataIncome={dataIncome}
        dataExpense={dataExpense}
        selectedYear={selectedYear}
        yearsList={yearsList}
      />
    </main>
  );
}
