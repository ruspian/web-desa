import AdminAgendaClient from "@/components/client/AdminAgendaClient";
import { prisma } from "@/lib/prisma";

export default async function AdminAgendaPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const category = params?.category || "Semua";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  const whereCondition = {
    AND: [
      category !== "Semua" ? { category: category } : {},
      query ? { title: { contains: query, mode: "insensitive" } } : {},
    ],
  };

  const [agendaData, totalCount] = await prisma.$transaction([
    prisma.agenda.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: "asc" }, // Urutkan dari tanggal terdekat
    }),
    prisma.agenda.count({ where: whereCondition }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  const data = agendaData.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    // Format YYYY-MM-DD untuk value input date
    date: item.date.toISOString().split("T")[0],
    time: item.time,
    location: item.location,
    description: item.description || "",
  }));

  return (
    <AdminAgendaClient
      initialData={data}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
