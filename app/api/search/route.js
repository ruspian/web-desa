import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 3) {
      return NextResponse.json({
        results: { berita: [], agenda: [], potensi: [] },
      });
    }

    // Cari di 3 Tabel Sekaligus
    const [berita, agenda, potensi] = await prisma.$transaction([
      // Cari Berita
      prisma.berita.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 3, // Ambil 3 teratas
        select: { id: true, title: true, slug: true, category: true },
      }),

      // Cari Agenda
      prisma.agenda.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 3,
        select: { id: true, title: true, date: true },
      }),

      // Cari Potensi
      prisma.potensiDesa.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 3,
        select: { id: true, title: true, category: true },
      }),
    ]);

    return NextResponse.json({
      berita,
      agenda,
      potensi,
    });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
