import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-8 w-64 bg-gray-300 rounded-lg" />
        <Skeleton className="h-4 w-96 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KIRI: PENCARIAN SKELETON */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <Skeleton className="h-4 w-32 bg-gray-300 rounded" />
            <Skeleton className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>

          {/* Preview Card Skeleton */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 border-dashed">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-300 rounded" />
                <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full bg-gray-200 rounded" />
              <Skeleton className="h-3 w-full bg-gray-200 rounded" />
              <Skeleton className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* KANAN: FORMULIR SKELETON */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="w-6 h-6 bg-blue-200 rounded" />
              <Skeleton className="h-6 w-48 bg-gray-300 rounded-lg" />
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                <Skeleton className="h-10 w-full bg-gray-100 rounded-xl" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                  <Skeleton className="h-10 w-full bg-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                  <Skeleton className="h-10 w-full bg-gray-100 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                <Skeleton className="h-24 w-full bg-gray-100 rounded-xl" />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Skeleton className="h-10 w-24 bg-gray-200 rounded-xl" />
              <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
