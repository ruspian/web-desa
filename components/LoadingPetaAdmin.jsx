import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPetaAdmin() {
  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* HEADER SKELETON */}
      <div className="flex justify-between items-center shrink-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* MAP PREVIEW SKELETON */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm h-full min-h-[400px] p-1">
          <Skeleton className="w-full h-full rounded-xl bg-gray-200" />
          {/* Hint Box inside Map */}
          <div className="absolute top-6 right-6">
            <Skeleton className="h-8 w-48 rounded-lg bg-white/50" />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          {/* FORM SKELETON */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded bg-green-100" />
              <Skeleton className="h-6 w-32 bg-gray-300 rounded" />
            </div>

            <div className="space-y-3">
              {/* Input Name */}
              <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
              {/* Select Category */}
              <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
              {/* Coords Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
                <Skeleton className="h-10 w-full bg-gray-100 rounded-lg" />
              </div>
              {/* Button */}
              <Skeleton className="h-10 w-full bg-slate-200 rounded-xl mt-2" />
            </div>
          </div>

          {/* LIST LOKASI SKELETON */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <Skeleton className="h-5 w-24 bg-gray-300 rounded" />
              <Skeleton className="h-3 w-12 bg-gray-200 rounded" />
            </div>

            <div className="p-2 space-y-1 flex-1 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl border border-transparent"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Icon Circle */}
                    <Skeleton className="w-8 h-8 rounded-full bg-blue-50 shrink-0" />
                    <div className="space-y-1.5 w-full">
                      {/* Title */}
                      <Skeleton className="h-4 w-3/4 bg-gray-300 rounded" />
                      {/* Subtitle */}
                      <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="w-8 h-8 rounded-lg bg-gray-100" />
                    <Skeleton className="w-8 h-8 rounded-lg bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
