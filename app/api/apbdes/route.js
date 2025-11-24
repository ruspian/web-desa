import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { tahun, jenis, kategori, anggaran, realisasi } = body;

    if (!kategori)
      return NextResponse.json(
        { message: "Kategori wajib diisi" },
        { status: 400 }
      );

    const newItem = await prisma.apbdes.create({
      data: {
        tahun: parseInt(tahun),
        tipe: jenis === "income" ? "INCOME" : "EXPENSE", // Map ke Enum Prisma
        kategori,
        anggaran,
        realisasi,
      },
    });

    return NextResponse.json(
      { data: newItem, message: "Berhasil disimpan" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses Ditolak!" }, { status: 401 });

    const body = await req.json();
    const { id, tahun, jenis, kategori, anggaran, realisasi } = body;

    const updatedItem = await prisma.apbdes.update({
      where: { id },
      data: {
        tahun: parseInt(tahun),
        tipe: jenis === "income" ? "INCOME" : "EXPENSE",
        kategori,
        anggaran,
        realisasi,
      },
    });

    return NextResponse.json(
      { data: updatedItem, message: "Berhasil diupdate" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.apbdes.delete({ where: { id } }); // CUID adalah string

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
