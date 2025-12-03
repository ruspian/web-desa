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
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 bg-white border border-gray-200 rounded-xl" />
          <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* SUMMARY CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-300 rounded" />
              <Skeleton className="h-8 w-32 bg-gray-200 rounded" />
            </div>
            <Skeleton className="w-10 h-10 rounded-lg bg-gray-100" />
          </div>
        ))}

        {/* Card Surplus (Dark) */}
        <div className="bg-slate-900 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-700 rounded" />
            <Skeleton className="h-8 w-32 bg-slate-600 rounded" />
          </div>
          <Skeleton className="w-10 h-10 rounded-lg bg-slate-800" />
        </div>
      </div>

      {/* TABS & TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <div className="flex-1 p-4 flex justify-center border-b-2 border-gray-200">
            <Skeleton className="h-6 w-32 bg-gray-200 rounded" />
          </div>
          <div className="flex-1 p-4 flex justify-center">
            <Skeleton className="h-6 w-32 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Table List */}
        <div className="p-0">
          {/* Header */}
          <div className="bg-slate-50 p-4 flex justify-between border-b border-gray-200">
            <Skeleton className="h-4 w-32 bg-gray-300" />
            <div className="hidden md:flex gap-8">
              <Skeleton className="h-4 w-24 bg-gray-300" />
              <Skeleton className="h-4 w-24 bg-gray-300" />
              <Skeleton className="h-4 w-16 bg-gray-300" />
            </div>
          </div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4 items-center"
            >
              <Skeleton className="h-5 w-48 bg-gray-300 rounded self-start md:self-center" />

              <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end items-center">
                <Skeleton className="h-5 w-24 bg-gray-200 rounded" />
                <Skeleton className="h-5 w-24 bg-gray-200 rounded" />

                {/* Progress Bar */}
                <Skeleton className="h-2 w-16 bg-gray-100 rounded-full hidden md:block" />

                {/* Actions */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg bg-gray-100" />
                  <Skeleton className="h-8 w-8 rounded-lg bg-gray-100" />
                </div>
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
