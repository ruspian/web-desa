import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* STATS CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <Skeleton className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
              <Skeleton className="h-8 w-16 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-9 w-24 rounded-md bg-gray-200 shrink-0"
            />
          ))}
        </div>

        {/* Search Input */}
        <Skeleton className="h-10 w-full md:w-64 rounded-lg bg-gray-100" />
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-350px)]">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-6 w-full">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-4 w-32 bg-gray-300 hidden md:block" />
            <Skeleton className="h-4 w-32 bg-gray-300 hidden md:block" />
            <Skeleton className="h-4 w-24 bg-gray-300 hidden sm:block" />
          </div>
          <Skeleton className="h-4 w-16 bg-gray-300 shrink-0" />
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-hidden p-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50/50"
            >
              <div className="flex gap-6 w-full items-center">
                {/* ID & Date */}
                <div className="space-y-1.5 w-24">
                  <Skeleton className="h-3 w-20 bg-gray-300 rounded" />
                  <Skeleton className="h-3 w-16 bg-gray-200 rounded" />
                </div>

                {/* Pemohon */}
                <div className="space-y-1.5 w-32 hidden md:block">
                  <Skeleton className="h-4 w-full bg-gray-300 rounded" />
                  <Skeleton className="h-3 w-2/3 bg-gray-200 rounded" />
                </div>

                {/* Jenis Surat */}
                <div className="w-32 hidden md:block">
                  <Skeleton className="h-4 w-full bg-gray-200 rounded" />
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-20 rounded-md bg-yellow-50" />
                </div>
              </div>

              {/* Actions */}
              <Skeleton className="h-8 w-20 rounded-lg bg-blue-50 shrink-0" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-lg bg-gray-200" />
            <Skeleton className="h-9 w-32 rounded-lg bg-white border border-gray-200" />
            <Skeleton className="h-9 w-9 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
