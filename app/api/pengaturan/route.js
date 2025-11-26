import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = async () => {
  try {
    // Ambil data pertama
    let settings = await prisma.siteSettings.findFirst();

    // Kalau belum ada , buat default
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          namaDesa: "",
          runningText: "Selamat Datang di Website Resmi Desa.",
        },
      });
    }

    return NextResponse.json({ data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });

    const body = await req.json();
    console.log("body", body);

    // pakai upsert: Kalau ada update, kalau gak ada create
    // Karena findFirst gak bisa dipake di upsert langsung tanpa unique ID, cek manual dulu
    const existing = await prisma.siteSettings.findFirst();

    let result;
    if (existing) {
      result = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          ...body,
        },
      });
    } else {
      result = await prisma.siteSettings.create({
        data: {
          ...body,
        },
      });
    }

    return NextResponse.json(
      { data: result, message: "Pengaturan disimpan!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menyimpan pengaturan." },
      { status: 500 }
    );
  }
};
