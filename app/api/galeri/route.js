import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPublicIdFromUrl } from "@/lib/getUrlCloudinary";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses Ditolak" }, { status: 401 });

    const body = await req.json();
    const { caption, category, image } = body;

    if (!image) {
      return NextResponse.json(
        { message: "Foto wajib diupload!" },
        { status: 400 }
      );
    }

    const newGaleri = await prisma.galeri.create({
      data: {
        caption: caption || "Tanpa Keterangan",
        category,
        image,
      },
    });

    return NextResponse.json(
      { data: newGaleri, message: "Foto berhasil disimpan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("gagal simpan galeri", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, caption, category, image } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID foto wajib disertakan!" },
        { status: 400 }
      );
    }

    const updatedGaleri = await prisma.galeri.update({
      where: { id },
      data: { caption, category, image },
    });

    return NextResponse.json(
      { data: updatedGaleri, message: "Info foto diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("gagal update galeri", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID foto wajib disertakan!" },
        { status: 400 }
      );
    }

    // Cari Data Dulu
    const item = await prisma.galeri.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );

    // Hapus Gambar di Cloudinary
    if (item.image) {
      const publicId = getPublicIdFromUrl(item.image);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // Hapus DB
    await prisma.galeri.delete({ where: { id } });

    return NextResponse.json(
      { message: "Foto dihapus permanen!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("gagal hapus galeri", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
