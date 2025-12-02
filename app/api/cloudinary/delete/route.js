import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { publicId, resourceType } = body;

    if (!publicId) {
      return NextResponse.json(
        { message: "Gambar tidak ditemukan!" },
        { status: 400 }
      );
    }

    // Hapus file dari Cloudinary
    // resource_type: 'image' (default) atau 'raw' (untuk docx/pdf)
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Gagal menghapus di Cloudinary");
    }

    return NextResponse.json({ message: "Gambar dihapus!" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
