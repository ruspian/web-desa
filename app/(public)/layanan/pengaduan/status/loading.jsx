import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* HEADER SKELETON */}
        <div className="text-center mb-10 flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-64 rounded-xl bg-gray-300" />
          <div className="w-full flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-full max-w-lg bg-gray-200 rounded" />
            <Skeleton className="h-4 w-3/4 max-w-lg bg-gray-200 rounded" />
          </div>
        </div>

        {/* SEARCH BOX SKELETON */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg mb-10 relative z-10 space-y-4 md:flex md:gap-4 md:space-y-0">
          <Skeleton className="h-14 w-full rounded-xl bg-gray-100 flex-1" />
          <Skeleton className="h-14 w-32 rounded-xl bg-gray-800" />
        </div>

        {/* RESULT CARD SKELETON */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header Status Skeleton */}
          <div className="p-6 flex items-center gap-4 border-b border-gray-100">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
              <Skeleton className="h-6 w-48 bg-gray-300 rounded-md" />
            </div>
          </div>

          {/* Body Skeleton */}
          <div className="p-8 space-y-8">
            {/* Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20 bg-gray-200 rounded" />
                  <Skeleton className="h-5 w-32 bg-gray-100 rounded" />
                </div>
              ))}
            </div>

            {/* Isi & Lokasi */}
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 space-y-4">
              <Skeleton className="h-5 w-40 bg-gray-200 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-5/6 bg-gray-200" />
              </div>
            </div>

            {/* Tanggapan */}
            <div className="pl-6 border-l-4 border-gray-200 space-y-3">
              <Skeleton className="h-4 w-32 bg-gray-300 rounded" />
              <Skeleton className="h-20 w-full rounded-xl bg-blue-50/50" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
