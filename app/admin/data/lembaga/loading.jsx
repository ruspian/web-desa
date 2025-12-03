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

      {/* pencarian*/}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
      </div>

      {/* CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              {/* Icon Box */}
              <Skeleton className="w-16 h-16 rounded-2xl bg-gray-200" />
              {/* aksi */}
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded-lg bg-gray-100" />
                <Skeleton className="w-8 h-8 rounded-lg bg-gray-100" />
              </div>
            </div>

            {/* judul dan deskripsi */}
            <Skeleton className="h-6 w-1/2 bg-gray-300 rounded mb-2" />
            <div className="space-y-2 mb-6 flex-1">
              <Skeleton className="h-4 w-full bg-gray-100 rounded" />
              <Skeleton className="h-4 w-3/4 bg-gray-100 rounded" />
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-gray-100" />
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
