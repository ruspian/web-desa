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

      {/* SEARCH & FILTER SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* LIST CONTENT SKELETON */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Image Thumbnail */}
            <Skeleton className="w-full md:w-48 h-32 rounded-xl bg-gray-200 shrink-0" />

            {/* Content Info */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  {/* Category Badge */}
                  <Skeleton className="h-5 w-24 rounded-md bg-blue-100" />
                  {/* Title */}
                  <Skeleton className="h-6 w-3/4 bg-gray-300 rounded-lg" />
                </div>
              </div>

              {/* Meta Info (Lokasi, Pemilik) */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32 bg-gray-100 rounded" />
                <Skeleton className="h-4 w-32 bg-gray-100 rounded" />
              </div>

              {/* Description */}
              <div className="space-y-2 pt-1">
                <Skeleton className="h-3 w-full bg-gray-50 rounded" />
                <Skeleton className="h-3 w-2/3 bg-gray-50 rounded" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 self-start md:self-center">
              <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
              <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
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
