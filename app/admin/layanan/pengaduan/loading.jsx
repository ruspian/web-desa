import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* STATS CARDS SKELETON (3 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            {/* Icon Box */}
            <Skeleton className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
            <div className="space-y-2">
              {/* Label */}
              <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
              {/* Value */}
              <Skeleton className="h-6 w-16 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        {/* Filter Dropdown */}
        <Skeleton className="h-10 w-40 bg-gray-100 rounded-lg" />
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-350px)]">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-8 w-full">
            <Skeleton className="h-4 w-32 bg-gray-300" /> {/* Tiket */}
            <Skeleton className="h-4 w-24 bg-gray-300 hidden md:block" />{" "}
            {/* Pelapor */}
            <Skeleton className="h-4 w-40 bg-gray-300 hidden md:block" />{" "}
            {/* Kategori */}
            <Skeleton className="h-4 w-24 bg-gray-300 hidden sm:block" />{" "}
            {/* Status */}
          </div>
          <Skeleton className="h-4 w-16 bg-gray-300 shrink-0" /> {/* Aksi */}
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-hidden p-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50/50"
            >
              <div className="flex gap-8 w-full items-center">
                {/* Kolom 1: Tiket & Tanggal */}
                <div className="space-y-1.5 w-32">
                  <Skeleton className="h-5 w-24 bg-gray-300 rounded" />
                  <Skeleton className="h-3 w-20 bg-gray-200 rounded" />
                </div>

                {/* Kolom 2: Pelapor (Hidden Mobile) */}
                <div className="w-32 hidden md:block">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
                    <Skeleton className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Kolom 3: Kategori & Lokasi (Hidden Mobile) */}
                <div className="space-y-1.5 w-48 hidden md:block">
                  <Skeleton className="h-4 w-24 bg-emerald-50 rounded" />
                  <Skeleton className="h-3 w-32 bg-gray-100 rounded" />
                </div>

                {/* Kolom 4: Status Badge */}
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-24 rounded-md bg-blue-50" />
                </div>
              </div>

              {/* Actions (Button) */}
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-8 w-8 rounded-lg bg-blue-50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-red-50" />
              </div>
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
