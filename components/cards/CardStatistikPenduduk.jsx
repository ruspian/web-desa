import { Users } from "lucide-react";
import React from "react";

const CardStatistikPenduduk = ({
  persenLaki,
  totalLaki,
  totalPerempuan,
  totalPenduduk,
}) => {
  return (
    <>
      <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <span className="text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
            Update Realtime
          </span>
        </div>
        <h3 className="text-5xl font-bold text-gray-900 mb-2">
          {totalPenduduk.toLocaleString()}
        </h3>
        <p className="text-gray-500 font-medium">Jiwa Penduduk Tercatat</p>

        {/* Progress Bar Gender */}
        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-blue-600">{persenLaki}% Laki-laki</span>
            <span className="text-pink-500">{100 - persenLaki}% Perempuan</span>
          </div>
          <div className="h-3 w-full bg-pink-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${persenLaki}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{totalLaki} Jiwa</span>
            <span>{totalPerempuan} Jiwa</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardStatistikPenduduk;
