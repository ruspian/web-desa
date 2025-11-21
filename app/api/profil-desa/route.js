import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    // Cek Session & Role
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const { nama, tagline, sejarah, visi, misi, fotoUtama } = body;

    //  Validasi Input
    if (!nama || !tagline) {
      return NextResponse.json(
        { message: "Nama desa dan Tagline wajib diisi!" },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada data profil desa
    const existingProfil = await prisma.profilDesa.findFirst();

    let result;

    // kalo ada profil desa maka update
    if (existingProfil) {
      result = await prisma.profilDesa.update({
        where: {
          id: existingProfil.id,
        },
        data: {
          nama,
          tagline,
          sejarah,
          visi,
          misi,
          potoUrl: fotoUtama,
        },
      });
    } else {
      // kalo belum ada buat baru
      result = await prisma.profilDesa.create({
        data: {
          nama,
          tagline,
          sejarah,
          visi,
          misi,
          potoUrl: fotoUtama,
        },
      });
    }

    return NextResponse.json(
      { data: result, message: "Profil Desa berhasil disimpan!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menyimpan profil desa:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan server internal." },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const result = await prisma.profilDesa.findFirst();

    // kembalikan data meskipun data kosong
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log("gagal mengambil data profil desa: ", error.message || error);

    return NextResponse.json(
      { message: "Kesalahan pada server, Coba lagi!" },
      { status: 500 }
    );
  }
};
