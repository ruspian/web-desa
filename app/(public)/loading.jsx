import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO SECTION SKELETON  */}
      <section className="relative h-screen flex items-center bg-gray-900/5 overflow-hidden">
        <div className="container mx-auto px-6 z-10 pt-20">
          <div className="max-w-3xl space-y-6">
            {/* Badge */}
            <Skeleton className="h-8 w-64 rounded-full bg-gray-300" />

            {/* judul Besar */}
            <div className="space-y-3">
              <Skeleton className="h-14 md:h-20 w-3/4 bg-gray-300 rounded-2xl" />
              <Skeleton className="h-14 md:h-20 w-1/2 bg-gray-300 rounded-2xl" />
            </div>

            {/* deskripsi */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-5 w-full max-w-lg bg-gray-300 rounded" />
              <Skeleton className="h-5 w-5/6 max-w-lg bg-gray-300 rounded" />
            </div>

            {/* tombol */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Skeleton className="h-12 w-48 rounded-xl bg-gray-300" />
              <Skeleton className="h-12 w-48 rounded-xl bg-gray-300" />
            </div>
          </div>
        </div>
      </section>

      {/*STATISTIK BENTO SKELETON  */}
      <section className="py-20 container mx-auto px-6 relative z-20 -mt-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Penduduk */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-72 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Skeleton className="w-14 h-14 rounded-2xl bg-gray-200" />
              <Skeleton className="w-24 h-6 rounded-full bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-40 bg-gray-300 rounded-lg" />
              <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
            </div>
            <Skeleton className="h-3 w-full rounded-full bg-gray-100" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-20 bg-gray-100" />
              <Skeleton className="h-3 w-20 bg-gray-100" />
            </div>
          </div>

          {/* APBDes */}
          <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-72 flex flex-col justify-between">
            <div className="flex justify-end">
              <Skeleton className="w-24 h-24 rounded-full bg-gray-100 opacity-50" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
              <div>
                <Skeleton className="h-4 w-24 bg-gray-100 mb-2" />
                <Skeleton className="h-10 w-20 bg-gray-300 rounded" />
              </div>
              <Skeleton className="h-2 w-full bg-gray-100 rounded-full" />
            </div>
          </div>

          {/* Jam Layanan */}
          <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-72 flex flex-col items-center justify-center gap-3">
            <Skeleton className="w-16 h-16 rounded-full bg-gray-200" />
            <Skeleton className="h-5 w-32 bg-gray-300 rounded" />
            <Skeleton className="h-3 w-24 bg-gray-100 rounded" />
            <Skeleton className="h-8 w-32 bg-gray-200 rounded-lg mt-2" />
          </div>

          {/*Berita  */}
          <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mt-4">
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
                <Skeleton className="h-4 w-64 bg-gray-100 rounded" />
              </div>
              <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-2xl bg-gray-200" />
                  <Skeleton className="h-4 w-20 bg-gray-100 rounded" />
                  <Skeleton className="h-6 w-full bg-gray-300 rounded" />
                  <Skeleton className="h-4 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  POTENSI SECTION SKELETON  */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4 mb-12">
            <Skeleton className="h-8 w-32 rounded-full bg-gray-200" />
            <Skeleton className="h-10 w-96 rounded-xl bg-gray-300" />
            <Skeleton className="h-4 w-full max-w-lg bg-gray-100" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-3xl bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
