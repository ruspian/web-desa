"use client";

import {
  Users,
  Baby,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS_GENDER = ["#3b82f6", "#ec4899"];

export default function PublicDemografiClient({
  dataUsia,
  dataGender,
  dataPekerjaan,
  dataPendidikan,
  stats,
}) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="mb-12">
          <span className="text-green-600 font-bold tracking-wider uppercase text-sm bg-green-100 px-3 py-1 rounded-full">
            Statistik Desa
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-3">
            Data Demografi Penduduk
          </h1>
          <p className="text-gray-500 mt-2 text-lg flex items-center gap-2">
            <Calendar size={18} /> Update terakhir:
            <span className="font-semibold text-gray-700">{currentDate}</span>
          </p>
        </div>

        {/* RINGKASAN UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card Total Penduduk */}
          <div className="bg-linear-to-br from-green-600 to-emerald-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users size={24} className="text-white" />
              </div>
              <span className="font-medium text-green-100">Total Penduduk</span>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {stats.totalPenduduk.toLocaleString()}
            </h3>
            <div className="flex items-center text-sm text-green-200 gap-1">
              <ArrowUpRight size={16} />
              <span>Jiwa</span>
            </div>
          </div>

          {/* Card Kartu Keluarga */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Briefcase size={24} />
              </div>
              <span className="font-medium text-gray-500">Kepala Keluarga</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.totalKK}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Terdaftar resmi di database
            </p>
          </div>

          {/* Card Usia Produktif */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <span className="font-medium text-gray-500">Usia Produktif</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats.usiaProduktif}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Umur 15 - 64 Tahun</p>
          </div>

          {/* Card Balita */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                <Baby size={24} />
              </div>
              <span className="font-medium text-gray-500">Balita</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{stats.balita}</h3>
            <p className="text-sm text-gray-400 mt-1">Usia 0 - 5 Tahun</p>
          </div>
        </div>

        {/* BAGIAN GRAFIK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Piramida Penduduk */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Distribusi Usia Penduduk
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataUsia}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="laki"
                    name="Laki-laki"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                  <Bar
                    dataKey="perempuan"
                    name="Perempuan"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gender Ratio */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2 w-full text-left">
              Rasio Gender
            </h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataGender}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataGender.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_GENDER[index % COLORS_GENDER.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">
                  {stats.totalPenduduk}
                </span>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  Total
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-600 font-medium">Laki-laki</p>
                <p className="text-xl font-bold text-gray-800">
                  {dataGender[0].value}
                </p>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-xl">
                <p className="text-sm text-pink-600 font-medium">Perempuan</p>
                <p className="text-xl font-bold text-gray-800">
                  {dataGender[1].value}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LIST PEKERJAAN & PENDIDIKAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pekerjaan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <Briefcase size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Pekerjaan</h3>
            </div>
            <div className="space-y-6">
              {dataPekerjaan.map((item, idx) => {
                // Hitung persentase
                const percent =
                  stats.totalPenduduk > 0
                    ? (item.count / stats.totalPenduduk) * 100
                    : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="text-gray-500">{item.count} Jiwa</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          item.color || "bg-gray-400"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pendidikan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Tingkat Pendidikan
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {dataPendidikan.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 bg-gray-50 rounded-xl border-l-4 ${
                    item.color || "border-l-gray-400"
                  }`}
                >
                  <p className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              *Data pendidikan diambil berdasarkan ijazah terakhir yang
              dilaporkan warga ke kantor desa.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
