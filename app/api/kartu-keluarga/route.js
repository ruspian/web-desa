import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const { noKK, kepalaKeluarga, dusun } = body;

    if (!noKK || !kepalaKeluarga || !dusun) {
      return NextResponse.json(
        { message: "Lengkapi data kartu keluarga!" },
        { status: 400 }
      );
    }

    const exitingKartuKeluarga = await prisma.kartuKeluarga.findUnique({
      where: {
        noKK: noKK,
      },
    });

    if (exitingKartuKeluarga) {
      return NextResponse.json(
        { message: "Kartu Keluarga sudah ada!" },
        { status: 400 }
      );
    }

    const result = await prisma.kartuKeluarga.create({
      data: {
        noKK,
        kepalaKeluarga,
        dusun,
      },
    });

    return NextResponse.json(
      { data: result, message: "Data berhasil ditambahkan" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menambahkan kartu keluarga:", error || error.message);

    // tangani data duplikat
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Kartu Keluarga sudah ada!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Kesalahan pada server, Coba lagi!" },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const { id, noKK, kepalaKeluarga, dusun } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Kartu Keluarga tidak ditemukan!" },
        { status: 400 }
      );
    }

    const updatedKartuKeluarga = await prisma.kartuKeluarga.update({
      where: { id: id },
      data: {
        noKK,
        kepalaKeluarga,
        dusun,
      },
    });

    return NextResponse.json(
      { data: updatedKartuKeluarga, message: "Data baerhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal mengupdate kartu keluarga:", error || error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Data tidak ditemukan!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server!" },
      { status: 400 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Kartu keluarga tidak ditemukan!" },
        { status: 401 }
      );
    }

    await prisma.kartuKeluarga.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menghapus data kertu keluarga:", error || error.message);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server!" },
      { status: 500 }
    );
  }
};
