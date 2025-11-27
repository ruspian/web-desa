import { TrendingUp } from "lucide-react";
import React from "react";

const CardStattistikApbdesPublic = ({ persenApbdes, currentYear }) => {
  return (
    <>
      <div className="md:col-span-1 bg-linear-to-br from-emerald-900 to-emerald-800 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div>
          <TrendingUp className="mb-4 text-emerald-300" size={32} />
          <h4 className="text-lg font-medium text-emerald-100 mb-1">
            Realisasi APBDes {currentYear}
          </h4>
          <p className="text-4xl font-bold">{persenApbdes}%</p>
        </div>
        <div>
          <p className="text-sm text-emerald-200/80 mt-4 mb-2">
            Serapan Anggaran
          </p>
          <div className="w-full bg-emerald-900/50 rounded-full h-1.5">
            <div
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${persenApbdes}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardStattistikApbdesPublic;
