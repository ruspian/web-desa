import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid gap-8">
          {/* FOTO SKELETON */}
          <div className="lg:col-span-3 space-y-6 w-full">
            <div className="bg-white w-full p-6 rounded-2xl border border-gray-100 shadow-sm">
              <Skeleton className="h-96 w-full mb-4 rounded-md" />
            </div>
          </div>
          {/* CONTENT SKELETON */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <Skeleton className="h-6 w-10 mb-4 rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Loading;
