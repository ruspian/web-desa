"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  Share2,
  Phone,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "../ui/Toast";

export default function PublicDetailPotensiClient({ data, related }) {
  const toast = useToast();
  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: data.title,
          text: data.description,
          url,
        })
        .catch((err) => {
          console.error("Share dibatalkan:", err);
        });
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("Link berhasil disalin!");
        })
        .catch(() => {
          toast.error("Gagal menyalin link!");
        });
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 font-sans">
      {/* breadcrumb kembali */}
      <div className="container mx-auto px-6 mb-6">
        <Link
          href="/profil/potensi"
          className="inline-flex items-center text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar Potensi
        </Link>
      </div>

      {/* header konten */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* gambar */}
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
            {data.image ? (
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageIcon size={64} />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-green-700 font-bold text-xs uppercase tracking-wider shadow-sm">
                {data.category}
              </span>
            </div>
          </div>

          {/* info detail */}
          <div className="space-y-6 py-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              {data.title}
            </h1>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <MapPin className="text-orange-500" size={20} />
                <span>{data.location || "Lokasi Desa"}</span>
              </div>
              {/*  data pemilik */}
              <div className="flex items-center gap-2 text-gray-600">
                <User className="text-blue-500" size={20} />
                <span>{data.pemilik}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="prose prose-lg text-gray-600 leading-relaxed">
              {data.description}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleShare}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
              >
                <Share2 size={18} /> Bagikan
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${data.noWa.replace(
                      /^0/,
                      "62"
                    )}?text=Halo, saya tertarik dengan ${data.title}`,
                    "_blank"
                  )
                }
                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all"
              >
                <Phone size={18} /> Hubungi Penjual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* konten yang sama */}
      {related.length > 0 && (
        <div className="container mx-auto px-6 mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Lihat Potensi Lainnya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/profil/potensi/${item.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-green-600 uppercase">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mt-1 group-hover:text-green-600 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
