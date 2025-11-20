"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileDown,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Save,
} from "lucide-react";

// --- DUMMY DATA PENDUDUK ---
const initialData = [
  {
    id: 1,
    nik: "3312010101900001",
    nama: "Budi Santoso",
    jk: "L",
    tglLahir: "1990-01-01",
    agama: "Islam",
    pendidikan: "S1",
    pekerjaan: "Wiraswasta",
    dusun: "Krajan",
    rt: "01",
    rw: "01",
    status: "Hidup",
  },
  {
    id: 2,
    nik: "3312010505950002",
    nama: "Siti Aminah",
    jk: "P",
    tglLahir: "1995-05-05",
    agama: "Islam",
    pendidikan: "D3",
    pekerjaan: "Bidan",
    dusun: "Krajan",
    rt: "02",
    rw: "01",
    status: "Hidup",
  },
  {
    id: 3,
    nik: "3312011010800003",
    nama: "Joko Susilo",
    jk: "L",
    tglLahir: "1980-10-10",
    agama: "Kristen",
    pendidikan: "SMA",
    pekerjaan: "Petani",
    dusun: "Sukamaju",
    rt: "01",
    rw: "02",
    status: "Hidup",
  },
  {
    id: 4,
    nik: "3312011212000004",
    nama: "Dewi Sartika",
    jk: "P",
    tglLahir: "2000-12-12",
    agama: "Islam",
    pendidikan: "SMA",
    pekerjaan: "Mahasiswa",
    dusun: "Sukamaju",
    rt: "02",
    rw: "02",
    status: "Hidup",
  },
  {
    id: 5,
    nik: "3312010101500005",
    nama: "Mbah Surip",
    jk: "L",
    tglLahir: "1950-01-01",
    agama: "Islam",
    pendidikan: "SD",
    pekerjaan: "Petani",
    dusun: "Sumber",
    rt: "01",
    rw: "03",
    status: "Meninggal",
  },
];

export default function DataPendudukPage() {
  const [penduduk, setPenduduk] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterDusun, setFilterDusun] = useState("Semua");

  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nik: "",
    nama: "",
    jk: "L",
    tglLahir: "",
    agama: "Islam",
    pendidikan: "",
    pekerjaan: "",
    dusun: "Krajan",
    rt: "",
    rw: "",
    status: "Hidup",
  });

  // Filter Logic
  const filteredData = penduduk.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search);
    const matchDusun = filterDusun === "Semua" || item.dusun === filterDusun;
    return matchSearch && matchDusun;
  });

  // --- CRUD HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (data = null) => {
    if (data) {
      setFormData(data);
    } else {
      // Reset form untuk data baru
      setFormData({
        id: null,
        nik: "",
        nama: "",
        jk: "L",
        tglLahir: "",
        agama: "Islam",
        pendidikan: "",
        pekerjaan: "",
        dusun: "Krajan",
        rt: "",
        rw: "",
        status: "Hidup",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update Data
      setPenduduk(penduduk.map((p) => (p.id === formData.id ? formData : p)));
    } else {
      // Create Data Baru
      setPenduduk([...penduduk, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (
      confirm(
        "Yakin hapus data penduduk ini? Data yang dihapus tidak bisa dikembalikan."
      )
    ) {
      setPenduduk(penduduk.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Penduduk</h1>
          <p className="text-gray-500 text-sm">
            Master database kependudukan Desa Makmur Jaya.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <FileDown size={18} /> Export Excel
          </button>
          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-colors"
          >
            <UserPlus size={18} /> Tambah Warga
          </button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari Nama atau NIK..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2.5 rounded-lg text-gray-500">
            <Filter size={20} />
          </div>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[180px] cursor-pointer"
            value={filterDusun}
            onChange={(e) => setFilterDusun(e.target.value)}
          >
            <option value="Semua">Semua Dusun</option>
            <option value="Krajan">Dusun Krajan</option>
            <option value="Sukamaju">Dusun Sukamaju</option>
            <option value="Sumber">Dusun Sumber</option>
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-300px)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200">
                  NIK & Nama
                </th>
                <th className="px-6 py-4 border-b border-gray-200">L/P</th>
                <th className="px-6 py-4 border-b border-gray-200">TTL</th>
                <th className="px-6 py-4 border-b border-gray-200">Alamat</th>
                <th className="px-6 py-4 border-b border-gray-200">
                  Pekerjaan
                </th>
                <th className="px-6 py-4 border-b border-gray-200">Status</th>
                <th className="px-6 py-4 border-b border-gray-200 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-3">
                    <div className="font-bold text-gray-800">{item.nama}</div>
                    <div className="text-xs text-gray-500 font-mono tracking-wide">
                      {item.nik}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        item.jk === "L"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-pink-100 text-pink-600"
                      }`}
                    >
                      {item.jk}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.tglLahir}</td>
                  <td className="px-6 py-3">
                    <span className="block text-gray-800 font-medium">
                      {item.dusun}
                    </span>
                    <span className="text-xs text-gray-400">
                      RT {item.rt} / RW {item.rw}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.pekerjaan}</td>
                  <td className="px-6 py-3">
                    {item.status === "Hidup" && (
                      <span className="badge-green">Hidup</span>
                    )}
                    {item.status === "Pindah" && (
                      <span className="badge-yellow">Pindah</span>
                    )}
                    {item.status === "Meninggal" && (
                      <span className="badge-red">Meninggal</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(item)}
                        className="action-btn text-blue-600 bg-blue-50 hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="action-btn text-red-600 bg-red-50 hover:bg-red-100"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
              <Search size={48} className="opacity-20 mb-4" />
              <p>Data tidak ditemukan.</p>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm bg-white">
          <span className="text-gray-500">
            Menampilkan <strong>{filteredData.length}</strong> dari{" "}
            <strong>{penduduk.length}</strong> warga
          </span>
          <div className="flex gap-2">
            <button
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* === MODAL FORM (ADD/EDIT) === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit Data Penduduk" : "Tambah Warga Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <form
                id="formPenduduk"
                onSubmit={handleSave}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* GROUP: IDENTITAS */}
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">
                    Identitas Pribadi
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Sesuai KTP"
                  />
                </div>

                <div>
                  <label className="label-text">NIK</label>
                  <input
                    type="text"
                    name="nik"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleChange}
                    className="input-field font-mono"
                    placeholder="16 Digit"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Jenis Kelamin</label>
                    <select
                      name="jk"
                      value={formData.jk}
                      onChange={handleChange}
                      className="input-field bg-white"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Tgl Lahir</label>
                    <input
                      type="date"
                      name="tglLahir"
                      value={formData.tglLahir}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text">Agama</label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    className="input-field bg-white"
                  >
                    <option>Islam</option>
                    <option>Kristen</option>
                    <option>Katolik</option>
                    <option>Hindu</option>
                    <option>Buddha</option>
                    <option>Konghucu</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Pendidikan</label>
                  <select
                    name="pendidikan"
                    value={formData.pendidikan}
                    onChange={handleChange}
                    className="input-field bg-white"
                  >
                    <option value="">Pilih...</option>
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA">SMA / SMK</option>
                    <option value="S1">Sarjana (S1)</option>
                  </select>
                </div>

                {/* GROUP: ALAMAT & STATUS */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">
                    Domisili & Status
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Pekerjaan</label>
                  <input
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Contoh: Petani"
                  />
                </div>

                <div>
                  <label className="label-text">Dusun</label>
                  <select
                    name="dusun"
                    value={formData.dusun}
                    onChange={handleChange}
                    className="input-field bg-white"
                  >
                    <option value="Krajan">Dusun Krajan</option>
                    <option value="Sukamaju">Dusun Sukamaju</option>
                    <option value="Sumber">Dusun Sumber</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">RT</label>
                    <input
                      type="text"
                      name="rt"
                      value={formData.rt}
                      onChange={handleChange}
                      className="input-field text-center"
                      placeholder="000"
                    />
                  </div>
                  <div>
                    <label className="label-text">RW</label>
                    <input
                      type="text"
                      name="rw"
                      value={formData.rw}
                      onChange={handleChange}
                      className="input-field text-center"
                      placeholder="000"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label-text">Status Penduduk</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field bg-white"
                  >
                    <option value="Hidup">Hidup (Menetap)</option>
                    <option value="Pindah">Pindah Keluar</option>
                    <option value="Meninggal">Meninggal Dunia</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="formPenduduk"
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-colors"
              >
                <Save size={18} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-text {
          @apply block text-xs font-bold text-gray-500 uppercase mb-1.5;
        }
        .input-field {
          @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-800;
        }
        .badge-green {
          @apply text-emerald-700 font-bold text-[10px] uppercase bg-emerald-100 px-2 py-1 rounded-md;
        }
        .badge-yellow {
          @apply text-yellow-700 font-bold text-[10px] uppercase bg-yellow-100 px-2 py-1 rounded-md;
        }
        .badge-red {
          @apply text-red-700 font-bold text-[10px] uppercase bg-red-100 px-2 py-1 rounded-md;
        }
        .action-btn {
          @apply p-2 rounded-lg transition-colors flex items-center justify-center;
        }
      `}</style>
    </div>
  );
}
