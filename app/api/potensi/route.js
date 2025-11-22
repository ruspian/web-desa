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
    //  Cek Autentikasi & Role Admin
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    //  Ambil Data dari Body Request
    const body = await req.json();
    const { title, category, description, image, location } = body;

    // 3. Validasi Data Wajib
    if (!title || !category || !description) {
      return NextResponse.json(
        { message: "Judul, Kategori, dan Deskripsi wajib diisi!" },
        { status: 400 }
      );
    }

    // 4. Simpan ke Database
    const newPotensi = await prisma.potensiDesa.create({
      data: {
        title,
        category,
        description,
        image: image || null,
        location: location || null,
      },
    });

    return NextResponse.json(
      { data: newPotensi, message: "Potensi berhasil ditambahkan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal tambah potensi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    // Cek Autentikasi
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    //  Ambil Data
    const body = await req.json();
    const { id, title, category, description, image, location } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID Potensi tidak ditemukan!" },
        { status: 400 }
      );
    }

    //  Cek data lama untuk hapus gambar lama jika diganti
    const oldData = await prisma.potensiDesa.findUnique({
      where: { id: parseInt(id) },
    });
    if (oldData?.image && oldData.image !== image) {
      const publicId = getPublicIdFromUrl(oldData.image);

      //    kalo url gambar ada hapus
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    //  Update Database
    const updatedPotensi = await prisma.potensiDesa.update({
      where: { id: parseInt(id) },
      data: {
        title,
        category,
        description,
        image,
        location,
      },
    });

    return NextResponse.json(
      { data: updatedPotensi, message: "Potensi berhasil diperbarui!" },
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
    // Cek Auth
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID Potensi diperlukan!" },
        { status: 400 }
      );
    }

    // Ambil Data dari DB Dulu untuk dapat URL gambar
    const potensi = await prisma.potensiDesa.findUnique({
      where: { id: parseInt(id) },
    });

    if (!potensi) {
      return NextResponse.json(
        { message: "Data tidak ditemukan!" },
        { status: 404 }
      );
    }

    // jika ada gambar hapus dari Cloudinary
    if (potensi.image) {
      const publicId = getPublicIdFromUrl(potensi.image);

      if (publicId) {
        // Hapus dari cloud storage
        await cloudinary.uploader.destroy(publicId);
        console.log("Gambar Cloudinary dihapus:", publicId);
      }
    }

    //  Hapus Data dari Database
    await prisma.potensiDesa.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Data dan gambar berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal hapus potensi:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data." },
      { status: 500 }
    );
  }
};
