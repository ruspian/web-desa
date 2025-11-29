import { prisma } from "@/lib/prisma";
import PublicGaleriClient from "@/components/client/PublicGaleriClient";

export default async function GaleriPage({ searchParams }) {
  const params = await searchParams;

  const category = params.category || "Semua";
  const limit = 8;
  const page = Math.max(1, parseInt(params.page) || 1);

  const whereClause =
    category && category !== "Semua" ? { category: category } : {};

  const [galeri, totalCount, categories] = await prisma.$transaction([
    prisma.galeri.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.galeri.count({
      where: whereClause,
    }),
    prisma.galeri.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  const data = galeri.map((galeri) => ({
    id: galeri.id,
    caption: galeri.caption,
    image: galeri.image,
    category: galeri.category,
  }));

  const categoriesList = ["Semua", ...categories.map((c) => c.category)];

  return (
    <PublicGaleriClient
      initialData={data}
      categories={categoriesList}
      pagination={{ totalItems: totalCount, currentPage: page, totalPages }}
      activeCategory={category}
    />
  );
}
