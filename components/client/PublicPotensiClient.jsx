"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ShoppingBag,
  Camera,
  ArrowUpRight,
  Star,
  X,
  Send,
  Store,
  Image as ImageIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDesa } from "@/context/DesaContext";
import Pagination from "../ui/pagination";

// modal pengajuan potensi
const ModalPengajuan = ({ isOpen, onClose, dataDesa }) => {
  const [form, setForm] = useState({
    nama: "",
    produk: "",
    nohp: "",
    deskripsi: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminNumber = dataDesa?.telepon.replace(/^0/, "62");

    const message = `Halo Admin Desa,\n\nSaya ingin mendaftarkan potensi/produk UMKM saya ke website desa.\n\nNama: ${form.nama}\nProduk: ${form.produk}\nNo HP: ${form.nohp}\nDeskripsi: ${form.deskripsi}\n\nMohon informasinya. Terima kasih.`;

    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="bg-green-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Store /> Daftar Produk
          </h3>
          <p className="text-green-100 text-sm mt-1">
            Promosikan usahamu di website desa secara gratis.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nama Pemilik
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              placeholder="Nama Anda"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nama Produk / Usaha
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              placeholder="Contoh: Keripik Pisang Bu Ani"
              value={form.produk}
              onChange={(e) => setForm({ ...form, produk: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nomor WhatsApp
            </label>
            <input
              required
              type="tel"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              placeholder="0812xxxx"
              value={form.nohp}
              onChange={(e) => setForm({ ...form, nohp: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none transition-all"
              rows={3}
              placeholder="Jelaskan keunggulan produk anda..."
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all"
          >
            <Send size={18} /> Kirim ke Admin via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

const PublicPotensiClient = ({
  initialData,
  pagination,
  categories,
  activeTab,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: dataDesa } = useDesa();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateUrl = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "tab") params.set("page", 1);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER & FILTER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Star size={16} /> Keunggulan Desa
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Potensi & Produk Unggulan
            </h1>
            <p className="text-gray-500 text-lg">
              Menjelajahi kekayaan alam, hasil bumi, dan kreativitas warga Desa{" "}
              {dataDesa?.nama || "Kita"} yang siap mendunia.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateUrl("tab", cat === "Semua" ? "" : cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeTab === cat
                    ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-green-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialData.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              {/* Image Wrapper */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 text-white ${
                      item.category === "Wisata"
                        ? "bg-blue-500/80"
                        : item.category === "Pertanian"
                        ? "bg-green-500/80"
                        : "bg-gray-800/60"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-2">
                    <MapPin size={14} />
                    <span>{item.location || "Lokasi Desa"}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 grow">
                  {item.description}
                </p>

                <Link
                  href={`/profil/potensi/${item.id}`}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Lihat Detail{" "}
                  <ArrowUpRight
                    size={18}
                    className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {initialData.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Camera size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada data</h3>
            <p className="text-gray-500">Kategori ini belum memiliki konten.</p>
          </div>
        )}

        {/* PAGINATION */}
        {pagination.totalPage > 1 && (
          <Pagination
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        )}

        {/* daftarkan potensi */}
        <section className="mt-24 bg-green-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Punya Usaha atau Produk Unggulan?
            </h2>
            <p className="text-green-100 mb-8 text-lg leading-relaxed">
              Daftarkan UMKM atau produk hasil panen Anda untuk ditampilkan di
              website resmi desa. Bantu kami mempromosikan potensi lokal ke
              pasar yang lebih luas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <ShoppingBag size={20} /> Daftarkan Produk
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${dataDesa?.telepon.replace(/^0/, "62")}`,
                    "_blank"
                  )
                }
                className="px-8 py-4 bg-green-700 text-white border border-green-500 font-bold rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                Hubungi Admin
              </button>
            </div>
          </div>
        </section>

        {/* MODAL */}
        <ModalPengajuan
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dataDesa={dataDesa}
        />
      </div>
    </main>
  );
};

export default PublicPotensiClient;
