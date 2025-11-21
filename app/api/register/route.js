import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const { nik, name, email, password, confirmPassword } = body;

    if (!nik || !name || !email || !password || !confirmPassword) {
      return NextResponse.json("Isi semua form!", { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json("Password dan Konfirmasi Password harus sama!", {
        status: 400,
      });
    }

    // cek apakah NIK sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { nik: String(nik) },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // generate username
    const angkaRandom = Math.floor(Math.random() * 1000);
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, ""); // Hapus simbol aneh kalo ada
    const Username = cleanName.split(" ").join("_").toLowerCase();
    const generateUsername = `${Username}_${angkaRandom}`;

    const user = await prisma.user.create({
      data: {
        nik: String(nik),
        name,
        email,
        password: hashedPassword,
        username: generateUsername,
      },
    });

    return NextResponse.json(
      { user, message: "Pendaftaran Berhasil! Silakan Login." },
      { status: 201 }
    );
  } catch (error) {
    console.log("gagal melakukan pendaftaran: ", error.message);

    // jika ada data ganda (P2002 = Data sama)
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Data (NIK/Username) sudah digunakan." },
        { status: 400 }
      );
    }
    return NextResponse.json("Terjadi kesalahan server, coba lagi!", {
      status: 500,
    });
  }
};
