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
        <Skeleton className="h-10 w-32 bg-slate-800 rounded-xl" />
      </div>

      {/* FILTER BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* LIST BERITA SKELETON */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-start"
          >
            {/* Thumbnail */}
            <Skeleton className="w-full md:w-32 h-24 rounded-lg bg-gray-200 shrink-0" />

            {/* Content Info */}
            <div className="flex-1 w-full space-y-3">
              {/* Meta Badges */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 bg-slate-200 rounded-md" />
                <Skeleton className="h-5 w-24 bg-gray-100 rounded-md" />
                <Skeleton className="h-5 w-16 bg-gray-100 rounded-md" />
              </div>

              {/* Title */}
              <div className="space-y-1">
                <Skeleton className="h-6 w-3/4 bg-gray-300 rounded" />
                <Skeleton className="h-6 w-1/2 bg-gray-300 rounded" />
              </div>

              {/* Author */}
              <Skeleton className="h-3 w-32 bg-gray-200 rounded" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
              <Skeleton className="h-9 w-9 rounded-lg bg-blue-50" />
              <Skeleton className="h-9 w-9 rounded-lg bg-red-50" />
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
