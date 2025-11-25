import AdminBeritaClient from "@/components/client/AdminBeritaClient";
import { prisma } from "@/lib/prisma";

export default async function AdminBeritaPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.query || "";
  const status = params?.status || "all";
  const page = Math.max(1, parseInt(params?.page) || 1);
  const limit = 10;

  const whereCondition = {
    AND: [
      status !== "all"
        ? {
            status:
              status.toUpperCase() === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          }
        : {},
      query ? { title: { contains: query, mode: "insensitive" } } : {},
    ],
  };

  const [posts, totalCount] = await prisma.$transaction([
    prisma.berita.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.berita.count({ where: whereCondition }),
  ]);

  const totalPage = Math.ceil(totalCount / limit);

  const data = posts.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    author: item.author,
    status: item.status.toLowerCase(),
    views: item.views,
    image: item.image,
    content: item.content,
  }));

  return (
    <AdminBeritaClient
      initialData={data}
      pagination={{ totalItems: totalCount, currentPage: page, totalPage }}
    />
  );
}
