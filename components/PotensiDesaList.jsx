import { Edit, ImageIcon, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const PotensiDesaList = ({ item, openModal, onDeleteClick, getBadgeColor }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 group hover:border-emerald-200 transition-all">
      {/* Image Wrapper */}
      <div className="w-full md:w-48 h-40 md:h-32 bg-gray-100 rounded-xl relative overflow-hidden shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <ImageIcon size={32} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(
              item.category
            )}`}
          >
            {item.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin size={14} /> {item.location}
        </div>
        {/* Gunakan description disini */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
        <button
          onClick={() => openModal(item)}
          className="flex-1 md:flex-none w-10 h-10 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center"
          title="Edit"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDeleteClick(item.id)}
          className="flex-1 md:flex-none w-10 h-10 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center"
          title="Hapus"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PotensiDesaList;
