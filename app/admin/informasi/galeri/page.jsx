import AdminGaleriClient from "@/components/client/AdminGaleriClient";
import { prisma } from "@/lib/prisma";

export default async function AdminGaleriPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.q || "";
  const category = params?.cat || "Semua";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 12;

  const whereCondition = {
    AND: [
      // Filter Kategori
      category !== "Semua" ? { category: category } : {},

      // Filter Search
      query ? { caption: { contains: query, mode: "insensitive" } } : {},
    ],
  };

  const [rawData, totalCount] = await prisma.$transaction([
    prisma.galeri.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.galeri.count({ where: whereCondition }), // Hitung total foto
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  const data = rawData.map((item) => ({
    id: item.id,
    caption: item.caption,
    category: item.category || "Umum",
    image: item.image,
    date: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <AdminGaleriClient
      initialData={data}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
