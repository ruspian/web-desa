import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/*  HEADER SECTION SKELETON  */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="max-w-2xl w-full space-y-4">
            {/* Badge */}
            <Skeleton className="h-8 w-32 rounded-full bg-indigo-100" />
            {/* judul */}
            <Skeleton className="h-12 w-3/4 bg-gray-300 rounded-xl" />
            {/* deskripsi */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-5/6 bg-gray-200" />
            </div>
          </div>

          {/* Statistik Singkat Skeleton */}
          <div className="flex gap-4 shrink-0">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[120px] space-y-2">
              <Skeleton className="h-8 w-8 mx-auto bg-gray-300" />
              <Skeleton className="h-3 w-16 mx-auto bg-gray-100" />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[120px] space-y-2">
              <Skeleton className="h-8 w-12 mx-auto bg-gray-300" />
              <Skeleton className="h-3 w-20 mx-auto bg-gray-100" />
            </div>
          </div>
        </div>

        {/*  GRID LEMBAGA SKELETON  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Icon Box Skeleton */}
              <Skeleton className="w-16 h-16 rounded-2xl shrink-0 bg-gray-200" />

              <div className="flex-1 w-full space-y-4">
                {/* judul */}
                <Skeleton className="h-8 w-1/2 bg-gray-300 rounded-lg" />

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-100" />
                  <Skeleton className="h-4 w-full bg-gray-100" />
                  <Skeleton className="h-4 w-2/3 bg-gray-100" />
                </div>

                {/* Info Bar Skeleton */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 mt-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-10 bg-gray-200" />
                      <Skeleton className="h-4 w-24 bg-gray-300" />
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                  <div className="flex items-center gap-2 flex-1">
                    <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-12 bg-gray-200" />
                      <Skeleton className="h-4 w-16 bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
