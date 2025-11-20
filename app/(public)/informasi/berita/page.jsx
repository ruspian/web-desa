"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";

// --- DUMMY DATA ---
const posts = [
  {
    id: 1,
    slug: "pembangunan-jalan-desa-2025",
    title: "Pembangunan Jalan Dusun Krajan Selesai Tepat Waktu",
    excerpt:
      "Proyek pengaspalan jalan sepanjang 2KM di Dusun Krajan telah rampung. Warga kini bisa mengangkut hasil panen lebih mudah.",
    date: "20 Nov 2025",
    author: "Admin Desa",
    category: "Pembangunan",
    image:
      "https://images.unsplash.com/photo-1596627649633-b1f74349713c?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    slug: "jadwal-posyandu-balita-november",
    title: "Jadwal Posyandu Balita & Lansia Bulan November",
    excerpt:
      "Pemeriksaan kesehatan rutin, pemberian vitamin, dan imunisasi akan dilaksanakan di Balai Desa.",
    date: "18 Nov 2025",
    author: "Bidan Desa",
    category: "Kesehatan",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    featured: false,
  },
  {
    id: 3,
    slug: "penyaluran-blt-dana-desa-tahap-4",
    title: "Penyaluran BLT Dana Desa Tahap 4 Berjalan Tertib",
    excerpt:
      "Sebanyak 50 KPM menerima Bantuan Langsung Tunai Dana Desa (BLT-DD) untuk periode Oktober-Desember.",
    date: "15 Nov 2025",
    author: "Kaur Keuangan",
    category: "Pemerintahan",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    featured: false,
  },
  {
    id: 4,
    slug: "festival-budaya-desa-makmur-jaya",
    title: "Festival Budaya: Melestarikan Tradisi Leluhur",
    excerpt:
      "Saksikan kemeriahan kirab budaya dan pentas seni yang akan digelar akhir pekan ini di lapangan desa.",
    date: "10 Nov 2025",
    author: "Karang Taruna",
    category: "Kegiatan",
    image:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80",
    featured: false,
  },
  {
    id: 5,
    slug: "pelatihan-digital-marketing-umkm",
    title: "Pelatihan Digital Marketing untuk Pelaku UMKM",
    excerpt:
      "Mendorong produk lokal go digital, Pemerintah Desa bekerjasama dengan Kampus Merdeka mengadakan pelatihan.",
    date: "05 Nov 2025",
    author: "Admin Desa",
    category: "Ekonomi",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    featured: false,
  },
];

const categories = [
  "Semua",
  "Pembangunan",
  "Pemerintahan",
  "Kesehatan",
  "Kegiatan",
  "Ekonomi",
];

export default function BeritaPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  // Logic Filter & Search
  const filteredPosts = posts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "Semua" || post.category === filter;
    return matchSearch && matchCategory;
  });

  // Pisahkan Featured Post (Postingan pertama dari hasil filter)
  const featuredPost =
    filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER & SEARCH */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kabar Desa Terkini
          </h1>
          <p className="text-gray-500 mb-8">
            Informasi terbaru seputar kegiatan, pembangunan, dan pengumuman
            resmi Pemerintah Desa.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Cari berita..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                            ${
                              filter === cat
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                            }
                        `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* === FEATURED POST (Highlight) === */}
        {featuredPost && !search && filter === "Semua" && (
          <Link
            href={`/berita/${featuredPost.slug}`}
            className="block mb-12 group"
          >
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 w-fit">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <div className="flex items-center gap-4 text-gray-300 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} /> {featuredPost.author}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* === REGULAR POSTS GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.length > 0 ? (
            regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/berita/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User size={12} /> {post.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-green-600 font-semibold text-sm mt-auto">
                    Baca Selengkapnya{" "}
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">
                Tidak ada berita yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
