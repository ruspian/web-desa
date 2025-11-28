import { MapPin, Compass, ArrowRight, Navigation } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PetaDesaWrapper from "@/components/PetaDesaWrapper";

export const revalidate = 3600;

export default async function PetaPage() {
  // Ambil Data Lokasi dari Database
  const locations = await prisma.petaLokasi.findMany();

  // Ambil Alamat Desa dari Pengaturan
  const settings = await prisma.siteSettings.findFirst();

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Compass size={16} />
            Peta Wilayah
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Jelajahi Wilayah Desa
          </h1>
          <p className="text-gray-500 text-lg">
            Peta digital yang menampilkan lokasi kantor pemerintahan, fasilitas
            umum, dan batas wilayah administrasi {settings?.namaDesa || "Desa"}.
          </p>
        </div>

        {/* LAYOUT UTAMA */}
        <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
          {/* PETA  */}
          <div className="lg:col-span-2 h-[400px] lg:h-full shadow-2xl rounded-3xl border-4 border-white overflow-hidden">
            {/* Panggil Wrapper, bukan dynamic import langsung */}
            <PetaDesaWrapper locations={locations} />
          </div>

          {/* INFO DETAIL */}
          <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Card Alamat */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Kantor Desa {settings?.namaDesa || ""}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm leading-relaxed">
                    {settings?.alamat ||
                      "Alamat belum diatur di menu Pengaturan."}
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-500 hover:underline"
                  >
                    Buka di Google Maps <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card Batas Wilayah */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation size={18} className="text-orange-500" /> Batas
                Wilayah
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Utara</span>
                  <span className="font-medium text-gray-800">
                    Desa Suka Maju
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Selatan</span>
                  <span className="font-medium text-gray-800">
                    Sungai Bengawan
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Timur</span>
                  <span className="font-medium text-gray-800">
                    Kecamatan Sebelah
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Barat</span>
                  <span className="font-medium text-gray-800">
                    Hutan Lindung
                  </span>
                </li>
              </ul>
            </div>

            {/* Card Statistik Wilayah Kecil */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-center">
                <span className="text-xs text-blue-600 font-bold uppercase">
                  Luas Wilayah
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  450{" "}
                  <span className="text-xs text-gray-500 font-normal">Ha</span>
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl text-center">
                <span className="text-xs text-purple-600 font-bold uppercase">
                  Ketinggian
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  500{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    MDPL
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
