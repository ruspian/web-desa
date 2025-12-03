import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER & DOWNLOAD SKELETON */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="w-full max-w-lg space-y-4">
            {/* Badge */}
            <Skeleton className="h-8 w-48 rounded-full bg-green-100" />
            {/* judul */}
            <Skeleton className="h-12 w-3/4 bg-gray-300 rounded-xl" />
            {/* Deskripsi */}
            <Skeleton className="h-4 w-full bg-gray-200 rounded" />
          </div>

          <div className="flex gap-3">
            {/* Select tahun */}
            <Skeleton className="h-12 w-32 rounded-xl bg-white border border-gray-200" />
            {/* tombol */}
            <Skeleton className="h-12 w-40 rounded-xl bg-gray-800" />
          </div>
        </div>

        {/*  CARDS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden h-40 flex flex-col justify-center"
            >
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Skeleton className="h-20 w-20 rounded-full bg-gray-100" />
              </div>
              <div className="relative z-10 space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-200" />
                <Skeleton className="h-10 w-48 bg-gray-300 rounded-lg" />
                <Skeleton className="h-4 w-24 bg-gray-100 mt-2" />
              </div>
            </div>
          ))}

          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl relative overflow-hidden h-40 flex flex-col justify-center">
            <div className="relative z-10 space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-700" />
              <Skeleton className="h-10 w-48 bg-gray-600 rounded-lg" />
              <Skeleton className="h-4 w-40 bg-gray-700 mt-2" />
            </div>
          </div>
        </div>

        {/* CHARTS SECTION SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* PIE CHART SKELETON */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-1 flex flex-col items-center justify-center h-[400px]">
            <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg mb-8 self-start" />
            <div className="relative w-full flex justify-center">
              <Skeleton className="h-56 w-56 rounded-full bg-gray-200" />
              <div className="absolute bottom-0 w-full flex justify-center gap-2 mt-8">
                <Skeleton className="h-3 w-10 bg-gray-300" />
                <Skeleton className="h-3 w-10 bg-gray-300" />
                <Skeleton className="h-3 w-10 bg-gray-300" />
              </div>
            </div>
          </div>

          {/* PROGRESS BARS SKELETON */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 h-[400px] flex flex-col">
            <Skeleton className="h-8 w-64 bg-gray-300 rounded-lg mb-8" />

            <div className="space-y-8 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2 w-3/4">
                      <Skeleton className="h-5 w-1/2 bg-gray-200 rounded" />
                      <Skeleton className="h-3 w-1/3 bg-gray-100 rounded" />
                    </div>
                    <Skeleton className="h-6 w-12 bg-gray-200 rounded" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full bg-gray-100" />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
              <Skeleton className="h-4 w-64 bg-gray-200" />
            </div>
          </div>
        </div>

        {/* INFO SKELETON */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full bg-blue-200 shrink-0" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-40 bg-blue-200 rounded" />
            <Skeleton className="h-4 w-full bg-blue-100 rounded" />
            <Skeleton className="h-4 w-3/4 bg-blue-100 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
