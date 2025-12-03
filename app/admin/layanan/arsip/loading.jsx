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
        {/* Search */}
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        {/* Date Picker */}
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
        {/* Dropdown Status */}
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-6 w-full">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-4 w-32 bg-gray-300 hidden md:block" />
            <Skeleton className="h-4 w-32 bg-gray-300 hidden md:block" />
            <Skeleton className="h-4 w-20 bg-gray-300 hidden sm:block" />
          </div>
          <Skeleton className="h-4 w-10 bg-gray-300 shrink-0" />
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-hidden p-0">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50/50"
            >
              <div className="flex gap-6 w-full items-center">
                {/* No Surat */}
                <Skeleton className="h-3 w-24 bg-gray-200 rounded" />

                {/* Tanggal */}
                <Skeleton className="h-3 w-20 bg-gray-200 rounded" />

                {/* Pemohon (Hidden Mobile) */}
                <div className="w-32 hidden md:block space-y-1">
                  <Skeleton className="h-4 w-full bg-gray-300 rounded" />
                  <Skeleton className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>

                {/* Jenis Surat */}
                <div className="w-32 hidden md:block">
                  <Skeleton className="h-4 w-full bg-gray-200 rounded" />
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-20 rounded-full bg-green-50" />
                </div>
              </div>

              {/* Actions (Eye Icon) */}
              <Skeleton className="h-8 w-8 rounded-lg bg-blue-50 shrink-0" />
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
