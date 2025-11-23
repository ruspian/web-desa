import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, alasan } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const updatedSurat = await prisma.suratRequest.update({
      where: { id: id },
      data: {
        status: status, // APPROVED, REJECTED, PENDING
        alasanTolak: status === "REJECTED" ? alasan : null,
      },
    });

    return NextResponse.json(
      { data: updatedSurat, message: "Status berhasil diperbarui" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error update surat:", error);
    return NextResponse.json(
      { message: "Gagal memproses surat" },
      { status: 500 }
    );
  }
};
