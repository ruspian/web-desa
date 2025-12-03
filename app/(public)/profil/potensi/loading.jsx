import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* HEADER  */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl w-full space-y-4">
            {/* Badge */}
            <Skeleton className="h-8 w-40 rounded-full bg-purple-100" />
            {/* judul */}
            <Skeleton className="h-12 w-3/4 rounded-xl bg-gray-300" />
            {/* deskripsi */}
            <Skeleton className="h-4 w-full max-w-lg rounded-md bg-gray-200" />
          </div>

          {/* tombol filter Skeleton */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-10 w-28 rounded-full bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* GRID CONTENT SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col"
            >
              {/* gambar */}
              <Skeleton className="h-64 w-full bg-gray-200" />

              {/* Content */}
              <div className="p-6 flex flex-col grow space-y-4">
                <div className="space-y-2">
                  {/* judul */}
                  <Skeleton className="h-7 w-3/4 rounded-md bg-gray-300" />
                  {/* lokasi */}
                  <Skeleton className="h-4 w-1/2 rounded-md bg-gray-100" />
                </div>

                {/* Deskripsi */}
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-4 w-full bg-gray-100" />
                  <Skeleton className="h-4 w-full bg-gray-100" />
                  <Skeleton className="h-4 w-2/3 bg-gray-100" />
                </div>

                {/* tombol */}
                <div className="pt-4 mt-auto">
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION SKELETON */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
          <Skeleton className="h-12 w-48 rounded-xl bg-white border border-gray-100" />
          <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
        </div>

        {/* CALL TO ACTION SKELETON */}
        <div className="mt-24 rounded-3xl p-12 bg-green-50 flex flex-col items-center gap-6 border border-green-100">
          <Skeleton className="h-8 w-2/3 max-w-md bg-green-200" />
          <Skeleton className="h-4 w-full max-w-xl bg-green-100" />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Skeleton className="h-14 w-48 rounded-xl bg-white" />
            <Skeleton className="h-14 w-48 rounded-xl bg-green-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
