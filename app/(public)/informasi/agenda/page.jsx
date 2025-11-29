import PublicAgendaClient from "@/components/client/PublicAgendaClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate setiap 1 jam

export default async function AgendaPage({ searchParams }) {
  const params = await searchParams;
  const category = params.category || "Semua";

  // Filter Kategori
  const whereClause = category !== "Semua" ? { category: category } : {};

  const [allAgenda, categoriesData] = await prisma.$transaction([
    // Ambil semua agenda sesuai filter kategori
    prisma.agenda.findMany({
      where: whereClause,
      orderBy: { date: "asc" }, // Urutkan dari tanggal terdekat
    }),
    // Ambil kategori unik untuk menu tab
    prisma.agenda.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  // Pisahkan Agenda Mendatang & Selesai
  const now = new Date();
  // Set waktu ke 00:00:00 agar agenda hari ini tetap masuk Mendatang
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = [];
  const pastEvents = [];

  allAgenda.forEach((item) => {
    const formattedItem = {
      id: item.id,
      title: item.title,
      category: item.category,
      date: item.date.toISOString(), // Kirim format ISO string
      time: item.time || "Waktu tidak ditentukan",
      location: item.location || "Lokasi tidak ditentukan",
      description: item.description || "",
    };

    // Periksa apakah agenda sudah selesai atau belum
    if (new Date(item.date) >= now) {
      upcomingEvents.push(formattedItem);
    } else {
      pastEvents.push(formattedItem);
    }
  });

  // Balik urutan 'pastEvents' agar yang baru selesai muncul paling atas
  pastEvents.reverse();

  // Format Kategori
  const categoriesList = ["Semua", ...categoriesData.map((c) => c.category)];

  return (
    <PublicAgendaClient
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      categories={categoriesList}
      activeCategory={category}
    />
  );
}
