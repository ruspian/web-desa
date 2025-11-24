import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { getPublicIdFromUrl } from "@/lib/getUrlCloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    const { id, status, tanggapan } = body;

    await prisma.pengaduan.update({
      where: { id },
      data: { status, tanggapan },
    });

    return NextResponse.json({ message: "Berhasil diupdate" }, { status: 200 });
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

    // Cek gambar sebelum hapus
    const item = await prisma.pengaduan.findUnique({
      where: { id: parseInt(id) },
    });
    if (item?.foto) {
      const publicId = getPublicIdFromUrl(item.foto);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.pengaduan.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
