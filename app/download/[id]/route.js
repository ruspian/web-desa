import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req, { params }) => {
  try {
    const { id } = await params;

    // Cari surat berdasarkan ID
    const surat = await prisma.suratRequest.findUnique({
      where: { id },
      select: { fileSuratJadi: true },
    });

    // Kalau gak ada file, error
    if (!surat || !surat.fileSuratJadi) {
      return NextResponse.json(
        { message: "File belum tersedia" },
        { status: 404 }
      );
    }

    // Redirect ke URL Cloudinary Asli
    return NextResponse.redirect(surat.fileSuratJadi);
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
};
