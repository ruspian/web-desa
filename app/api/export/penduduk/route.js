import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDateDisplay } from "@/lib/date";

export const GET = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const penduduk = await prisma.penduduk.findMany({
      select: {
        nama: true,
        nik: true,
        jk: true,
        tglLahir: true,
        tempatLahir: true,
        agama: true,
        pendidikan: true,
        pekerjaan: true,
        dusun: true,
        status: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const formatedData = penduduk.map((item, index) => ({
      No: index + 1,
      NIK: item.nik,
      "Nama Lengkap ": item.nama,
      "Jenis Kelamin": item.jk === "L" ? "Laki-laki" : "Perempuan",
      "Tempat Lahir": item.tempatLahir,
      "Tanggal Lahir": formatDateDisplay(item.tglLahir),
      Agama: item.agama,
      Pendidikan: item.pendidikan,
      Pekerjaan: item.pekerjaan,
      Dusun: item.dusun,
      Status: item.status,
    }));

    return NextResponse.json({ data: formatedData }, { status: 200 });
  } catch (error) {
    console.log("gagal mengambil data penduduk:", error || error.message);

    return NextResponse.json(
      { message: "Kesalahan pada server, Coba lagi!" },
      { status: 500 }
    );
  }
};
