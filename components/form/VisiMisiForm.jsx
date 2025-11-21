import { Plus, Target, Trash2 } from "lucide-react";
import React from "react";

const VisiMisiForm = ({
  formData,
  addMisi,
  removeMisi,
  handleMisiChange,
  handleChange,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Visi */}
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
        <label className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
          <Target size={18} /> Visi Desa
        </label>
        <textarea
          name="visi"
          value={formData.visi}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-center text-emerald-900 bg-white"
        ></textarea>
        <p className="text-xs text-emerald-600 mt-2 text-center">
          &quot;Gambaran masa depan yang ingin dicapai dalam kurun waktu
          tertentu.&quot;
        </p>
      </div>

      {/* Misi  */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-bold text-gray-700">
            Daftar Misi
          </label>
          <button
            onClick={addMisi}
            className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Tambah Misi
          </button>
        </div>

        <div className="space-y-3">
          {formData.misi.map((item, index) => (
            <div key={index} className="flex gap-3 group">
              <div className="w-8 h-11 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 font-bold text-sm shrink-0">
                {index + 1}
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleMisiChange(index, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Tulis poin misi..."
              />
              <button
                onClick={() => removeMisi(index)}
                className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus poin ini"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {formData.misi.length === 0 && (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Belum ada data misi. Klik tombol tambah di atas.
          </div>
        )}
      </div>
    </div>
  );
};

export default VisiMisiForm;
