import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center gap-4">
          {/* Badge */}
          <Skeleton className="h-8 w-32 rounded-full bg-blue-100" />
          {/* Title */}
          <Skeleton className="h-12 w-3/4 bg-gray-300 rounded-xl" />
          {/* Description */}
          <div className="w-full flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-2/3 bg-gray-200" />
          </div>
        </div>

        {/* LAYOUT UTAMA SKELETON */}
        <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
          {/* PETA (KIRI - BESAR) */}
          <div className="lg:col-span-2 h-[400px] lg:h-full">
            <Skeleton className="w-full h-full rounded-3xl bg-gray-200" />
          </div>

          {/* INFO DETAIL (KANAN) */}
          <div className="space-y-6 h-full overflow-hidden">
            {/* Card Alamat Skeleton */}
            <div className="p-6 rounded-2xl border border-gray-200">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl bg-green-100 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-32 bg-gray-300" />
                  <Skeleton className="h-16 w-full bg-gray-100" />
                  <Skeleton className="h-4 w-40 bg-green-50" />
                </div>
              </div>
            </div>

            {/* Card Batas Wilayah Skeleton */}
            <div className="p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-6 w-6 rounded-full bg-orange-100" />
                <Skeleton className="h-6 w-32 bg-gray-300" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-gray-50 pb-2"
                  >
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Card Statistik Kecil Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 flex flex-col items-center gap-2">
                <Skeleton className="h-4 w-20 bg-blue-200" />
                <Skeleton className="h-8 w-16 bg-blue-200" />
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 flex flex-col items-center gap-2">
                <Skeleton className="h-4 w-20 bg-purple-200" />
                <Skeleton className="h-8 w-16 bg-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
