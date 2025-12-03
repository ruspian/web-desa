import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      {/* BREADCRUMB SKELETON */}
      <div className="container mx-auto px-6 mb-6">
        <Skeleton className="h-5 w-48 rounded bg-gray-200" />
      </div>

      {/* CONTENT HEADER SKELETON */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* FOTO SKELETON */}
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-3xl overflow-hidden bg-gray-200 animate-pulse border border-gray-100">
            {/* Badge Skeleton */}
            <div className="absolute top-4 left-4">
              <Skeleton className="h-8 w-24 rounded-full bg-white/50" />
            </div>
          </div>

          {/* INFO DETAIL SKELETON */}
          <div className="space-y-8 py-4 w-full">
            {/* JUDUL */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4 rounded-lg bg-gray-300" />
              <Skeleton className="h-10 w-1/2 rounded-lg bg-gray-300" />
            </div>

            {/* Lokasi & Pemilik */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full bg-orange-200" />
                <Skeleton className="h-5 w-48 rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full bg-blue-200" />
                <Skeleton className="h-5 w-40 rounded bg-gray-200" />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Deskripsi */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-5/6 bg-gray-200" />
              <br />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-4/5 bg-gray-200" />
            </div>

            {/* tombol */}
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200" />
              <Skeleton className="h-12 flex-1 rounded-xl bg-green-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Konten yang lain */}
      <div className="container mx-auto px-6 mt-24">
        <Skeleton className="h-8 w-64 mb-8 rounded-lg bg-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <Skeleton className="h-48 w-full bg-gray-200" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20 rounded bg-green-100" />
                <Skeleton className="h-6 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
