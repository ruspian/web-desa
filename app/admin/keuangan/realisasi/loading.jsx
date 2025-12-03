"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Loading() {
  const [tinggi] = useState(() => Math.random() * 60 + 20);
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg" />
          <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 bg-white border border-gray-200 rounded-xl" />
          <Skeleton className="h-10 w-40 bg-slate-800 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KIRI: TABEL LIST SKELETON */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full rounded-lg bg-gray-100" />
            <Skeleton className="h-10 w-40 rounded-lg bg-gray-100" />
          </div>

          {/* Transaction Items */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4 bg-gray-300 rounded" />
                    <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="text-right w-full md:w-auto space-y-1">
                  <Skeleton className="h-5 w-24 bg-gray-300 rounded ml-auto" />
                  <Skeleton className="h-3 w-12 bg-gray-200 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KANAN: CHART & STATS SKELETON */}
        <div className="flex flex-col gap-6">
          {/* Chart Skeleton (Simulasi Grafik Batang) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-72 flex flex-col">
            <Skeleton className="h-6 w-32 bg-gray-300 rounded mb-6" />
            <div className="flex items-end justify-between h-full gap-2 px-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full bg-gray-100 rounded-t-sm"
                  style={{ height: `${tinggi}%` }}
                />
              ))}
            </div>
          </div>

          {/* Saldo Kas Skeleton (Dark Card Simulation) */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg h-40 flex flex-col justify-center space-y-3">
            <Skeleton className="h-4 w-24 bg-slate-700 rounded" />
            <Skeleton className="h-10 w-48 bg-slate-600 rounded-lg" />
            <Skeleton className="h-6 w-32 bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
