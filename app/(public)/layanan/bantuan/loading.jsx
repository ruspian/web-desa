import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SKELETON */}
        <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center gap-4">
          {/* Badge */}
          <Skeleton className="h-8 w-40 rounded-full bg-blue-100" />
          {/* judul */}
          <Skeleton className="h-12 w-3/4 bg-gray-300 rounded-xl" />
          {/* deskripsi */}
          <div className="w-full flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-full max-w-lg bg-gray-200 rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-lg bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* BOX PENCARIAN SKELETON */}
        <div className="max-w-xl mx-auto relative z-10 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div className="space-y-3">
              {/* Label */}
              <Skeleton className="h-4 w-48 bg-gray-200 rounded" />
              {/* Input */}
              <Skeleton className="h-14 w-full bg-gray-100 rounded-xl" />
              <Skeleton className="h-3 w-64 bg-gray-100 rounded" />
            </div>
            {/* tombol */}
            <Skeleton className="h-14 w-full bg-blue-600/20 rounded-xl" />
          </div>
        </div>

        {/* INFO JENIS BANTUAN SKELETON  */}
        <div className="max-w-4xl mx-auto mt-20">
          <Skeleton className="h-8 w-48 bg-gray-300 rounded-lg mx-auto mb-8" />

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
              >
                <Skeleton className="w-12 h-12 rounded-xl bg-gray-200" />
                <Skeleton className="h-6 w-32 bg-gray-300 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full bg-gray-100" />
                  <Skeleton className="h-3 w-full bg-gray-100" />
                  <Skeleton className="h-3 w-2/3 bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
