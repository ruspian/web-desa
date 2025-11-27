import { formatDateDisplay } from "@/lib/date";
import { ArrowRight, CalendarClock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BeritaSection = ({ beritaTerbaru }) => {
  return (
    <div className="md:col-span-4 bg-white p-8 rounded-3xl -z-50 shadow-xl border border-gray-100 mt-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Kabar Desa Terkini
          </h2>
          <p className="text-gray-500 mt-2">
            Ikuti perkembangan dan kegiatan terbaru di desa kami.
          </p>
        </div>
        <Link
          href="/informasi/berita"
          className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
        >
          Lihat Semua <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {beritaTerbaru.length > 0 ? (
          beritaTerbaru.map((item) => (
            <Link
              key={item.id}
              href={`/informasi/berita/${item.slug}`}
              className="group cursor-pointer block"
            >
              <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-4 border border-gray-100">
                <Image
                  src={item.image || "/noImage.jpg"} // Fallback image
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-800 uppercase tracking-wide">
                  {item.category}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <CalendarClock size={14} /> {formatDateDisplay(item.createdAt)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                {item.title}
              </h3>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">Belum ada berita yang diterbitkan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeritaSection;
