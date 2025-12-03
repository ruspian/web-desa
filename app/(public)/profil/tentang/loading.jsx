import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* HEADER SECTION SKELETON */}
      <section className="bg-green-50 py-16 border-b border-green-100">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4">
          <Skeleton className="h-6 w-32 rounded-full bg-green-200/50" />
          <Skeleton className="h-12 w-3/4 md:w-1/2 bg-gray-300 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-md bg-gray-200" />
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-24">
        {/* VISI & MISI SKELETON */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* FOTO */}
          <Skeleton className="h-[500px] w-full rounded-4xl bg-gray-200" />

          {/* Visi */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-40 rounded-full bg-blue-100" />
            <Skeleton className="h-10 w-full bg-gray-300 rounded-lg" />

            {/* Misi */}
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl"
                >
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEJARAH DESA SKELETON */}
        <section className="grid  gap-16 items-start">
          {/* Text */}
          <div className="order-2 md:order-1 space-y-6">
            <Skeleton className="h-8 w-48 rounded-full bg-orange-100" />
            <Skeleton className="h-10 w-3/4 bg-gray-300 rounded-lg" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </section>

        {/* GEOGRAFIS SKELETON */}
        <section className="rounded-[2.5rem] p-8 md:p-12 bg-slate-900/10 animate-pulse relative overflow-hidden h-[500px]">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
            <div className="w-full lg:w-1/3 space-y-6">
              <Skeleton className="h-8 w-32 rounded-full bg-slate-300" />
              <Skeleton className="h-10 w-3/4 bg-slate-400 rounded-lg" />
              <Skeleton className="h-24 w-full bg-slate-300 rounded-lg" />
              <Skeleton className="h-12 w-40 rounded-xl bg-green-600/20" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-40 rounded-3xl bg-slate-300/50"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
