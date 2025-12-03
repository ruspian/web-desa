import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-pulse">
          <div className="max-w-2xl w-full space-y-4">
            {/* Badge */}
            <Skeleton className="h-8 w-40 rounded-full bg-orange-100/50" />
            {/* Title */}
            <Skeleton className="h-12 w-64 rounded-xl bg-gray-300" />
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-lg rounded-md" />
              <Skeleton className="h-4 w-3/4 max-w-lg rounded-md" />
            </div>
          </div>
        </div>

        {/* LAYOUT UTAMA */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* SIDEBAR SKELETON */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <Skeleton className="h-6 w-32 mb-4 rounded-md" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT LIST SKELETON */}
          <div className="lg:col-span-3 space-y-12">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="w-2 h-8 rounded-full bg-green-200" />
              <Skeleton className="h-8 w-48 rounded-lg" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start"
                >
                  {/* Date Box */}
                  <Skeleton className="shrink-0 w-full md:w-24 h-24 rounded-2xl bg-gray-200" />

                  {/* Event Details */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex gap-3">
                      <Skeleton className="h-6 w-24 rounded-md bg-gray-200" />
                      <Skeleton className="h-6 w-32 rounded-md bg-gray-200" />
                    </div>

                    <Skeleton className="h-8 w-3/4 rounded-lg bg-gray-300" />

                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-40 rounded-md" />
                    </div>

                    <div className="space-y-2 pt-2 border-l-2 border-gray-100 pl-4">
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-5/6 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
