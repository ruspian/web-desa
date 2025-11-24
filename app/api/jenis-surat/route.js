import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Config Cloudinary Backend
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper Ekstrak Public ID (Khusus File RAW/Docx beda dikit urlnya)
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Ambil nama file setelah version, buang extension
    const filenameWithExt = parts.slice(uploadIndex + 2).join("/");
    return filenameWithExt; // Untuk raw files, public_id biasanya termasuk ekstensi atau path lengkap
  } catch (error) {
    return null;
  }
};

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    // Ambil 'fields' dari body
    const { nama, kode, urlTemplate, fields } = body;

    if (!nama || !urlTemplate) {
      return NextResponse.json(
        { message: "Data tidak lengkap!" },
        { status: 400 }
      );
    }

    const newSurat = await prisma.jenisSurat.create({
      data: {
        nama,
        kode,
        urlTemplate,
        fields: fields || [], // Simpan array fields sebagai JSON
      },
    });

    return NextResponse.json(
      { data: newSurat, message: "Template disimpan!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Gagal menyimpan." }, { status: 500 });
  }
};

// --- PUT ---
export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, nama, kode, urlTemplate, fields } = body;

    const updatedSurat = await prisma.jenisSurat.update({
      where: { id },
      data: {
        nama,
        kode,
        urlTemplate,
        fields: fields || [], // Update fields juga
      },
    });

    return NextResponse.json(
      { data: updatedSurat, message: "Template diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Gagal update." }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    //  Cari Data
    const surat = await prisma.jenisSurat.findUnique({ where: { id } });
    if (!surat)
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );

    await prisma.jenisSurat.delete({ where: { id } });

    return NextResponse.json({ message: "Template dihapus!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus." }, { status: 500 });
  }
};
