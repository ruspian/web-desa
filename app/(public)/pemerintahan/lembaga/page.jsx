"use client";

import Image from "next/image";
import {
  Users,
  Gavel,
  Heart,
  Shield,
  Zap,
  ArrowRight,
  UserCircle,
} from "lucide-react";

// --- DUMMY DATA ---
const institutions = [
  {
    id: "bpd",
    abbr: "BPD",
    name: "Badan Permusyawaratan Desa",
    desc: "Lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa. Berfungsi menetapkan Peraturan Desa bersama Kepala Desa dan menampung aspirasi masyarakat.",
    leader: "Bpk. Sutrisno, S.Pd",
    members: 9,
    icon: Gavel,
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "lpm",
    abbr: "LPM",
    name: "Lembaga Pemberdayaan Masyarakat",
    desc: "Wadah partisipasi masyarakat dalam pembangunan yang memadukan aspirasi masyarakat dengan rencana pembangunan pemerintah desa.",
    leader: "Ibu Hartini",
    members: 12,
    icon: Users,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    id: "pkk",
    abbr: "PKK",
    name: "Pemberdayaan Kesejahteraan Keluarga",
    desc: "Gerakan nasional dalam pembangunan masyarakat yang tumbuh dari bawah pengelolaannya dari, oleh dan untuk masyarakat.",
    leader: "Ibu Siti Aminah",
    members: 25,
    icon: Heart,
    color: "bg-pink-500",
    lightColor: "bg-pink-50",
    textColor: "text-pink-600",
  },
  {
    id: "kt",
    abbr: "KT",
    name: "Karang Taruna Tunas Bangsa",
    desc: "Organisasi sosial kemasyarakatan sebagai wadah dan sarana pengembangan setiap anggota masyarakat yang tumbuh dan berkembang atas dasar kesadaran dan tanggung jawab sosial.",
    leader: "Mas Dimas Anggara",
    members: 40,
    icon: Zap,
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    id: "linmas",
    abbr: "LINMAS",
    name: "Perlindungan Masyarakat",
    desc: "Satuan perlindungan masyarakat desa yang bertugas membantu menjaga keamanan, ketentraman dan ketertiban masyarakat.",
    leader: "Bpk. Joko Kuat",
    members: 15,
    icon: Shield,
    color: "bg-green-600",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
  },
];

export default function LembagaPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <Users size={16} />
              Mitra Desa
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Lembaga Kemasyarakatan
            </h1>
            <p className="text-gray-500 text-lg">
              Sinergi antara Pemerintah Desa dengan berbagai lembaga mitra untuk
              mewujudkan pembangunan yang partisipatif dan inklusif.
            </p>
          </div>

          {/* Statistik Singkat (Optional) */}
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[100px]">
              <span className="block text-3xl font-bold text-gray-800">5</span>
              <span className="text-xs text-gray-500 font-medium uppercase">
                Lembaga
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[100px]">
              <span className="block text-3xl font-bold text-gray-800">
                100+
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase">
                Anggota
              </span>
            </div>
          </div>
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {institutions.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative Background Icon (Big & Faded) */}
              <item.icon
                className={`absolute -right-6 -bottom-6 w-48 h-48 opacity-5 group-hover:scale-110 transition-transform duration-500 ${item.textColor}`}
              />

              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                {/* Icon Box (Logo Replacement) */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${item.color}`}
                >
                  <span className="font-bold text-xl tracking-wider">
                    {item.abbr}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                    {item.desc}
                  </p>

                  {/* Info Bar */}
                  <div
                    className={`flex items-center gap-4 p-4 rounded-xl ${item.lightColor}`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle size={18} className={item.textColor} />
                      <div>
                        <p className="text-xs text-gray-500">Ketua</p>
                        <p className="text-sm font-bold text-gray-800">
                          {item.leader}
                        </p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-300/50"></div>
                    <div className="flex items-center gap-2">
                      <Users size={18} className={item.textColor} />
                      <div>
                        <p className="text-xs text-gray-500">Anggota</p>
                        <p className="text-sm font-bold text-gray-800">
                          {item.members} Orang
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION: Babinsa & Bhabinkamtibmas (Mitra Keamanan) */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Shield className="text-gray-900" /> Mitra Keamanan & Ketertiban
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Polisi */}
            <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex items-center gap-6 shadow-lg">
              <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-500 relative">
                <Image
                  src="https://images.unsplash.com/photo-1541535650813-7f06d0e1b54e?w=400&q=80"
                  alt="Polisi"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">
                  POLRI
                </span>
                <h3 className="text-xl font-bold">Aipda Budi Gunawan</h3>
                <p className="text-gray-400 text-sm">Bhabinkamtibmas</p>
                <p className="text-gray-500 text-xs mt-1">Polsek Sukamaju</p>
              </div>
            </div>

            {/* Card TNI */}
            <div className="bg-linear-to-r from-green-800 to-emerald-900 rounded-2xl p-6 text-white flex items-center gap-6 shadow-lg">
              <div className="w-20 h-20 bg-green-700 rounded-full overflow-hidden border-2 border-green-600 relative">
                <Image
                  src="https://images.unsplash.com/photo-1595835018376-02c42986686b?w=400&q=80"
                  alt="TNI"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">
                  TNI AD
                </span>
                <h3 className="text-xl font-bold">Serda Joko Widodo</h3>
                <p className="text-green-200 text-sm">Babinsa</p>
                <p className="text-green-300/60 text-xs mt-1">
                  Koramil 01 Wonogiri
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
