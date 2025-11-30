import PublicPotensiClient from "@/components/client/PublicPotensiClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function PotensiPage({ searchParams }) {
  const params = await searchParams;
  const activeTab = params.tab || "Semua";
  const limit = 6;
  const page = Math.max(1, parseInt(params?.page) || 1);

  const whereClause = activeTab !== "Semua" ? { category: activeTab } : {};

  // fetch data potensi
  const [potensi, totalCount, categories] = await prisma.$transaction([
    prisma.potensiDesa.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.potensiDesa.count({ where: whereClause }),
    prisma.potensiDesa.findMany({
      distinct: ["category"],
      select: {
        category: true,
      },
      orderBy: { category: "asc" },
    }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  const data = potensi.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    image: item.image,
    location: item.location,
  }));

  const categoryList = ["Semua", ...categories.map((cat) => cat.category)];

  return (
    <PublicPotensiClient
      initialData={data}
      pagination={{ totalItems: totalCount, totalPage, currentPage: page }}
      categories={categoryList}
      activeTab={activeTab}
    />
  );
}
