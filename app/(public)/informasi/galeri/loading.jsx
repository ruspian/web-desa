import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-10 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-12 gap-6 animate-pulse"></div>
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <Skeleton className="h-8 w-40 rounded-full bg-orange-100/50" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md bg-gray-200" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md bg-gray-200" />
          <div className="flex text-center justify-center space-y-4 gap-4 pt-10">
            <Skeleton className="h-8 w-20 rounded-full bg-orange-100/50" />
            <Skeleton className="h-8 w-20 rounded-full bg-orange-100/50" />
            <Skeleton className="h-8 w-20 rounded-full bg-orange-100/50" />
          </div>
        </div>
      </div>

      {/* LAYOUT UTAMA */}
      <div className="flex flex-col md:flex-row px-6 gap-6 justify-center items-center pt-10">
        {/* CONTENT SKELETON */}
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-60 w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
};

export default Loading;
