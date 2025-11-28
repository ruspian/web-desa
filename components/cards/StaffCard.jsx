import Image from "next/image";
import { Phone, Mail, User } from "lucide-react";

const StaffCard = ({ data, type = "staff" }) => {
  // Tentukan ukuran berdasarkan tipe jabatan
  const isLeader = type === "leader";
  const cardWidth = isLeader ? "max-w-md w-full" : "w-full";
  const imageHeight = isLeader ? "h-80" : "h-64";

  return (
    <div
      className={`${cardWidth} bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group`}
    >
      {/* Foto Profile */}
      <div
        className={`relative ${imageHeight} w-full bg-gray-100 overflow-hidden`}
      >
        {data.foto ? (
          <Image
            src={data.foto}
            alt={data.nama}
            fill
            className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <User size={64} />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

        {/* Jabatan Badge  */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm
             ${
               isLeader
                 ? "bg-yellow-500 text-yellow-950"
                 : "bg-emerald-600 text-white"
             }
           `}
          >
            {data.jabatan}
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-snug">
          {data.nama}
        </h3>
        <p className="text-sm text-gray-500 font-mono mb-4">
          {data.nip ? `NIP. ${data.nip}` : "-"}
        </p>

        {/* Tombol Kontak Simpel */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
          {data.noHp && (
            <a
              href={`https://wa.me/${data.noHp.replace(/\D/g, "")}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-600 hover:text-white transition-colors"
            >
              <Phone size={16} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
