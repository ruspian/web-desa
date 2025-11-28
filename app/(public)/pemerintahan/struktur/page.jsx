import StaffCard from "@/components/cards/StaffCard";
import Divider from "@/components/Divider";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function StrukturPage() {
  // Fetch Data dari Database
  const allStaff = await prisma.perangkatDesa.findMany({
    where: { status: "Aktif" },
    orderBy: { urutan: "asc" },
  });

  // Filter Hirarki
  const kades = allStaff.find((p) =>
    p.jabatan.toLowerCase().includes("kepala desa")
  );
  const sekdes = allStaff.find((p) =>
    p.jabatan.toLowerCase().includes("sekretaris")
  );

  // Sisa perangkat - Kecuali Kades & Sekdes
  const staffLain = allStaff.filter(
    (p) =>
      !p.jabatan.toLowerCase().includes("kepala desa") &&
      !p.jabatan.toLowerCase().includes("sekretaris")
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50 pt-24 pb-20 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm bg-emerald-100 px-3 py-1 rounded-full">
            Pemerintahan Desa
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Mengenal jajaran perangkat desa yang berdedikasi melayani masyarakat
            Desa Makmur Jaya dengan sepenuh hati.
          </p>
        </div>

        <div className="flex flex-col items-center gap-12 mb-20">
          {/* KEPALA DESA  */}
          {kades && (
            <div className="relative w-full flex justify-center animate-fade-in-up">
              {/* Dekorasi Background Belakang Kades */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-r from-emerald-200/50 via-blue-200/50 to-purple-200/50 blur-3xl rounded-full -z-10 opacity-50"></div>
              <StaffCard data={kades} type="leader" />
            </div>
          )}

          {/* SEKRETARIS DESA */}
          {sekdes && (
            <div className="w-full max-w-sm animate-fade-in-up delay-100">
              <StaffCard data={sekdes} type="staff" />
            </div>
          )}
        </div>

        {/* DIVIDER / PEMBATAS */}
        <Divider text="Perangkat Desa & Kepala Dusun" />

        {staffLain.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {staffLain.map((item) => (
              <div key={item.id} className="animate-fade-in-up">
                <StaffCard data={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 italic">
              Data perangkat desa lainnya belum tersedia.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
