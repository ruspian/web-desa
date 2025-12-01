import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { getPublicIdFromUrl } from "@/lib/getUrlCloudinary";
import { pengaduanSchema } from "@/lib/zodValidation";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const body = await req.json();

    const validation = pengaduanSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues?.[0]?.message || "Format data tidak valid!";
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const data = validation.data;

    // Generate Tiket ID Unik
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const tiketId = `ADU-${date}-${random}`;

    // Simpan ke Database
    const newAduan = await prisma.pengaduan.create({
      data: {
        tiketId,
        kategori: data.kategori,
        lokasi: data.lokasi,
        isi: data.isi,
        foto: data.foto || null,
        status: "pending", // Default status

        // Data Pelapor
        isAnonim: data.isAnonim,
        nama: data.isAnonim ? "Anonim" : data.nama,
        nik: data.isAnonim ? null : data.nik,
        noHp: data.nohp || null,
      },
    });

    return NextResponse.json(
      {
        message: "Laporan berhasil dikirim!",
        tiketId: newAduan.tiketId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal kirim pengaduan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
};

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
