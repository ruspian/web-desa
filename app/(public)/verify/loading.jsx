import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen pt-24 bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      {/* CONTAINER CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
        {/* Top Decoration Skeleton */}
        <Skeleton className="h-3 w-full bg-gray-300" />

        <div className="p-8">
          {/* LOGO & HEADER SKELETON */}
          <div className="text-center mb-8 flex flex-col items-center">
            {/* Logo Circle */}
            <Skeleton className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
            {/* Subtitle */}
            <Skeleton className="h-4 w-40 bg-gray-200 mb-2 rounded" />
          </div>

          {/* STATUS VALIDASI SKELETON */}
          <div className="text-center mb-8">
            <div className="border border-gray-100 rounded-2xl p-6 flex flex-col items-center">
              {/* Icon Circle */}
              <Skeleton className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
              {/* Status Text BIG */}
              <Skeleton className="h-8 w-48 bg-gray-300 rounded-md mb-2" />
              {/* Desc Text */}
              <Skeleton className="h-4 w-32 bg-gray-100 rounded" />
              {/* ID Text */}
              <Skeleton className="h-3 w-20 bg-gray-100 mt-2 rounded" />
            </div>
          </div>

          {/* DETAIL INFORMASI SKELETON */}
          <div className="space-y-5 border-t border-gray-100 pt-6">
            {/* Loop 3 baris untuk Jenis, Pemilik, Tanggal */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Icon Box */}
                <Skeleton className="w-10 h-10 rounded-lg bg-blue-50 shrink-0" />
                <div className="space-y-2 flex-1">
                  {/* Label */}
                  <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
                  {/* Value Utama */}
                  <Skeleton className="h-5 w-3/4 bg-gray-300 rounded" />
                  {/* Sub Value (No/NIK) */}
                  <Skeleton className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}

            {/* Keperluan Box Skeleton */}
            <div className="pt-2">
              <Skeleton className="h-14 w-full rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>

        {/* FOOTER SKELETON */}
        <div className="p-4 bg-gray-50 text-center border-t border-gray-100 flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-32 bg-blue-100 rounded" />
          <Skeleton className="h-3 w-48 bg-gray-200 rounded" />
        </div>
      </div>
    </main>
  );
}
