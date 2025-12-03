import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* SEARCH BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
      </div>

      {/* GRID CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
          >
            {/* Image Placeholder */}
            <div className="h-64 w-full relative bg-gray-200">
              <div className="absolute top-3 right-3">
                <Skeleton className="h-6 w-16 rounded-lg bg-white/50" />
              </div>
            </div>

            {/* Info Placeholder */}
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                {/* Jabatan */}
                <Skeleton className="h-3 w-24 bg-emerald-100 rounded" />
                {/* Nama */}
                <Skeleton className="h-6 w-3/4 bg-gray-300 rounded" />
                {/* NIP */}
                <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>

              {/* Phone Box */}
              <Skeleton className="h-9 w-full bg-gray-50 rounded-lg" />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <Skeleton className="h-9 w-full bg-gray-100 rounded-lg" />
                <Skeleton className="h-9 w-full bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION SKELETON */}
      <div className="flex justify-center pt-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
          <Skeleton className="h-10 w-32 rounded-lg bg-white border border-gray-200" />
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
