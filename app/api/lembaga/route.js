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
    const { nama, singkatan, ketua, anggota, warna, deskripsi, logo } = body;

    if (!nama || !singkatan || !anggota) {
      return NextResponse.json(
        { message: "Nama, Singkatan, dan Anggota wajib diisi!" },
        { status: 400 }
      );
    }

    const newLembaga = await prisma.lembagaDesa.create({
      data: {
        nama,
        singkatan,
        ketua,
        anggota,
        warna,
        deskripsi,
        logo: logo || null,
      },
    });

    return NextResponse.json(
      { data: newLembaga, message: "Data berhasil disimpan!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("gagal membuat data lembaga: ", error || error.message);

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
    const { id, nama, singkatan, ketua, anggota, warna, deskripsi, logo } =
      body;

    if (!id) {
      return NextResponse.json(
        { message: "Lembaga tidak ditemukan!" },
        { status: 400 }
      );
    }

    const updatedLembaga = await prisma.lembagaDesa.update({
      where: { id: id },
      data: {
        nama,
        singkatan,
        ketua,
        anggota,
        warna,
        deskripsi,
        logo: logo || null,
      },
    });

    return NextResponse.json(
      { data: updatedLembaga, message: "Data berhasil diperbarui!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal memperbaharui data lembaga: ", error || error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Lembaga tidak ditemukan!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Kesalahan pada server, Coba lagi!" },
      { status: 500 }
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
        { message: "Lembaga tidak ditemukan!" },
        { status: 400 }
      );
    }

    await prisma.lembagaDesa.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menhapus data lembaga: ", error || error.message);

    return NextResponse.json(
      { message: "Kesalahan pada server, Coba lagi!" },
      { status: 500 }
    );
  }
};
