import React from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonPengaturan = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
          <Skeleton className="h-6 w-32 rounded-md mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPengaturan;
