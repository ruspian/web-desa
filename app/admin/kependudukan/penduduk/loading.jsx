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
        <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* FILTER BAR SKELETON */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <Skeleton className="h-10 w-full bg-gray-100 rounded-lg flex-1" />
        {/* Filter Dropdown */}
        <Skeleton className="h-10 w-48 bg-gray-100 rounded-lg" />
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex gap-8 w-full">
            <Skeleton className="h-4 w-32 bg-gray-300" /> {/* NIK/Nama */}
            <Skeleton className="h-4 w-24 bg-gray-300 hidden md:block" />{" "}
            {/* TTL/JK */}
            <Skeleton className="h-4 w-32 bg-gray-300 hidden lg:block" />{" "}
            {/* Alamat */}
            <Skeleton className="h-4 w-20 bg-gray-300 hidden sm:block" />{" "}
            {/* Pekerjaan */}
          </div>
          <Skeleton className="h-4 w-16 bg-gray-300 shrink-0" /> {/* Aksi */}
        </div>

        {/* Table Rows */}
        <div className="p-0 flex-1 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0"
            >
              <div className="flex gap-8 w-full items-center">
                {/* Kolom 1: NIK & Nama */}
                <div className="space-y-1.5 w-48">
                  <Skeleton className="h-5 w-3/4 bg-gray-300 rounded" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>

                {/* Kolom 2: JK & TTL (Hidden Mobile) */}
                <div className="hidden md:block w-32 space-y-1">
                  <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                  <Skeleton className="h-3 w-16 bg-gray-100 rounded" />
                </div>

                {/* Kolom 3: Alamat (Hidden Tablet) */}
                <div className="hidden lg:block w-40 space-y-1">
                  <Skeleton className="h-4 w-full bg-gray-200 rounded" />
                </div>

                {/* Kolom 4: Status (Badge) */}
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-16 rounded-full bg-green-50" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
                <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
                <Skeleton className="h-9 w-9 rounded-lg bg-gray-100" />
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
