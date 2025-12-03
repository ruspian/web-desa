import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-48 bg-gray-200 rounded" />
        </div>
        <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* FILTER BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        <Skeleton className="h-10 w-48 bg-gray-100 rounded-lg" />
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <Skeleton className="h-4 w-24 bg-gray-300" />
          <Skeleton className="h-4 w-32 bg-gray-300" />
          <Skeleton className="h-4 w-24 bg-gray-300" />
          <Skeleton className="h-4 w-20 bg-gray-300" />
          <Skeleton className="h-4 w-16 bg-gray-300" />
        </div>

        {/* Table Rows */}
        <div className="p-4 space-y-4 flex-1 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              {/* No KK */}
              <Skeleton className="h-5 w-32 bg-gray-200 rounded" />
              {/* Kepala Keluarga */}
              <Skeleton className="h-5 w-40 bg-gray-300 rounded" />
              {/* Alamat */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-24 bg-gray-100 rounded" />
                <Skeleton className="h-3 w-16 bg-gray-100 rounded" />
              </div>
              {/* Anggota Badge */}
              <Skeleton className="h-6 w-16 rounded-full bg-blue-50" />
              {/* Actions */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-100" />
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-100" />
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-100" />
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
