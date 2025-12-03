import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 bg-white border border-gray-200 rounded-xl" />
          <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* STATS CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <Skeleton className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
              <Skeleton className="h-6 w-16 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        <Skeleton className="h-10 w-48 bg-gray-100 rounded-lg" />
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-450px)]">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-8 w-full">
            <Skeleton className="h-4 w-32 bg-gray-300" /> {/* Penerima */}
            <Skeleton className="h-4 w-24 bg-gray-300 hidden md:block" />{" "}
            {/* Jenis */}
            <Skeleton className="h-4 w-16 bg-gray-300 hidden md:block" />{" "}
            {/* Periode */}
            <Skeleton className="h-4 w-24 bg-gray-300 hidden md:block" />{" "}
            {/* Nominal */}
            <Skeleton className="h-4 w-20 bg-gray-300 hidden sm:block" />{" "}
            {/* Status */}
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
              <div className="flex gap-8 w-full items-center">
                {/* Kolom Penerima (Nama, NIK, Dusun) */}
                <div className="space-y-1.5 w-48">
                  <Skeleton className="h-5 w-3/4 bg-gray-300 rounded" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
                  <Skeleton className="h-3 w-1/3 bg-gray-100 rounded" />
                </div>

                {/* Kolom Jenis */}
                <div className="w-32 hidden md:block">
                  <Skeleton className="h-6 w-24 rounded-md bg-blue-50" />
                </div>

                {/* Kolom Periode */}
                <div className="w-16 hidden md:block">
                  <Skeleton className="h-4 w-12 bg-gray-200 rounded" />
                </div>

                {/* Kolom Nominal */}
                <div className="w-32 hidden md:block">
                  <Skeleton className="h-5 w-24 bg-gray-200 rounded" />
                </div>

                {/* Kolom Status */}
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-16 rounded-full bg-green-50" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-8 w-8 rounded-lg bg-blue-50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-red-50" />
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
