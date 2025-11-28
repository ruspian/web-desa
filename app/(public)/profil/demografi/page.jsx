import PublicDemografiClient from "@/components/client/PublicDemografisClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function DemografiPage() {
  // Fetch Semua Data Penduduk yang dibutuhkan
  const penduduk = await prisma.penduduk.findMany({
    where: { status: "HIDUP" },
    select: {
      jk: true,
      tglLahir: true,
      pekerjaan: true,
      pendidikan: true,
    },
  });

  const totalKK = await prisma.kartuKeluarga.count();

  // Proses Data Statistik
  let laki = 0;
  let perempuan = 0;
  let balita = 0;
  let usiaProduktif = 0; // 15-64 tahun

  // Inisialisasi Usia
  const ageGroups = [
    { name: "0-5", min: 0, max: 5, laki: 0, perempuan: 0 },
    { name: "6-12", min: 6, max: 12, laki: 0, perempuan: 0 },
    { name: "13-25", min: 13, max: 25, laki: 0, perempuan: 0 },
    { name: "26-45", min: 26, max: 45, laki: 0, perempuan: 0 },
    { name: "46-60", min: 46, max: 60, laki: 0, perempuan: 0 },
    { name: ">60", min: 61, max: 200, laki: 0, perempuan: 0 },
  ];

  const pekerjaanMap = {};
  const pendidikanMap = {};

  // Looping Data Penduduk
  penduduk.forEach((p) => {
    // Hitung Gender
    if (p.jk === "L") laki++;
    else perempuan++;

    // Hitung Umur
    const age = new Date().getFullYear() - new Date(p.tglLahir).getFullYear();

    if (age <= 5) balita++;
    if (age >= 15 && age <= 64) usiaProduktif++;

    // Masukkan ke Bucket Usia
    const group = ageGroups.find((g) => age >= g.min && age <= g.max);
    if (group) {
      if (p.jk === "L") group.laki++;
      else group.perempuan++;
    }

    // Hitung Pekerjaan
    const job = p.pekerjaan || "Lainnya";
    pekerjaanMap[job] = (pekerjaanMap[job] || 0) + 1;

    // Hitung Pendidikan
    const edu = p.pendidikan || "Tidak Sekolah";
    pendidikanMap[edu] = (pendidikanMap[edu] || 0) + 1;
  });

  // Format Data untuk Chart
  const dataGender = [
    { name: "Laki-laki", value: laki },
    { name: "Perempuan", value: perempuan },
  ];

  // Format Pekerjaan
  const dataPekerjaan = Object.entries(pekerjaanMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item, i) => ({
      ...item,
      color:
        [
          "bg-green-500",
          "bg-blue-500",
          "bg-orange-500",
          "bg-purple-500",
          "bg-gray-400",
        ][i] || "bg-gray-500",
    }));

  // Format Pendidikan
  const dataPendidikan = Object.entries(pendidikanMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4) // Ambil 4 besar
    .map((item, i) => ({
      ...item,
      color:
        [
          "border-l-red-500",
          "border-l-orange-500",
          "border-l-blue-500",
          "border-l-green-500",
        ][i] || "border-l-gray-500",
    }));

  const stats = {
    totalPenduduk: penduduk.length,
    totalKK,
    usiaProduktif,
    balita,
  };

  return (
    <PublicDemografiClient
      stats={stats}
      dataGender={dataGender}
      dataUsia={ageGroups}
      dataPekerjaan={dataPekerjaan}
      dataPendidikan={dataPendidikan}
    />
  );
}
