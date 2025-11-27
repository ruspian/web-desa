import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PotensiSection = ({ potensiUnggulan }) => {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-green-600 font-bold tracking-wider uppercase text-sm bg-green-50 px-3 py-1 rounded-full">
          Jelajahi Potensi
        </span>
        <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
          Kekayaan Alam & Produk Lokal
        </h2>
        <p className="text-gray-500">
          Desa Makmur Jaya memiliki berbagai potensi wisata dan produk UMKM yang
          siap mendunia.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {potensiUnggulan.map((item) => (
          <div
            key={item.id}
            className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  {item.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/profil/potensi"
          className="inline-flex items-center gap-2 text-gray-600 font-semibold hover:text-green-600 transition-colors"
        >
          Lihat Semua Potensi <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default PotensiSection;
