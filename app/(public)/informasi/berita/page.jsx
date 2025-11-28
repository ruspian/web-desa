import { prisma } from "@/lib/prisma";
import PublicBeritaClient from "@/components/client/PublicBeritaClient";
import { formatDateDisplay } from "@/lib/date";

export default async function BeritaPage({ searchParams }) {
  const params = await searchParams;

  const query = params.query || "";
  const category = params.category || "Semua";
  const limit = 7;
  const page = Math.max(1, parseInt(params.page) || 1);

  const whereClause = {
    AND: [
      { status: "PUBLISHED" },
      category !== "Semua" ? { category: category } : {},
      query ? { title: { contains: query, mode: "insensitive" } } : {},
    ],
  };

  const [berita, totalCount, categories] = await prisma.$transaction([
    prisma.berita.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.berita.count({ where: whereClause }),
    prisma.berita.findMany({
      where: { status: "PUBLISHED" },
      distinct: ["category"],
      select: {
        category: true,
      },
      orderBy: { category: "asc" },
    }),
  ]);

  const categoriesList = ["Semua", ...categories.map((cat) => cat.category)];

  const totalPage = Math.ceil(totalCount / limit);

  const data = berita.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    content: item.content.replace(/<[^>]+>/g, "").substring(0, 100) + "...", // hapus tag HTML dan ambil 100 karakter pertama
    image: item.image,
    category: item.category,
    author: item.author || "Admin Desa",
    date: formatDateDisplay(item.createdAt),
  }));

  return (
    <PublicBeritaClient
      initialData={data}
      pagination={{ totalItems: totalCount, totalPage, currentPage: page }}
      categories={categoriesList}
      activeCategory={category}
    />
  );
}
