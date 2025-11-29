import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      pendudukId,
      nikSnapshot,
      namaSnapshot,
      jenisSurat,
      jenisSuratId,
      nomorSurat,
      keperluan,
      extraData,
      status,
      fileSuratJadi,
      noHp,
      fileKtp,
      fileKk,
    } = body;

    if (!pendudukId || !jenisSurat || !keperluan) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const newSurat = await prisma.suratRequest.create({
      data: {
        pendudukId,
        nikSnapshot,
        namaSnapshot,
        jenisSurat,
        jenisSuratId: jenisSuratId || null,
        nomorSurat: nomorSurat || null,
        keperluan,
        extraData: extraData || {},
        status: status || "PENDING",
        fileSuratJadi: fileSuratJadi || null,
        fileKtp: fileKtp || null,
        fileKk: fileKk || null,
        filePengantar: null,
        noHp,
      },
    });

    return NextResponse.json(
      { data: newSurat, message: "Surat berhasil dibuat" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal buat surat:", error);
    // Handle Error Duplikat
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Nomor Surat sudah ada!" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, alasan, fileSuratJadi, nomorSurat } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "ID dan Status diperlukan" },
        { status: 400 }
      );
    }

    const updatedSurat = await prisma.suratRequest.update({
      where: { id },
      data: {
        status: status, // APPROVED / REJECTED
        alasanTolak: status === "REJECTED" ? alasan : null,
        fileSuratJadi: status === "APPROVED" ? fileSuratJadi : null,
        nomorSurat: status === "APPROVED" ? nomorSurat : null,
      },
    });

    return NextResponse.json(
      { data: updatedSurat, message: "Status surat diperbarui" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal update surat:", error);
    return NextResponse.json(
      { message: "Gagal memproses surat" },
      { status: 500 }
    );
  }
};
