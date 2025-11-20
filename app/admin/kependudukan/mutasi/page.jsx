"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ArrowRight,
  Baby,
  HeartCrack,
  Truck,
  Home,
  Save,
  X,
} from "lucide-react";

// --- DUMMY DATA MUTASI ---
const initialMutasi = [
  {
    id: 1,
    nama: "Bayi (Anak Bpk. Budi)",
    nik: "-",
    jenis: "Kelahiran",
    tanggal: "2025-11-20",
    ket: "Lahir di Puskesmas, Laki-laki",
    status: "Masuk",
  },
  {
    id: 2,
    nama: "Mbah Surip",
    nik: "3312010101500005",
    jenis: "Kematian",
    tanggal: "2025-11-18",
    ket: "Sakit Tua",
    status: "Keluar",
  },
  {
    id: 3,
    nama: "Rudi Hermawan",
    nik: "33129999999",
    jenis: "Pindah Masuk",
    tanggal: "2025-11-15",
    ket: "Dari Surabaya ke Dusun Krajan",
    status: "Masuk",
  },
  {
    id: 4,
    nama: "Sari Wati",
    nik: "33128888888",
    jenis: "Pindah Keluar",
    tanggal: "2025-11-10",
    ket: "Pindah ikut suami ke Jakarta",
    status: "Keluar",
  },
];

export default function MutasiWargaPage() {
  const [data, setData] = useState(initialMutasi);
  const [filter, setFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    jenis: "Kelahiran",
    tanggal: "",
    ket: "",
  });

  // Filter Logic
  const filteredData = data.filter((item) =>
    filter === "Semua" ? true : item.jenis === filter
  );

  // Statistik Sederhana
  const stats = {
    lahir: data.filter((i) => i.jenis === "Kelahiran").length,
    mati: data.filter((i) => i.jenis === "Kematian").length,
    masuk: data.filter((i) => i.jenis === "Pindah Masuk").length,
    keluar: data.filter((i) => i.jenis === "Pindah Keluar").length,
  };

  // Handle Submit
  const handleSave = (e) => {
    e.preventDefault();
    const status =
      formData.jenis === "Kelahiran" || formData.jenis === "Pindah Masuk"
        ? "Masuk"
        : "Keluar";
    setData([{ ...formData, id: Date.now(), status }, ...data]);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      nama: "",
      nik: "",
      jenis: "Kelahiran",
      tanggal: "",
      ket: "",
    });
  };

  // Helper Warna Badge
  const getBadgeInfo = (jenis) => {
    switch (jenis) {
      case "Kelahiran":
        return { color: "bg-blue-100 text-blue-700", icon: <Baby size={14} /> };
      case "Pindah Masuk":
        return {
          color: "bg-emerald-100 text-emerald-700",
          icon: <Home size={14} />,
        };
      case "Kematian":
        return {
          color: "bg-slate-100 text-slate-600",
          icon: <HeartCrack size={14} />,
        };
      case "Pindah Keluar":
        return {
          color: "bg-orange-100 text-orange-700",
          icon: <Truck size={14} />,
        };
      default:
        return { color: "bg-gray-100", icon: null };
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mutasi Warga</h1>
          <p className="text-gray-500 text-sm">
            Rekapitulasi dinamika penduduk (Lahir, Mati, Pindah, Datang).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
        >
          <Plus size={18} /> Catat Peristiwa
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Kelahiran"
          count={stats.lahir}
          icon={<Baby size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Kematian"
          count={stats.mati}
          icon={<HeartCrack size={24} />}
          color="bg-slate-500"
        />
        <StatCard
          title="Pendatang"
          count={stats.masuk}
          icon={<Home size={24} />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Pindah"
          count={stats.keluar}
          icon={<Truck size={24} />}
          color="bg-orange-500"
        />
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* TABS FILTER */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            "Semua",
            "Kelahiran",
            "Kematian",
            "Pindah Masuk",
            "Pindah Keluar",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
                        ${
                          filter === tab
                            ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }
                    `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Jenis Mutasi</th>
                <th className="px-6 py-4">Nama Warga</th>
                <th className="px-6 py-4">Tanggal Kejadian</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">Arus Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => {
                const badge = getBadgeInfo(item.jenis);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}
                      >
                        {badge.icon} {item.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.nama}
                      <div className="text-xs text-gray-400 font-normal font-mono mt-0.5">
                        {item.nik}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {item.tanggal}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 italic max-w-xs truncate">
                      &quot;{item.ket}&quot;
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "Masuk" ? (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                          + Tambah
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                          - Kurang
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            Belum ada data mutasi untuk kategori ini.
          </div>
        )}
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-scale-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Catat Peristiwa Penting
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label-input">Jenis Peristiwa</label>
                <select
                  className="input-field bg-white"
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis: e.target.value })
                  }
                >
                  <option value="Kelahiran">Kelahiran (Lahir)</option>
                  <option value="Kematian">Kematian (Meninggal)</option>
                  <option value="Pindah Masuk">Pindah Masuk (Pendatang)</option>
                  <option value="Pindah Keluar">Pindah Keluar (Pergi)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-input">Tanggal Kejadian</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label-input">NIK (Jika Ada)</label>
                  <input
                    type="text"
                    className="input-field font-mono"
                    placeholder="3312xxxx"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label-input">Nama Warga</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="Nama Bayi / Almarhum / Warga"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label-input">Keterangan Detail</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  required
                  placeholder="Contoh: Lahir di RSUD, Anak ke-2 dari Bpk. Budi / Pindah ke Jakarta karena kerja"
                  value={formData.ket}
                  onChange={(e) =>
                    setFormData({ ...formData, ket: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-input {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm;
        }
      `}</style>
    </div>
  );
}

// Komponen Stat Card Kecil
function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
      </div>
    </div>
  );
}
