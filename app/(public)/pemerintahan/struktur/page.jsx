"use client";

import Image from "next/image";
import {
  Phone,
  Mail,
  Shield,
  Users,
  UserCheck,
  FolderOpen,
} from "lucide-react";

// --- DUMMY DATA (Urutan hierarki penting) ---
const kepalaDesa = {
  name: "H. Budi Santoso, S.IP",
  role: "Kepala Desa",
  nip: "19750101 200001 1 001",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
  phone: "+62 812-3456-7890",
};

const sekretaris = {
  name: "Siti Aminah, S.Kom",
  role: "Sekretaris Desa",
  nip: "19800505 201001 2 005",
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  phone: "+62 812-9876-5432",
};

const kaurKasi = [
  {
    name: "Ahmad Fauzi",
    role: "Kaur Keuangan",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
  },
  {
    name: "Dewi Sartika",
    role: "Kasi Pemerintahan",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
  },
  {
    name: "Rudi Hermawan",
    role: "Kasi Kesejahteraan",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
  },
  {
    name: "Bambang Pamungkas",
    role: "Kaur Umum",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
];

const kadus = [
  { name: "Supriyadi", role: "Kadus I", area: "Dusun Krajan" },
  { name: "Joko Susilo", role: "Kadus II", area: "Dusun Sukamaju" },
  { name: "Wahyudi", role: "Kadus III", area: "Dusun Sumber" },
];

// Komponen Card Perangkat (Re-usable)
const OfficialCard = ({ data, isLeader = false }) => (
  <div
    className={`relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300 ${
      isLeader ? "w-full max-w-sm mx-auto ring-4 ring-green-500/20" : "w-full"
    }`}
  >
    {/* Image Container */}
    <div
      className={`relative ${
        isLeader ? "h-80" : "h-64"
      } bg-gray-100 overflow-hidden`}
    >
      {data.image ? (
        <Image
          src={data.image}
          alt={data.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-200">
          <UserCheck size={48} />
        </div>
      )}
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
    </div>

    {/* Content */}
    <div className="p-5 text-center relative -mt-12">
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-50">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
            isLeader
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {data.role}
        </span>
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
          {data.name}
        </h3>
        {data.nip && (
          <p className="text-xs text-gray-400 font-mono">NIP. {data.nip}</p>
        )}
        {data.area && (
          <p className="text-xs text-blue-500 font-medium mt-1">{data.area}</p>
        )}

        {/* Tombol Kontak (Hidden by default, show on hover/click) */}
        <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
            title="Telepon / WA"
          >
            <Phone size={16} />
          </button>
          <button
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
            title="Email"
          >
            <Mail size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function StrukturPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Users size={16} />
            Pemerintahan Desa
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-gray-500 text-lg">
            Mengenal lebih dekat para perangkat desa yang siap melayani
            kebutuhan administrasi dan pembangunan Desa Makmur Jaya.
          </p>
        </div>

        {/* === BAGAN STRUKTUR (Tree Layout) === */}
        <div className="relative max-w-5xl mx-auto">
          {/* LEVEL 1: KEPALA DESA */}
          <div className="flex justify-center mb-12 relative z-10">
            <OfficialCard data={kepalaDesa} isLeader={true} />
          </div>

          {/* Connector Vertical (Garis dr Kades ke Sekdes) */}
          <div className="absolute top-80 left-1/2 -translate-x-1/2 h-16 w-0.5 bg-gray-300 z-0 hidden md:block"></div>

          {/* LEVEL 2: SEKRETARIS DESA */}
          <div className="flex justify-center mb-16 relative z-10">
            <div className="w-full max-w-xs">
              <OfficialCard data={sekretaris} />
            </div>
          </div>

          {/* Connector Horizontal (Garis Cabang ke Bawah) */}
          <div className="hidden md:block absolute top-[650px] left-[10%] right-[10%] h-12 border-t-2 border-l-2 border-r-2 border-gray-300 rounded-t-3xl z-0"></div>
          <div className="hidden md:block absolute top-[630px] left-1/2 -translate-x-1/2 h-20 w-0.5 bg-gray-300 z-0"></div>

          {/* LEVEL 3: KAUR & KASI (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative z-10">
            {kaurKasi.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Connector Kecil di atas card (Desktop Only) */}
                <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gray-300"></div>
                <OfficialCard data={item} />
              </div>
            ))}
          </div>

          {/* SECTION: KEPALA DUSUN (Terpisah) */}
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <FolderOpen size={16} /> Kepala Kewilayahan (Dusun)
              </span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kadus.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      {item.role}
                    </p>
                    <p className="text-sm text-green-600">{item.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
