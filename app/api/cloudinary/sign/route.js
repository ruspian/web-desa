import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { folder } = body;

    // Generate Timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Buat Signature pakai SDK Cloudinary
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder || "web-desa-general",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json(
      {
        timestamp,
        signature,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign cloudinary Error:", error);
    return NextResponse.json(
      { message: "Gagal generate signature" },
      { status: 500 }
    );
  }
};
