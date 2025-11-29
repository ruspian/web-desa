"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Filter,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useDesa } from "@/context/DesaContext";

export default function PublicAgendaClient({
  upcomingEvents,
  pastEvents,
  categories,
  activeCategory,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: dataDesa } = useDesa();

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);

    if (category === "Semua") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  //   Format Tanggal
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("id-ID", { month: "short" });
    const fullDate = date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return { day, month, fullDate };
  };

  // Warna Kategori
  const getCategoryColor = (cat) => {
    const lowerCat = cat?.toLowerCase() || "";
    if (lowerCat.includes("kesehatan"))
      return "bg-pink-100 text-pink-600 border-pink-200";
    if (lowerCat.includes("pemerintahan"))
      return "bg-blue-100 text-blue-600 border-blue-200";
    if (lowerCat.includes("gotong"))
      return "bg-orange-100 text-orange-600 border-orange-200";
    if (lowerCat.includes("ekonomi"))
      return "bg-emerald-100 text-emerald-600 border-emerald-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
              <CalendarDays size={16} />
              Jadwal Kegiatan
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agenda Desa
            </h1>
            <p className="text-gray-500 text-lg">
              Jangan lewatkan kegiatan penting di lingkungan Desa{" "}
              {dataDesa?.nama}. Simpan tanggalnya dan ikut berpartisipasi.
            </p>
          </div>
        </div>

        {/* LAYOUT UTAMA */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTER */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={18} /> Filter Kategori
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center
                      ${
                        activeCategory === cat
                          ? "bg-green-50 text-green-700 border border-green-200 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    {cat}
                    {activeCategory === cat && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT LIST */}
          <div className="lg:col-span-3 space-y-12">
            {/* SECTION: AKAN DATANG */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                Agenda Mendatang
              </h2>

              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const { day, month } = formatDate(event.date);
                    return (
                      <div
                        key={event.id}
                        className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all flex flex-col md:flex-row gap-6 items-start"
                      >
                        {/* Date Box */}
                        <div className="shrink-0 w-full md:w-24 h-24 bg-green-50 rounded-2xl flex flex-col items-center justify-center border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors">
                          <span className="text-3xl font-bold">{day}</span>
                          <span className="text-sm font-medium uppercase tracking-wider">
                            {month}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span
                              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getCategoryColor(
                                event.category
                              )}`}
                            >
                              {event.category}
                            </span>
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <Clock size={14} /> {event.time}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            {event.title}
                          </h3>

                          <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                            <MapPin size={16} className="mt-0.5 shrink-0" />
                            <span>{event.location}</span>
                          </div>

                          <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-gray-100 pl-4">
                            {event.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="mt-2 md:mt-0">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-green-600 transition-colors"
                            title="Simpan ke Kalender (Coming Soon)"
                          >
                            <CalendarIcon size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
                    <CalendarDays className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      Tidak ada agenda mendatang.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/*  TERLAKSANA */}
            {pastEvents.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-gray-300 rounded-full"></span>
                  Terlaksana / Arsip
                </h2>
                <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
                  {pastEvents.map((event) => {
                    const { fullDate } = formatDate(event.date);
                    return (
                      <div
                        key={event.id}
                        className="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between border border-gray-100 gap-4"
                      >
                        <div>
                          <h4 className="font-bold text-gray-700 line-through decoration-gray-400">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <CalendarIcon size={14} /> {fullDate}
                            <span className="hidden md:inline">•</span>
                            <MapPin size={14} /> {event.location}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gray-200 text-gray-500 text-xs rounded-full font-bold w-fit">
                          Selesai
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
