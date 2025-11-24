import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { nik, jenis, periode, nominal, status } = body;

    // Cari Penduduk berdasarkan NIK
    const penduduk = await prisma.penduduk.findUnique({ where: { nik } });
    if (!penduduk) {
      return NextResponse.json(
        { message: "NIK tidak ditemukan di data penduduk!" },
        { status: 404 }
      );
    }

    // Cek Duplikat
    const existing = await prisma.bansosPenerima.findFirst({
      where: { pendudukId: penduduk.id, jenisBansos: jenis, periode: periode },
    });
    if (existing) {
      return NextResponse.json(
        {
          message:
            "Warga ini sudah terdaftar di bantuan ini pada periode tersebut.",
        },
        { status: 400 }
      );
    }

    await prisma.bansosPenerima.create({
      data: {
        pendudukId: penduduk.id,
        jenisBansos: jenis,
        periode,
        nominal,
        status,
      },
    });

    return NextResponse.json({ message: "Berhasil" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { id, jenis, periode, nominal, status } = body;

    await prisma.bansosPenerima.update({
      where: { id },
      data: { jenisBansos: jenis, periode, nominal, status },
    });

    return NextResponse.json({ message: "Update berhasil" }, { status: 200 });
  } catch (error) {
    console.log("gagal memperbaharui data bansos: ", error || error.message);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

// --- DELETE ---
export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.bansosPenerima.delete({ where: { id: id } });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.log("gagal menghapus penerima bansos:", error || error.message);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
