import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-4">
          {/* Badge */}
          <Skeleton className="h-8 w-40 rounded-full bg-emerald-100" />
          {/* judul */}
          <Skeleton className="h-12 w-3/4 bg-gray-300 rounded-xl" />
          {/* deskripsi */}
          <div className="w-full flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-2/3 bg-gray-200" />
          </div>
        </div>

        {/*  PIMPINAN */}
        <div className="flex flex-col items-center gap-12 mb-20">
          {/* KEPALA DESA  */}
          <div className="relative w-full flex justify-center">
            <div className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
              <Skeleton className="h-80 w-full bg-gray-300" />
              <div className="p-6 flex flex-col items-center gap-3">
                <Skeleton className="h-8 w-48 bg-gray-200" />
                <Skeleton className="h-4 w-32 bg-gray-100" />
              </div>
            </div>
          </div>

          {/* SEKRETARIS DESA */}
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
              <Skeleton className="h-64 w-full bg-gray-200" />
              <div className="p-6 flex flex-col items-center gap-3">
                <Skeleton className="h-6 w-40 bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER SKELETON */}
        <div className="relative flex py-5 items-center mb-16 max-w-4xl mx-auto">
          <div className="fgrow border-t border-gray-200"></div>
          <Skeleton className="mx-4 h-4 w-48 bg-gray-200" />
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* === BAGIAN 2: STAFF & KADUS (GRID) === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Image Area */}
              <Skeleton className="h-64 w-full bg-gray-200" />
              {/* Content Area */}
              <div className="p-6 flex flex-col items-center gap-3">
                <Skeleton className="h-6 w-32 bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-100" />
                <div className="w-full border-t border-gray-100 pt-4 mt-2 flex justify-center">
                  <Skeleton className="h-8 w-28 rounded-full bg-green-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
