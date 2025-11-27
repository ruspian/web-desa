import { CalendarClock } from "lucide-react";
import React from "react";

const CardJamPelayanan = () => {
  return (
    <>
      <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center hover:border-orange-200 transition-colors">
        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-4">
          <CalendarClock size={28} />
        </div>
        <h4 className="font-bold text-gray-900 text-lg">Jam Operasional</h4>
        <p className="text-sm text-gray-500 mt-1">Senin - Kamis</p>
        <p className="text-2xl font-bold text-gray-800 my-2">08:00 - 15:00</p>
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          Jum&apos;at 08:00 - 11:00
        </span>
      </div>
    </>
  );
};

export default CardJamPelayanan;
