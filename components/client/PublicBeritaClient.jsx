"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import Pagination from "../ui/pagination";

export default function BeritaPage({
  initialData,
  pagination,
  categories,
  activeCategory,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentQuery = searchParams.get("query") || "";
    if (debouncedSearch !== currentQuery) {
      if (debouncedSearch) {
        params.set("query", debouncedSearch);
      } else {
        params.delete("query");
      }

      params.set("page", "1"); // reset to first page on new search
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleChangeCategory = (category) => {
    const params = new URLSearchParams(searchParams);

    if (category === "Semua") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1"); // reset to first page on category change

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const isFirstPage = pagination.currentPage === 1;
  const featuredPost =
    isFirstPage && initialData.length > 0 ? initialData[0] : null;
  const regularPosts = isFirstPage ? initialData.slice(1) : initialData;

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
              value={search}
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
                onClick={() => handleChangeCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                            ${
                              activeCategory === cat
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

        {/* FEATURED POST */}
        {featuredPost && (
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

                <p className="text-gray-300 line-clamp-3">
                  {featuredPost.content}
                </p>
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

        {/* REGULAR POSTS */}
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
                    {post.content}
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

        {pagination.totalPages && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </main>
  );
}
