import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPublicIdFromUrl } from "@/lib/getUrlCloudinary";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { title, category, content, status, image } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Judul dan Konten wajib diisi" },
        { status: 400 }
      );
    }

    // Bikin slug unik
    const slug = `${createSlug(title)}-${Date.now()}`;

    const newBerita = await prisma.berita.create({
      data: {
        title,
        slug,
        category,
        content,
        status: status === "published" ? "PUBLISHED" : "DRAFT",
        image,
        author: session.user.name || "Admin Desa",
        views: 0,
      },
    });

    return NextResponse.json(
      { data: newBerita, message: "Berita berhasil diterbitkan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error create berita:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { id, title, category, content, status, image } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID Berita tidak ditemukan!" },
        { status: 400 }
      );
    }

    const oldData = await prisma.berita.findUnique({
      where: { id: id },
    });
    if (oldData?.image && oldData.image !== image) {
      // ambil public id gambar
      const publicId = getPublicIdFromUrl(oldData.image);

      //    kalo url gambar ada hapus
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const updatedBerita = await prisma.berita.update({
      where: { id: id },
      data: {
        title,
        category,
        content,
        status: status === "published" ? "PUBLISHED" : "DRAFT",
        image,
      },
    });

    return NextResponse.json(
      { data: updatedBerita, message: "Berita berhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal memperbarui berita:", error || error.message);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Asses ditolak!" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID Berita diperlukan!" },
        { status: 400 }
      );
    }

    const berita = await prisma.berita.findUnique({ where: { id: id } });

    if (berita?.image) {
      // ambil public id gambar
      const publicId = getPublicIdFromUrl(berita.image);

      //    kalo url gambar ada hapus
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.berita.delete({ where: { id: id } });

    return NextResponse.json({ message: "Berita dihapus!" }, { status: 200 });
  } catch (error) {
    console.error("Error delete berita:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
