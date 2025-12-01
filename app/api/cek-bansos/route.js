import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cekBansosSchema } from "@/lib/zodValidation";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const validation = cekBansosSchema.safeParse(body);
    if (!validation.success) {
      const errorMessage =
        validation.error.issues?.[0]?.message || "Format data tidak valid!";
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const nik = validation.data.nik;

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
