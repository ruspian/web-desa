import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { getPublicIdFromUrl } from "@/lib/getUrlCloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const { nama, nip, noHp, status, urutan, jabatan, foto } = body;

    if (!nama || !jabatan || !status) {
      return NextResponse.json(
        { message: "Nama, Jabatan, dan Status wajib diisi!" },
        { status: 400 }
      );
    }

    // cari urutan terakhir
    const lastItem = await prisma.perangkatDesa.findFirst({
      orderBy: {
        urutan: "desc", // Urutkan dari yang terbesar
      },
      select: {
        urutan: true, // ambil hanya urutan
      },
    });

    // urutan selanjutnya
    const nextUrutan = (lastItem?.urutan ?? 0) + 1;

    const newPerangkat = await prisma.perangkatDesa.create({
      data: {
        nama,
        nip,
        noHp,
        status,
        jabatan,
        urutan: nextUrutan,
        foto: foto || null,
      },
    });

    return NextResponse.json(
      { data: newPerangkat, message: "Perangkat berhasil ditambahkan!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menambahkan perangkat desa: ", error || error.message);
    return NextResponse.json(
      { message: "Kesalahan pada server!" },
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
    const { id, nama, nip, noHp, status, urutan, jabatan, foto } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Perangkat desa tidak ditemukan!" },
        { status: 400 }
      );
    }

    // cek apakah data lama ada untuk hapus gambar lama
    const oldData = await prisma.perangkatDesa.findUnique({
      where: { id: id },
    });

    if (oldData?.foto && oldData.foto !== foto) {
      // ambil public id gambar lama dari url cloudinary
      const publicId = getPublicIdFromUrl(oldData.foto);

      //    kalo url gambar ada hapus
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const updatePerangkat = await prisma.perangkatDesa.update({
      data: {
        nama,
        nip,
        noHp,
        status,
        urutan,
        jabatan,
        foto: foto || null,
      },
    });

    return NextResponse.json(
      { data: updatePerangkat, message: "Perangkat berhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal update potensi:", error);
    // Handle jika ID tidak ditemukan di DB
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Data tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
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
        { message: "Perangkat desa tidak ditemukan!" },
        { status: 400 }
      );
    }

    const perangkat = await prisma.perangkatDesa.findUnique({
      where: { id: id },
    });

    if (!perangkat) {
      return NextResponse.json(
        { message: "Data tidak ditemukan!" },
        { status: 404 }
      );
    }

    // ceapakah ada gambar lama
    if (perangkat.foto) {
      // ambil public id gambar lama dari url cloudinary
      const publicId = getPublicIdFromUrl(perangkat.foto);

      //    kalo url gambar ada hapus
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // hapus data di database
    await prisma.perangkatDesa.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Perangkat berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menghapus perangkat desa: ", error || error.message);

    return NextResponse.json(
      { message: "Kesalahan pada server!" },
      { status: 500 }
    );
  }
};
