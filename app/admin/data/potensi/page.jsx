import AdminPotensiClient from "@/components/client/AdminPotensiClient";
import { prisma } from "@/lib/prisma";
import React from "react";

const AdminPotensiPage = async ({ searchParams }) => {
  const params = await searchParams;

  const category = params?.cat || "semua";
  const query = params?.q || "";
  const page = Math.max(1, parseInt(params?.page) || 1); // Mencegah page bernilai negatif atau 0
  const limit = 5;

  // buat kondisi untuk where
  const whereCondition = {};

  if (category !== "semua") {
    whereCondition.category = category;
  }

  if (query) {
    whereCondition.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  //  Fetching Data
  const [potensiData, totalCount] = await prisma.$transaction([
    prisma.potensiDesa.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.potensiDesa.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Mapping Data
  const data = potensiData.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    image: item.image,
    location: item.location,
  }));

  return (
    <AdminPotensiClient
      initialData={data}
      pagination={{
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      }}
      paramUrl={{ category, query }}
    />
  );
};

export default AdminPotensiPage;
