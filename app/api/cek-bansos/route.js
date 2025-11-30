import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req) => {
  try {
    const { nik } = await req.json();

    if (!nik || nik.length !== 16) {
      return NextResponse.json(
        { message: "Format NIK tidak valid" },
        { status: 400 }
      );
    }

    // Cari di database Bansos yang statusnya AKTIF
    const result = await prisma.bansosPenerima.findFirst({
      where: {
        penduduk: { nik: nik }, // Relasi ke penduduk
        status: "Aktif",
      },
      include: {
        penduduk: {
          select: { nama: true, dusun: true, nik: true },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 200 }
      );
    }

    // Kembalikan data
    return NextResponse.json(
      {
        found: true,
        data: {
          nama: result.penduduk.nama,
          alamat: result.penduduk.dusun,
          nik: result.penduduk.nik,
          jenis: result.jenisBansos,
          periode: result.periode,
          nominal: result.nominal,
          status: result.status,
          id: result.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
