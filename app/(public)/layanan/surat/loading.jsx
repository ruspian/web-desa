import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-40 rounded-full bg-green-100" />
          <Skeleton className="h-10 w-64 bg-gray-300 rounded-xl" />
          <div className="w-full flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-full max-w-lg bg-gray-200 rounded" />
            <Skeleton className="h-4 w-3/4 max-w-lg bg-gray-200 rounded" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* INFO DATA DIRI SKELETON */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <Skeleton className="h-6 w-32 bg-blue-100 rounded" />

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <Skeleton className="h-3 w-12 bg-gray-300 rounded" />
                    <Skeleton className="h-5 w-3/4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Jam Operasional */}
            <Skeleton className="h-32 w-full rounded-2xl bg-green-100" />
          </div>

          {/* FORM SKELETON */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
              <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg mb-6" />

              {/* Select Jenis Surat */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
              </div>

              {/* Dynamic Fields */}
              <div className="p-5 rounded-xl border border-blue-100 bg-blue-50 space-y-4">
                <Skeleton className="h-4 w-40 bg-blue-200 rounded" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full rounded-xl bg-white" />
                  <Skeleton className="h-12 w-full rounded-xl bg-white" />
                </div>
              </div>

              {/* Inputs Grid  */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                </div>
              </div>

              {/* Upload Area */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-gray-200 rounded" />
                    <Skeleton className="h-32 w-full rounded-xl bg-gray-100 border-2 border-dashed border-gray-200" />
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <Skeleton className="h-14 w-full rounded-xl bg-green-600/20 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
