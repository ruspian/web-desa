import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2 w-full md:w-auto">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        {/* Tombol Simpan */}
        <Skeleton className="h-11 w-full md:w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* TABS NAVIGATION SKELETON */}
      <div className="flex gap-1 bg-white p-1 rounded-sm border border-gray-200 w-full">
        <Skeleton className="h-10 w-full rounded-lg bg-gray-100" />
        <Skeleton className="h-10 w-full rounded-lg bg-gray-100" />
      </div>

      {/* CONTENT AREA SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        {/* Grid Input  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
            <Skeleton className="h-12 w-full bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
            <Skeleton className="h-12 w-full bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Textarea  */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
          <Skeleton className="h-32 w-full bg-gray-100 rounded-xl" />
        </div>

        {/* Image Upload / Visi Misi Area */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-48 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
