import Image from "next/image";
import { Users, Shield, UserCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getColorStyles, getIconByAbbr } from "@/lib/iconColor";

export const revalidate = 360;

export default async function LembagaPage() {
  //  Ambil Data Lembaga dari DB
  const lembagaData = await prisma.lembagaDesa.findMany({
    orderBy: { id: "asc" },
  });

  // Hitung Total Anggota
  const totalAnggota = lembagaData.reduce((acc, curr) => acc + curr.anggota, 0);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* === HEADER SECTION === */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <Users size={16} />
              Mitra Desa
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Lembaga Kemasyarakatan
            </h1>
            <p className="text-gray-500 text-lg">
              Sinergi antara Pemerintah Desa dengan berbagai lembaga mitra untuk
              mewujudkan pembangunan yang partisipatif dan inklusif.
            </p>
          </div>

          {/* Statistik Singkat */}
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[120px]">
              <span className="block text-3xl font-bold text-gray-800">
                {lembagaData.length}
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase">
                Lembaga Aktif
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[120px]">
              <span className="block text-3xl font-bold text-gray-800">
                {totalAnggota}+
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase">
                Total Anggota
              </span>
            </div>
          </div>
        </div>

        {/* GRID LEMBAGA  */}
        {lembagaData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lembagaData.map((item) => {
              const IconComponent = getIconByAbbr(item.singkatan);
              const styles = getColorStyles(item.warna);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  <IconComponent
                    className={`absolute -right-6 -bottom-6 w-48 h-48 opacity-5 group-hover:scale-110 transition-transform duration-500 ${styles.text}`}
                  />

                  <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    {/* Icon Box  */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${styles.bg}`}
                    >
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.singkatan}
                          width={40}
                          height={40}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="font-bold text-xl tracking-wider">
                          {item.singkatan}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {item.nama}
                        </h3>
                      </div>

                      <p className="text-gray-500 leading-relaxed mb-6 text-sm line-clamp-2">
                        {item.deskripsi}
                      </p>

                      {/* Info Bar */}
                      <div
                        className={`flex flex-wrap items-center gap-4 p-4 rounded-xl ${styles.light}`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCircle size={18} className={styles.text} />
                          <div>
                            <p className="text-xs text-gray-500">Ketua</p>
                            <p className="text-sm font-bold text-gray-800">
                              {item.ketua || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-gray-300/50 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                          <Users size={18} className={styles.text} />
                          <div>
                            <p className="text-xs text-gray-500">Anggota</p>
                            <p className="text-sm font-bold text-gray-800">
                              {item.anggota} Orang
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">
              Belum ada data lembaga yang diinput.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
