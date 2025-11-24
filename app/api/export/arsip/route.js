import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = async (req) => {
  try {
    // Cek Autentikasi
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    // Ambil Parameter URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || "all";
    const tanggal = searchParams.get("tanggal") || "";

    //  Filter Tanggal
    let dateFilter = {};
    if (tanggal) {
      const startDate = new Date(`${tanggal}T00:00:00`);
      const endDate = new Date(`${tanggal}T23:59:59`);

      dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // Buat Where Condition
    const whereCondition = {
      AND: [
        // tampilkan hanya surat dengan status APPROVED atau REJECTED
        status !== "all"
          ? { status: status.toUpperCase() }
          : { status: { in: ["APPROVED", "REJECTED"] } },

        // Filter Tanggal
        dateFilter,

        // Filter Pencarian
        query
          ? {
              OR: [
                { namaSnapshot: { contains: query, mode: "insensitive" } },
                { nomorSurat: { contains: query, mode: "insensitive" } },
                { jenisSurat: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };

    // 5. Ambil SEMUA Data
    const allData = await prisma.suratRequest.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        penduduk: {
          select: {
            nik: true,
            nama: true,
          },
        },
      },
    });

    // Format Data untuk Excel
    const excelData = allData.map((item) => ({
      "Nomor Surat": item.nomorSurat || "-",
      "Tanggal Dibuat": item.createdAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Nama Pemohon": item.namaSnapshot,
      NIK: item.nikSnapshot,
      "Jenis Surat": item.jenisSurat,
      Keperluan: item.keperluan,
      Status: item.status === "APPROVED" ? "Selesai" : "Ditolak",
      "Alasan Tolak": item.alasanTolak || "-",
    }));

    return NextResponse.json({ data: excelData }, { status: 200 });
  } catch (error) {
    console.error("Error export surat:", error);
    return NextResponse.json({ message: "Gagal export data" }, { status: 500 });
  }
};
