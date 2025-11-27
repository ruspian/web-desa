import Image from "next/image";
import {
  CheckCircle,
  Map,
  Target,
  History,
  ArrowRight,
  Quote,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { dusunFilter } from "@/lib/dataFilter";
import Link from "next/link";

export const revalidate = 3600; // muat ulang halaman setiap 1 jam

export default async function TentangPage() {
  // FETCH DATA PROFIL DESA
  const profilDesa = await prisma.profilDesa.findFirst();

  // FETCH DATA PERANGKAT DESA
  const kepalaDesa = await prisma.perangkatDesa.findFirst({
    where: {
      jabatan: {
        contains: "Kepala Desa",
        mode: "insensitive",
      },
      status: "Aktif",
    },
  });

  const data = {
    nama: profilDesa?.nama,
    visi: profilDesa?.visi,
    misi: profilDesa?.misi || [],
    sejarah: profilDesa?.sejarah,
    kepalaDesa: kepalaDesa?.nama,
    foto: kepalaDesa?.foto,
    jabatan: kepalaDesa?.jabatan,
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      {" "}
      {/* HEADER SECTION */}
      <section className="bg-green-50 py-16 border-b border-green-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-green-600 font-bold tracking-wider uppercase text-sm">
            Profil Desa
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Mengenal Desa {data.nama} Lebih Dekat
          </h1>
        </div>
      </section>
      <div className="container mx-auto px-6 py-16 space-y-24">
        {/*  VISI & MISI */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src={data.foto || "/noImage.jpg"}
              alt={`Foto Kepala Desa ${data.nama}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="font-bold text-lg">{data.kepalaDesa}</p>
                <p className="text-sm opacity-80">
                  {data.jabatan} {data.nama}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Target size={16} />
              Visi & Misi
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              &quot;{data.visi}&quot;
            </h2>

            <div className="space-y-4">
              {/* List Misi dengan Style Card Kecil */}
              {data.misi.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEJARAH DESA  */}
        <section className="grid px-8 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
              <History size={16} />
              Sejarah Desa {data.nama}
            </div>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed text-justify">
              <p>{data.sejarah}</p>
            </div>
          </div>
        </section>

        {/* GEOGRAFIS  */}
        <section className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Hiasan Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-4">
                <Map size={16} />
                Geografis
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Wilayah Strategis & Subur
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Kondisi alam dan kualitas tanah di desa {data.nama} memberikan
                peluang untuk pengembangan pertanian dan perkebunan yang beragam
                sesuai kebutuhan masyarakat.
              </p>
              <Link
                href="/profil/peta"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition"
              >
                Lihat Peta Desa <ArrowRight size={18} />
              </Link>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Luas Wilayah</p>
                <p className="text-2xl font-bold mt-1">
                  450{" "}
                  <span className="text-base font-normal text-gray-400">
                    Ha
                  </span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Jml. Dusun</p>
                <p className="text-2xl font-bold mt-1">
                  {dusunFilter.length}{" "}
                  <span className="text-base font-normal text-gray-400">
                    Dusun
                  </span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Ketinggian</p>
                <p className="text-2xl font-bold mt-1">
                  500{" "}
                  <span className="text-base font-normal text-gray-400">
                    Mdpl
                  </span>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Suhu Rata-rata</p>
                <p className="text-2xl font-bold mt-1">
                  24{" "}
                  <span className="text-base font-normal text-gray-400">
                    °C
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
