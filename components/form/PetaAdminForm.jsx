import { Save } from "lucide-react";
import React from "react";

const PetaAdminForm = ({
  handleSave,
  handleChange,
  formData,
  setFormData,
  isSaving,
}) => {
  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">
          Nama Lokasi
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          placeholder="Contoh: Balai Desa"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">
          Kategori
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
        >
          <option value="Pemerintahan">Pemerintahan</option>
          <option value="Pendidikan">Pendidikan</option>
          <option value="Ibadah">Ibadah</option>
          <option value="Wisata">Wisata</option>
          <option value="Fasilitas Umum">Fasilitas Umum</option>
          <option value="Kesehatan">Kesehatan</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Latitude
          </label>
          <input
            type="text"
            name="lat"
            value={formData.lat}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600"
            placeholder="-7.xxxx"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Longitude
          </label>
          <input
            type="text"
            name="lng"
            value={formData.lng}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600"
            placeholder="110.xxxx"
          />
        </div>
      </div>

      <div className="pt-2 flex gap-2">
        {formData.id && (
          <button
            type="button"
            onClick={() =>
              setFormData({
                id: null,
                name: "",
                category: "Fasilitas Umum",
                lat: "",
                lng: "",
              })
            }
            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex justify-center items-center gap-2"
        >
          {isSaving ? (
            "Menyimpan..."
          ) : (
            <>
              <Save size={16} /> Simpan
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PetaAdminForm;
