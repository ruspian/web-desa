import AdminApbdesClient from "@/components/client/AdminApbdesClient";
import { prisma } from "@/lib/prisma";

export default async function AdminApbdesPage({ searchParams }) {
  const params = await searchParams;
  const tahun = parseInt(params?.tahun) || new Date().getFullYear(); // Default tahun ini

  // 1. Ambil Data APBDes Sesuai Tahun
  const rawData = await prisma.apbdes.findMany({
    where: { tahun: tahun },
    orderBy: { createdAt: "asc" },
  });

  // 2. Mapping & Konversi Decimal ke Number
  const data = rawData.map((item) => ({
    id: item.id,
    tahun: item.tahun.toString(),
    jenis: item.tipe === "INCOME" ? "income" : "expense", // Sesuaikan dengan state client
    kategori: item.kategori,
    anggaran: Number(item.anggaran),
    realisasi: Number(item.realisasi),
  }));

  // 3. Hitung Statistik Server Side (Biar Cepat)
  const totalIncome = data
    .filter((i) => i.jenis === "income")
    .reduce((acc, curr) => acc + curr.anggaran, 0);

  const totalExpense = data
    .filter((i) => i.jenis === "expense")
    .reduce((acc, curr) => acc + curr.anggaran, 0);

  const surplus = totalIncome - totalExpense;

  return (
    <AdminApbdesClient
      initialData={data}
      initialYear={tahun.toString()}
      summary={{ totalIncome, totalExpense, surplus }}
    />
  );
}
