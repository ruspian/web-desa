import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-12 gap-6 animate-pulse">
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <Skeleton className="h-8 w-40 rounded-full bg-orange-100/50" />
            <Skeleton className="h-4 w-full max-w-lg rounded-md bg-gray-200" />
            <Skeleton className="h-12 w-96 rounded-full bg-gray-100" />
            <div className="flex text-center justify-center space-y-4 gap-4">
              <Skeleton className="h-8 w-20 rounded-full bg-orange-100/50" />
              <Skeleton className="h-8 w-20 rounded-full bg-orange-100/50" />
              <Skeleton className="h-8 w-20 rounded-full bg-orange-100/50" />
            </div>
          </div>
        </div>

        {/* LAYOUT UTAMA */}
        <div className="grid gap-8">
          {/* CONTENT SKELETON */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <Skeleton className="h-6 w-48 mb-4 rounded-md" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Loading;
