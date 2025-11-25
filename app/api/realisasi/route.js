import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const { tanggal, uraian, kategori, tipe, nominal, bukti } = body;

    if (!tanggal || !uraian || !nominal) {
      return NextResponse.json(
        { message: "Data wajib diisi!" },
        { status: 400 }
      );
    }

    const txDate = new Date(tanggal);
    const tahunAnggaran = txDate.getFullYear();
    const tipeEnum = tipe === "income" ? "INCOME" : "EXPENSE";

    const result = await prisma.$transaction(async (tx) => {
      // Buat Log Transaksi
      const newTrans = await tx.transaksiKeuangan.create({
        data: {
          tanggal: txDate,
          uraian,
          kategori,
          tipe: tipeEnum,
          nominal,
          bukti: bukti || null,
        },
      });

      // Update Realisasi di Tabel APBDes
      const targetAnggaran = await tx.apbdes.findFirst({
        where: {
          tahun: tahunAnggaran,
          kategori: kategori, // Harus match persis string-nya
          tipe: tipeEnum,
        },
      });

      if (targetAnggaran) {
        // Kalau ketemu, update realisasinya
        await tx.apbdes.update({
          where: { id: targetAnggaran.id },
          data: {
            realisasi: {
              increment: nominal, // Fungsi sakti Prisma buat nambah angka
            },
          },
        });
      }

      return newTrans;
    });

    return NextResponse.json(
      { data: result, message: "Transaksi berhasil & Anggaran terupdate!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error create transaksi:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
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

    // Cari data transaksi dulu sebelum dihapus
    const transaksi = await prisma.transaksiKeuangan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaksi)
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );

    const tahunAnggaran = new Date(transaksi.tanggal).getFullYear();

    await prisma.$transaction(async (tx) => {
      //  Update Realisasi (Kurangi/Rollback)
      const targetAnggaran = await tx.apbdes.findFirst({
        where: {
          tahun: tahunAnggaran,
          kategori: transaksi.kategori,
          tipe: transaksi.tipe,
        },
      });

      if (targetAnggaran) {
        await tx.apbdes.update({
          where: { id: targetAnggaran.id },
          data: {
            realisasi: {
              decrement: Number(transaksi.nominal), // Kurangi sebesar nominal transaksi yg dihapus
            },
          },
        });
      }

      // Hapus Log Transaksi
      await tx.transaksiKeuangan.delete({
        where: { id: parseInt(id) },
      });
    });

    return NextResponse.json(
      { message: "Transaksi dihapus & Saldo dikembalikan" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error delete transaksi:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
