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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template Items */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full space-y-4"
          >
            {/* Icon & Code */}
            <div className="flex justify-between items-center">
              <Skeleton className="w-12 h-12 rounded-xl bg-gray-200" />
              <Skeleton className="h-6 w-16 bg-gray-100 rounded" />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 bg-gray-300 rounded" />
              <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
              <Skeleton className="h-9 flex-1 bg-gray-100 rounded-lg" />
              <Skeleton className="h-9 w-9 bg-gray-100 rounded-lg" />
              <Skeleton className="h-9 w-9 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}

        {/* Add New Card Skeleton */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center h-full min-h-[200px] gap-2">
          <Skeleton className="w-12 h-12 rounded-full bg-gray-100" />
          <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
