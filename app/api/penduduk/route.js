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
    const {
      nama,
      nik,
      jk,
      tglLahir,
      tempatLahir,
      agama,
      pendidikan,
      pekerjaan,
      dusun,
      status,
    } = body;

    if (!nama || !nik || !jk || !tglLahir || !agama || !status) {
      return NextResponse.json(
        { message: "Lengkapi data penduduk!" },
        { status: 400 }
      );
    }

    const exitingPenduduk = await prisma.penduduk.findUnique({
      where: { nik: String(nik) },
    });

    if (exitingPenduduk) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar!" },
        { status: 400 }
      );
    }

    const newPenduduk = await prisma.penduduk.create({
      data: {
        nama,
        nik,
        jk,
        tglLahir: new Date(tglLahir),
        tempatLahir,
        agama,
        pendidikan,
        pekerjaan,
        dusun,
        status,
      },
    });

    return NextResponse.json(
      { data: newPenduduk, message: "Penduduk berhasil ditambahkan!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menambahkan data penduduk: ", error || error.message);

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "NIK sudah terdaftar!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan di server!" },
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
    const {
      id,
      nama,
      nik,
      jk,
      tglLahir,
      tempatLahir,
      agama,
      pendidikan,
      pekerjaan,
      dusun,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Penduduk tidak ditemukan!" },
        { status: 400 }
      );
    }

    const updatedPenduduk = await prisma.penduduk.update({
      where: { id: id },
      data: {
        nama,
        nik,
        jk,
        tglLahir: new Date(tglLahir),
        tempatLahir,
        agama,
        pendidikan,
        pekerjaan,
        dusun,
        status,
      },
    });

    return NextResponse.json(
      { data: updatedPenduduk, message: "Penduduk berhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal memperbarui data penduduk: ", error || error.message);

    // handle jika ada data ganda
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "NIK sudah terdaftar!" },
        { status: 400 }
      );
    }

    // handle jika penduduk tidak ditemukan
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Penduduk tidak ditemukan!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan di server!" },
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
        { message: "Penduduk tidak ditemukan!" },
        { status: 400 }
      );
    }

    await prisma.penduduk.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Penduduk berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menghapus data penduduk: ", error || error.message);

    return NextResponse.json(
      { message: "Terjadi kesalahan di server!" },
      { status: 500 }
    );
  }
};
