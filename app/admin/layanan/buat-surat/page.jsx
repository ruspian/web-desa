"use client";

import { useState } from "react";
import {
  Search,
  UserCheck,
  FileText,
  Printer,
  Save,
  X,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

// --- DUMMY DATABASE PENDUDUK ---
const residentDatabase = [
  {
    nik: "3312010101900001",
    nama: "Budi Santoso",
    jk: "L",
    alamat: "Dusun Krajan RT 01/RW 01",
    pekerjaan: "Wiraswasta",
  },
  {
    nik: "3312010505950002",
    nama: "Siti Aminah",
    jk: "P",
    alamat: "Dusun Krajan RT 02/RW 01",
    pekerjaan: "Bidan",
  },
  {
    nik: "3312011010800003",
    nama: "Joko Susilo",
    jk: "L",
    alamat: "Dusun Sukamaju RT 01/RW 02",
    pekerjaan: "Petani",
  },
];

// Jenis Surat
const letterTypes = [
  "Surat Keterangan Tidak Mampu (SKTM)",
  "Surat Keterangan Usaha (SKU)",
  "Surat Pengantar SKCK",
  "Surat Keterangan Domisili",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Surat Keterangan Belum Menikah",
  "Surat Izin Keramaian",
];

export default function BuatSuratPage() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [formData, setFormData] = useState({
    jenisSurat: "",
    keperluan: "",
    nomorSurat: "470 / ... / ... / 2025", // Format nomor surat desa
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Logic Cari Warga
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 2) {
      const results = residentDatabase.filter(
        (r) =>
          r.nama.toLowerCase().includes(query.toLowerCase()) ||
          r.nik.includes(query)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // 2. Pilih Warga
  const selectResident = (resident) => {
    setSelectedResident(resident);
    setSearch("");
    setSearchResults([]);
  };

  // 3. Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi Save ke Database
    setTimeout(() => {
      setIsSuccess(true);
    }, 1000);
  };

  const resetForm = () => {
    setSelectedResident(null);
    setFormData({
      jenisSurat: "",
      keperluan: "",
      nomorSurat: "470 / ... / ... / 2025",
    });
    setIsSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Buat Surat Baru</h1>
        <p className="text-gray-500 text-sm">
          Layanan pembuatan surat untuk warga yang datang langsung (Offline).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: PENCARIAN DATA WARGA */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Cari Data Pemohon
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Ketik NIK atau Nama..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={search}
                onChange={handleSearch}
                disabled={selectedResident !== null} // Disable kalau udah milih
              />
              {selectedResident && (
                <button
                  onClick={() => setSelectedResident(null)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                {searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectResident(res)}
                    className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <p className="font-bold text-gray-800 text-sm">
                      {res.nama}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{res.nik}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resident Card Preview */}
          {selectedResident ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Data Terverifikasi
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Database Kependudukan
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Nama Lengkap</p>
                  <p className="font-bold text-gray-800">
                    {selectedResident.nama}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIK</p>
                  <p className="font-mono text-gray-700">
                    {selectedResident.nik}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Alamat</p>
                  <p className="text-gray-700">{selectedResident.alamat}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pekerjaan</p>
                  <p className="text-gray-700">{selectedResident.pekerjaan}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <AlertCircle className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm">
                Silakan cari dan pilih warga terlebih dahulu untuk melanjutkan.
              </p>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: FORM SURAT */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
            {/* Overlay kalau belum pilih warga */}
            {!selectedResident && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 text-gray-500">
                  <ChevronRight className="animate-pulse" /> Pilih warga di
                  sebelah kiri
                </div>
              </div>
            )}

            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Detail Surat
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Jenis Surat
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.jenisSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, jenisSurat: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Pilih Jenis Surat --</option>
                    {letterTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    value={formData.nomorSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Keperluan / Keterangan
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Contoh: Untuk persyaratan melamar pekerjaan..."
                  value={formData.keperluan}
                  onChange={(e) =>
                    setFormData({ ...formData, keperluan: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Save size={18} /> Buat Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* === MODAL SUKSES / CETAK === */}
      {isSuccess && selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Printer size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Surat Siap Dicetak!
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Surat <strong>{formData.jenisSurat}</strong> atas nama{" "}
              <strong>{selectedResident.nama}</strong> telah berhasil dibuat.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => alert("Membuka jendela print...")}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Cetak Sekarang (PDF)
              </button>
              <button
                onClick={resetForm}
                className="w-full py-3 text-gray-500 font-bold hover:text-gray-800"
              >
                Tutup & Buat Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
