import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req) => {
  try {
    const { ticketId } = await req.json();

    if (!ticketId) {
      return NextResponse.json(
        { message: "Nomor Tiket wajib diisi" },
        { status: 400 }
      );
    }

    // Cari Pengaduan berdasarkan Tiket ID (Unique)
    const aduan = await prisma.pengaduan.findUnique({
      where: { tiketId: ticketId },
      select: {
        id: true,
        tiketId: true,
        kategori: true,
        lokasi: true,
        isi: true,
        foto: true,
        status: true,
        tanggapan: true,
        createdAt: true,
        isAnonim: true,
        nama: true,
      },
    });

    if (!aduan) {
      return NextResponse.json(
        { message: "Tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    // Format Data
    const result = {
      ...aduan,
      nama: aduan.isAnonim ? "Pelapor (Dirahasiakan)" : aduan.nama, // Masking nama jika anonim
      tanggal: new Date(aduan.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
};
