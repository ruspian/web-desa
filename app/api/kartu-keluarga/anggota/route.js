import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { kkId, pendudukId, hubungan } = body;

    if (!kkId || !pendudukId || !hubungan) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Update data penduduk
    await prisma.penduduk.update({
      where: { id: pendudukId },
      data: {
        kkId: kkId,
        statusKeluarga: hubungan,
      },
    });

    return NextResponse.json(
      { message: "Anggota berhasil ditambahkan" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menambah anggota" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const pendudukId = searchParams.get("id");

    // Update penduduk
    await prisma.penduduk.update({
      where: { id: pendudukId },
      data: {
        kkId: null,
        statusKeluarga: null,
      },
    });

    return NextResponse.json(
      { message: "Anggota dikeluarkan dari KK" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menghapus anggota" },
      { status: 500 }
    );
  }
};
