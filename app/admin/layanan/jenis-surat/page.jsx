import AdminPengaturanSuratClient from "@/components/client/AdminPengaturanSuratClient";
import { prisma } from "@/lib/prisma";

export default async function PengaturanSuratPage() {
  const templates = await prisma.jenisSurat.findMany({
    orderBy: { createdAt: "desc" },
  });

  const data = templates.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return <AdminPengaturanSuratClient initialData={data} />;
}
