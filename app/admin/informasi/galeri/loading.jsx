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

      {/* FILTER BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* PHOTO GRID SKELETON */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Simulate 'Upload New' Card */}
        <Skeleton className="aspect-square rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300" />

        {/* Gallery Items */}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-gray-200 relative overflow-hidden"
          >
            {/* Overlay Hint */}
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <Skeleton className="h-3 w-20 bg-gray-300/50 rounded" />
              <Skeleton className="h-4 w-full bg-gray-300/50 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION SKELETON */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
          <Skeleton className="h-10 w-32 rounded-lg bg-white border border-gray-200" />
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
