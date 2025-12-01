import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  Calendar,
  User,
  FileText,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { formatDateDisplay } from "@/lib/date";

// Metadata Halaman
export const metadata = {
  title: "Verifikasi Dokumen",
  description: "Halaman validasi keaslian surat keterangan desa.",
};

export const revalidate = 0; // Selalu cek data terbaru

export default async function VerifyPage({ searchParams }) {
  // Ambil ID dari URL
  const params = await searchParams;
  const id = params?.id;

  // Ambil Data Desa
  const desa = await prisma.siteSettings.findFirst();

  let surat = null;
  let isValid = false;

  // Cari Surat di Database
  if (id) {
    surat = await prisma.suratRequest.findUnique({
      where: { id: id },
      include: {
        penduduk: {
          select: {
            nama: true,
            nik: true,
            dusun: true,
          },
        },
      },
    });

    // Valid jika ada datanya DAN statusnya APPROVED
    if (surat && surat.status === "APPROVED") {
      isValid = true;
    }
  }

  // fungsi Sensor NIK
  const maskNik = (nik) => {
    if (!nik) return "-";
    return nik.substring(0, 6) + "******";
  };

  return (
    <main className="min-h-screen pt-24 bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      {/* CONTAINER */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
        <div
          className={`h-3 w-full ${isValid ? "bg-green-500" : "bg-red-500"}`}
        ></div>

        <div className="p-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto relative mb-4">
              {desa?.logo ? (
                <Image
                  src={desa.logo}
                  alt="Logo Desa"
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <ShieldCheck size={40} />
                </div>
              )}
            </div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
              Verifikasi Keaslian Surat
            </h2>
          </div>

          {/* STATUS VALIDASI */}
          <div className="text-center mb-8 animate-fade-in-up">
            {isValid ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-green-700">
                  DOKUMEN ASLI
                </h3>
                <p className="text-green-600 text-sm font-medium mt-1">
                  Terdaftar di database desa.
                </p>
                <p className="text-xs text-gray-400 mt-2 font-mono">ID: {id}</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <XCircle size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-red-700">
                  TIDAK VALID
                </h3>
                <p className="text-red-600 text-sm font-medium mt-1">
                  Data tidak ditemukan atau dipalsukan.
                </p>
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  ID: {id || "Tidak ada"}
                </p>
              </div>
            )}
          </div>

          {/*  DETAIL INFORMASI JIKA VALID */}
          {isValid && surat && (
            <div className="space-y-4 border-t border-gray-100 pt-6">
              {/* Jenis Surat */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Jenis Dokumen
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {surat.jenisSurat}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    No: {surat.nomorSurat || "-"}
                  </p>
                </div>
              </div>

              {/* Pemilik */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Pemilik Data
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {surat.namaSnapshot}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    NIK: {maskNik(surat.nikSnapshot)}
                  </p>
                </div>
              </div>

              {/* Tanggal */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Tanggal Terbit
                  </p>
                  <p className="text-gray-800 font-medium text-sm">
                    {formatDateDisplay(surat.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Keperluan */}
              <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-500 italic text-center mt-4">
                &quot;Diberikan untuk keperluan: {surat.keperluan}&quot;
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Menuju Website Desa <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
