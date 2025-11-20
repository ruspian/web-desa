"use client"; // Client component karena ada interaksi Filter Tab

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ShoppingBag,
  Sprout,
  Camera,
  ArrowUpRight,
  Star,
} from "lucide-react";

// --- DUMMY DATA  ---
const potensiData = [
  {
    id: 1,
    title: "Air Terjun Bidadari",
    category: "Wisata",
    desc: "Destinasi wisata alam tersembunyi dengan air jernih dan suasana sejuk.",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
    location: "Dusun Utara",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Kopi Robusta Makmur",
    category: "Pertanian",
    desc: "Kopi petik merah asli petani lokal dengan cita rasa khas pegunungan.",
    image:
      "https://images.unsplash.com/photo-1559525839-b184a4d6c5f7?w=800&q=80",
    location: "Kelompok Tani Subur",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Kerajinan Anyaman Bambu",
    category: "Ekonomi Kreatif",
    desc: "Produk kerajinan tangan berkualitas ekspor buatan ibu-ibu PKK.",
    image:
      "https://images.unsplash.com/photo-1519160558534-579f5106e43f?w=800&q=80",
    location: "Sentra UMKM",
    rating: 4.7,
  },
  {
    id: 4,
    title: "Desa Wisata Sawah",
    category: "Wisata",
    desc: "Spot foto instagramable di tengah hamparan sawah hijau.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    location: "Dusun Selatan",
    rating: 4.6,
  },
  {
    id: 5,
    title: "Keripik Pisang Aneka Rasa",
    category: "Ekonomi Kreatif",
    desc: "Oleh-oleh wajib khas desa dengan varian rasa coklat, keju, dan balado.",
    image:
      "https://images.unsplash.com/photo-1599639668854-51760526b430?w=800&q=80",
    location: "Warung Bu Tini",
    rating: 4.5,
  },
  {
    id: 6,
    title: "Lumbung Padi Organik",
    category: "Pertanian",
    desc: "Penghasil beras organik berkualitas tinggi tanpa pestisida kimia.",
    image:
      "https://images.unsplash.com/photo-1536617793967-10fc417ae318?w=800&q=80",
    location: "Gapoktan Makmur",
    rating: 5.0,
  },
];

const categories = ["Semua", "Wisata", "Pertanian", "Ekonomi Kreatif"];

export default function PotensiPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  // Logic Filter
  const filteredData =
    activeTab === "Semua"
      ? potensiData
      : potensiData.filter((item) => item.category === activeTab);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* === HEADER & FILTER === */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Star size={16} />
              Keunggulan Desa
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Potensi & Produk Unggulan
            </h1>
            <p className="text-gray-500 text-lg">
              Menjelajahi kekayaan alam, hasil bumi, dan kreativitas warga Desa
              Makmur Jaya yang siap mendunia.
            </p>
          </div>

          {/* Filter Buttons (Pill Shape) */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border
                            ${
                              activeTab === cat
                                ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                            }
                        `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* === GRID CONTENT === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Wrapper */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge Kategori di atas gambar */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 text-white
                                ${
                                  item.category === "Wisata"
                                    ? "bg-blue-500/80"
                                    : item.category === "Pertanian"
                                    ? "bg-green-500/80"
                                    : "bg-orange-500/80"
                                }
                            `}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-md">
                    <Star size={14} fill="currentColor" />
                    {item.rating}
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 grow">
                  {item.desc}
                </p>

                <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all flex items-center justify-center gap-2 group/btn">
                  Lihat Detail
                  <ArrowUpRight
                    size={18}
                    className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* === EMPTY STATE (Kalau filter kosong) === */}
        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Camera size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada data</h3>
            <p className="text-gray-500">Kategori ini belum memiliki konten.</p>
          </div>
        )}

        {/* === CTA SECTION (Ajak Warga Partisipasi) === */}
        <section className="mt-20 bg-green-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Punya Usaha atau Produk Unggulan?
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              Daftarkan UMKM atau produk hasil panen Anda untuk ditampilkan di
              website resmi desa. Bantu kami mempromosikan potensi lokal ke
              pasar yang lebih luas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Daftarkan Produk
              </button>
              <button className="px-8 py-4 bg-green-700 text-white border border-green-500 font-bold rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
                Hubungi Admin
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
