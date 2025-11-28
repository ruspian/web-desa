"use client";

import dynamic from "next/dynamic";

// Import komponen PetaDesa yang asli secara dynamic
const PetaDesa = dynamic(() => import("@/components/PetaDesa"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-3xl flex items-center justify-center text-gray-400">
      Memuat Peta...
    </div>
  ),
});

export default function PetaDesaWrapper({ locations }) {
  return <PetaDesa locations={locations} />;
}
