import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcryptjs from "bcryptjs";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    // Ambil data user admin dari DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }, // ambil ID dari session yang login
    });

    if (!user)
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );

    // Cek Password Lama
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Password lama salah!" },
        { status: 400 }
      );
    }

    // Hash Password Baru
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password berhasil diubah!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("gagal ubah pasword", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
