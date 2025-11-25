import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses Ditolak" }, { status: 401 });

    const body = await req.json();
    const { title, category, date, time, location, description } = body;

    if (!title || !date) {
      return NextResponse.json(
        { message: "Judul dan Tanggal wajib diisi" },
        { status: 400 }
      );
    }

    const newAgenda = await prisma.agenda.create({
      data: {
        title,
        category,
        date: new Date(date), // Konversi tanggal menjadi objek Date
        time,
        location,
        description,
      },
    });

    return NextResponse.json(
      { data: newAgenda, message: "Agenda berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("gagal membuat agenda", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

// --- PUT: UPDATE AGENDA ---
export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Akses Ditolak!" }, { status: 401 });

    const body = await req.json();
    const { id, title, category, date, time, location, description } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID Agenda tidak ditemukan!" },
        { status: 400 }
      );
    }

    const updatedAgenda = await prisma.agenda.update({
      where: { id: id },
      data: {
        title,
        category,
        date: new Date(date),
        time,
        location,
        description,
      },
    });

    return NextResponse.json(
      { data: updatedAgenda, message: "Agenda berhasil diupdate!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("gagal update agenda", error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

// --- DELETE: HAPUS AGENDA ---
export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.agenda.delete({ where: { id: id } });

    return NextResponse.json({ message: "Agenda dihapus!" }, { status: 200 });
  } catch (error) {
    console.error("gagal hapus agenda", error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
