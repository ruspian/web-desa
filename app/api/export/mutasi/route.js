import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jenis = searchParams.get("jenis") || "semua";
    const bulan = searchParams.get("bulan") || ""; // Format YYYY-MM

    // Logic Filter
    let dateFilter = {};
    if (bulan) {
      const [year, month] = bulan.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59); // Akhir bulan

      dateFilter = {
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const whereCondition = {
      AND: [jenis !== "semua" ? { jenis: jenis } : {}, dateFilter],
    };

    // Ambil SEMUA data
    const allMutasi = await prisma.mutasiPenduduk.findMany({
      where: whereCondition,
      orderBy: { tanggal: "desc" },
      include: {
        penduduk: { select: { nama: true, nik: true } },
      },
    });

    // Format Data untuk Excel
    const excelData = allMutasi.map((item) => ({
      "Jenis Mutasi": item.jenis,
      "Tanggal Kejadian": new Date(item.tanggal).toLocaleDateString("id-ID"),
      "Nama Warga": item.penduduk ? item.penduduk.nama : item.namaWarga,
      NIK: item.penduduk ? item.penduduk.nik : item.nik || "-",
      Keterangan: item.keterangan,
      Arus:
        item.jenis === "Kelahiran" || item.jenis === "Pindah Masuk"
          ? "Bertambah"
          : "Berkurang",
    }));

    return NextResponse.json({ data: excelData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal export data" }, { status: 500 });
  }
};
