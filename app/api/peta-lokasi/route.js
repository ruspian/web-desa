import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = async () => {
  try {
    const lokasi = await prisma.petaLokasi.findMany({
      orderBy: { id: "desc" }, // Data terbaru di atas
    });

    return NextResponse.json({ data: lokasi }, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data peta:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data." },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    // Cek Auth
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    // Ambil Data Body
    const body = await req.json();
    const { name, category, lat, lng, description } = body;

    // Validasi
    if (!name || !lat || !lng) {
      return NextResponse.json(
        { message: "Nama lokasi dan koordinat wajib diisi!" },
        { status: 400 }
      );
    }

    // Simpan ke DB
    const newLocation = await prisma.petaLokasi.create({
      data: {
        name,
        category: category || "Fasilitas Umum",
        lat: parseFloat(lat), // konfersi ke float
        lng: parseFloat(lng),
        description: description || "",
      },
    });

    return NextResponse.json(
      { data: newLocation, message: "Lokasi berhasil ditambahkan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menambah lokasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, category, lat, lng, description } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID Lokasi tidak ditemukan!" },
        { status: 400 }
      );
    }

    const updatedLocation = await prisma.petaLokasi.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description,
      },
    });

    return NextResponse.json(
      { data: updatedLocation, message: "Lokasi berhasil diperbarui!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal update lokasi:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data." },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Akses ditolak!" }, { status: 401 });
    }

    // Ambil ID dari URL Query
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID Lokasi diperlukan!" },
        { status: 400 }
      );
    }

    await prisma.petaLokasi.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Lokasi berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus lokasi:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data." },
      { status: 500 }
    );
  }
};
