import PublicDetailPotensiClient from "@/components/client/PublicDetailPotensiClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function DetailPotensiPage({ params }) {
  const { id } = await params;

  // Ambil Data Detail
  const potensi = await prisma.potensiDesa.findUnique({
    where: { id: id },
  });

  if (!potensi) {
    notFound();
  }

  //  Ambil Potensi Lainnya
  const related = await prisma.potensiDesa.findMany({
    where: {
      category: potensi.category,
      NOT: { id: potensi.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return <PublicDetailPotensiClient data={potensi} related={related} />;
}
