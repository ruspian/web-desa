"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  PlayCircle,
  X,
  ZoomIn,
  Filter,
} from "lucide-react";

// --- DUMMY DATA ---
const galleryItems = [
  {
    id: 1,
    type: "photo",
    src: "https://images.unsplash.com/photo-1516216628259-63eb6fd6932f?w=800&q=80",
    category: "Pemandangan",
    caption: "Suasana pagi di persawahan Dusun Krajan",
  },
  {
    id: 2,
    type: "photo",
    src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
    category: "Kegiatan",
    caption: "Kirab Budaya Sedekah Bumi 2025",
  },
  {
    id: 3,
    type: "photo",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    category: "Pemerintahan",
    caption: "Musyawarah Desa Perencanaan Pembangunan",
  },
  {
    id: 4,
    type: "video", // Simulasi Thumbnail Video
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    category: "Kegiatan",
    caption: "Video Dokumentasi HUT RI Ke-80",
  },
  {
    id: 5,
    type: "photo",
    src: "https://images.unsplash.com/photo-1599639668854-51760526b430?w=800&q=80",
    category: "UMKM",
    caption: "Produk Unggulan Keripik Pisang",
  },
  {
    id: 6,
    type: "photo",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    category: "Pemandangan",
    caption: "Matahari terbenam di Bukit Harapan",
  },
  {
    id: 7,
    type: "photo",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    category: "Pemerintahan",
    caption: "Pelantikan Perangkat Desa Baru",
  },
  {
    id: 8,
    type: "photo",
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    category: "Kegiatan",
    caption: "Pelatihan Komputer untuk Pemuda Desa",
  },
];

const categories = ["Semua", "Kegiatan", "Pemandangan", "Pemerintahan", "UMKM"];

export default function GaleriPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState("");

  // Filter Logic
  const filteredItems =
    activeFilter === "Semua"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  // Open Lightbox
  const openLightbox = (src, caption) => {
    setSelectedImage(src);
    setSelectedCaption(caption);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Enable scroll lagi
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-4">
            <ImageIcon size={16} />
            Dokumentasi Visual
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri Desa</h1>
          <p className="text-gray-500 text-lg">
            Arsip foto dan video kegiatan, potensi alam, serta pembangunan yang
            terekam lensa Desa Makmur Jaya.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300
                        ${
                          activeFilter === cat
                            ? "bg-gray-900 text-white shadow-lg transform scale-105"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }
                    `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              onClick={() => openLightbox(item.src, item.caption)}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient (Muncul pas Hover) */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <p className="text-white font-medium leading-snug line-clamp-2">
                  {item.caption}
                </p>

                {/* Center Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {item.type === "video" ? (
                    <PlayCircle className="text-white w-12 h-12 opacity-80" />
                  ) : (
                    <ZoomIn className="text-white w-8 h-8 opacity-60" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p>Tidak ada foto di kategori ini.</p>
          </div>
        )}
      </div>

      {/* === LIGHTBOX (MODAL) === */}
      {selectedImage && (
        <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <X size={32} />
          </button>

          <div className="max-w-5xl w-full max-h-screen flex flex-col items-center">
            <div className="relative w-full h-[80vh] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedImage}
                alt="Full Preview"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/90 mt-4 text-lg font-medium text-center max-w-2xl">
              {selectedCaption}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
