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
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* LIST AGENDA SKELETON */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Date Box */}
            <Skeleton className="w-full md:w-20 h-20 rounded-xl bg-slate-200 shrink-0" />

            {/* Content */}
            <div className="flex-1 w-full space-y-3">
              {/* Badges */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 bg-blue-100 rounded-md" />
                <Skeleton className="h-5 w-32 bg-gray-200 rounded-md" />
              </div>

              {/* Title */}
              <Skeleton className="h-6 w-1/2 bg-gray-300 rounded-lg" />

              {/* Location */}
              <Skeleton className="h-4 w-1/3 bg-gray-200 rounded" />

              {/* Description */}
              <Skeleton className="h-4 w-3/4 bg-gray-100 rounded" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
              <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
              <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION SKELETON */}
      <div className="p-4 flex justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
          <Skeleton className="h-10 w-32 rounded-lg bg-white border border-gray-200" />
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
