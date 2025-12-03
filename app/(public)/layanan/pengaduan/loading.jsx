import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-40 rounded-full bg-red-100" />
          <Skeleton className="h-10 w-3/4 bg-gray-300 rounded-xl" />
          <div className="w-full flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-full max-w-lg bg-gray-200 rounded" />
            <Skeleton className="h-4 w-2/3 max-w-lg bg-gray-200 rounded" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* SIDEBAR INFO SKELETON */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* Card Privasi */}
            <div className="h-48 rounded-2xl bg-gray-800/10 animate-pulse" />

            {/* Card Kategori */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <Skeleton className="h-6 w-32 bg-gray-300 rounded" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
                    <Skeleton className="h-4 w-3/4 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM AREA SKELETON */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-8">
              {/* Toggle Skeleton */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex gap-3 items-center">
                  <Skeleton className="w-10 h-10 rounded-lg bg-gray-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-300" />
                    <Skeleton className="h-3 w-32 bg-gray-200" />
                  </div>
                </div>
                <Skeleton className="w-12 h-6 rounded-full bg-gray-300" />
              </div>

              <div className="space-y-6">
                {/* Input */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                    <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                    <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                  </div>
                </div>

                {/* Input Single */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-100 w-full" />

                {/* Input */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-32 w-full rounded-xl bg-gray-100" />
                </div>

                {/* Upload */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-24 w-full rounded-xl border-2 border-dashed border-gray-200" />
                </div>

                {/* tombol */}
                <Skeleton className="h-14 w-full rounded-xl bg-red-600/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
