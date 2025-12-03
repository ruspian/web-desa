"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const [tinggi] = useState(() => Math.random() * 60 + 20);
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="mb-12 space-y-4">
          <Skeleton className="h-8 w-32 rounded-full bg-green-100" />
          <Skeleton className="h-12 w-3/4 md:w-1/2 bg-gray-300 rounded-xl" />
          <Skeleton className="h-6 w-64 bg-gray-200 rounded-md" />
        </div>

        {/* RINGKASAN UTAMA SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <Skeleton className="h-10 w-20 bg-gray-300 rounded-lg" />
              <Skeleton className="h-4 w-full bg-gray-100 rounded-md" />
            </div>
          ))}
        </div>

        {/* GRAFIK SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Bar Chart Skeleton */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <Skeleton className="h-8 w-64 bg-gray-200 rounded-lg" />

            {/* Simulasi Bar Chart */}
            <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 border-b border-l border-gray-100">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full flex gap-1 items-end justify-center h-full"
                >
                  <Skeleton
                    className="w-1/3 rounded-t-sm bg-gray-200"
                    style={{ height: `${tinggi}%` }}
                  />
                  <Skeleton
                    className="w-1/3 rounded-t-sm bg-gray-300"
                    style={{ height: `${tinggi}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart Skeleton */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
            <Skeleton className="h-8 w-40 bg-gray-200 rounded-lg self-start mb-8" />

            {/* Simulasi Donut */}
            <div className="relative">
              <Skeleton className="h-56 w-56 rounded-full bg-gray-100" />
              <div className="absolute inset-0 m-auto h-32 w-32 bg-white rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <Skeleton className="h-20 w-full rounded-xl bg-gray-50" />
              <Skeleton className="h-20 w-full rounded-xl bg-gray-50" />
            </div>
          </div>
        </div>

        {/* 3. LIST SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pekerjaan Skeleton */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-lg bg-green-100" />
              <Skeleton className="h-8 w-48 bg-gray-200 rounded-lg" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                  <Skeleton className="h-4 w-12 bg-gray-200 rounded" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full bg-gray-100" />
              </div>
            ))}
          </div>

          {/* Pendidikan Skeleton */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-lg bg-yellow-100" />
              <Skeleton className="h-8 w-48 bg-gray-200 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-xl bg-gray-50 border-l-4 border-gray-200"
                />
              ))}
            </div>
            <Skeleton className="h-4 w-3/4 bg-gray-100 mt-4 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
