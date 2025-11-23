import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jenis, tanggal, keterangan, pendudukId, namaWarga, nik } = body;

    //  Validasi
    if (!jenis || !tanggal) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    //  Gunakan Transaksi Database
    await prisma.$transaction(async (tx) => {
      // Buat  Mutasi
      await tx.mutasiPenduduk.create({
        data: {
          jenis,
          tanggal: new Date(tanggal),
          keterangan,
          pendudukId: pendudukId || null,
          namaWarga: namaWarga,
        },
      });

      // Update Status Penduduk
      if (pendudukId) {
        let statusBaru = "HIDUP"; // Default

        if (jenis === "Kematian") {
          statusBaru = "MENINGGAL";
        } else if (jenis === "Pindah Keluar") {
          statusBaru = "PINDAH";
        } else if (jenis === "Pindah Masuk" || jenis === "Kelahiran") {
          statusBaru = "HIDUP";
        }

        await tx.penduduk.update({
          where: { id: pendudukId },
          data: { status: statusBaru },
        });
      }
    });

    return NextResponse.json(
      { message: "Mutasi berhasil dicatat & status diupdate!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Mutasi:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Cari data mutasi dulu sebelum dihapus
    const mutasi = await prisma.mutasiPenduduk.findUnique({
      where: { id: id },
    });

    if (!mutasi)
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );

    await prisma.$transaction(async (tx) => {
      // Kembalikan Status Penduduk
      if (mutasi.pendudukId) {
        let statusRollback = "HIDUP";

        if (mutasi.jenis === "Kematian" || mutasi.jenis === "Pindah Keluar") {
          statusRollback = "HIDUP";
        }

        await tx.penduduk.update({
          where: { id: mutasi.pendudukId },
          data: { status: statusRollback },
        });
      }

      //  Hapus  Mutasi
      await tx.mutasiPenduduk.delete({
        where: { id: id },
      });
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus & status dipulihkan" },
      { status: 200 }
    );
  } catch (error) {
    console.log("gagal menghapus data mutasi:", error || error.message);

    return NextResponse.json(
      { message: "Gagal menghapus data" },
      { status: 500 }
    );
  }
};
