import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { suratSchema } from "@/lib/zodValidation";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Akses Ditolak" }, { status: 401 });
    }

    const body = await req.json();

    // validasi dari zod
    const validation = suratSchema.safeParse(body);

    // cek hasil validasi
    if (!validation.success) {
      // ambil error paling pertama
      const errorMessages =
        validation.error.issues?.[0]?.message || "Format data tidak valid!";

      // kirim error
      return NextResponse.json({ message: errorMessages }, { status: 400 });
    }

    const data = validation.data;

    const newSurat = await prisma.suratRequest.create({
      data: {
        pendudukId: data.pendudukId,
        nikSnapshot: data.nikSnapshot,
        namaSnapshot: data.namaSnapshot,
        jenisSurat: data.jenisSurat,
        jenisSuratId: data.templateId || null,
        nomorSurat: data.nomorSurat || null,
        keperluan: data.keperluan,
        extraData: data.extraData || {},
        status: data.status || "PENDING",
        fileSuratJadi: data.fileSuratJadi || null,
        fileKtp: data.fileKtp || null,
        fileKk: data.fileKk || null,
        filePengantar: null,
        noHp: data.noHp || null,
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
      return NextResponse.json({ message: "Akses Ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      status,
      alasan,
      fileSuratJadi,
      nomorSurat,
      extraData,
      keperluan,
    } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "ID dan Status diperlukan" },
        { status: 400 }
      );
    }

    const updatedSurat = await prisma.suratRequest.update({
      where: { id },
      data: {
        status: status,
        alasanTolak: status === "REJECTED" ? alasan : null,
        fileSuratJadi: status === "APPROVED" ? fileSuratJadi : null,
        nomorSurat: status === "APPROVED" ? nomorSurat : null,
        ...(keperluan && { keperluan }),
        ...(extraData && { extraData }),
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
