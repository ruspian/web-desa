import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* STATS CARDS SKELETON */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <Skeleton className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-gray-200 rounded" />
              <Skeleton className="h-6 w-10 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* FILTER TABS & TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs Skeleton */}
        <div className="flex border-b border-gray-100 overflow-x-auto p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4">
              <Skeleton className="h-5 w-24 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="p-0">
          {/* Table Header */}
          <div className="bg-gray-50 p-4 flex justify-between border-b border-gray-100">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-4 w-32 bg-gray-300" />
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-4 w-40 bg-gray-300" />
            <Skeleton className="h-4 w-20 bg-gray-300" />
          </div>

          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-50"
            >
              {/* Badge Jenis */}
              <Skeleton className="h-6 w-28 rounded-full bg-blue-50" />

              {/* Nama */}
              <div className="space-y-1 w-40">
                <Skeleton className="h-4 w-full bg-gray-300 rounded" />
                <Skeleton className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>

              {/* Tanggal */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
              </div>

              {/* Keterangan */}
              <Skeleton className="h-4 w-48 bg-gray-100 rounded hidden md:block" />

              {/* Status/Action */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded bg-red-50" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-lg bg-gray-200" />
            <Skeleton className="h-9 w-9 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
