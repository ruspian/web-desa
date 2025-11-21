import React from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";

const ProfilDesaForm = ({ formData, handleChange, setFormData, toast }) => {
  // fungsi handle upload success
  const handleUploadSuccess = (result) => {
    console.log(result);
    setFormData({
      ...formData,
      fotoUtama: result.info.secure_url,
    });

    toast.success("Foto berhasil diupload!", "Success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upload Foto Utama */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Foto Utama
        </label>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Preview Image */}
          <div className="md:col-span-1 relative h-48 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
            {formData.fotoUtama ? (
              <Image
                src={formData.fotoUtama}
                alt="Cover Website"
                className="w-full h-full object-cover"
                width={800}
                height={600}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <ImageIcon size={40} />
              </div>
            )}
            {formData.fotoUtama && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                Preview Tampilan
              </div>
            )}
          </div>

          {/* Upload Box */}
          <div className="md:col-span-2">
            <CldUploadButton
              uploadPreset="ml_default" // upload preset cloudinary
              onSuccess={handleUploadSuccess}
              options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                maxFileSize: 5000000, // 5MB
              }}
              className="w-full h-full" // Class untuk button wrapper
            >
              <div className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors p-6 w-full">
                <div className="bg-slate-100 p-3 rounded-full mb-3">
                  <Upload size={24} className="text-slate-600" />
                </div>
                <p className="font-bold text-sm">Klik untuk ganti foto</p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG/PNG, Maks 5MB. Disarankan rasio 16:9
                </p>
              </div>
            </CldUploadButton>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Nama Desa
          </label>
          <input
            name="namaDesa"
            value={formData.namaDesa}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Tagline
          </label>
          <input
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Sejarah (Textarea Panjang) */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Sejarah Desa
        </label>
        <textarea
          name="sejarah"
          value={formData.sejarah}
          onChange={handleChange}
          rows={10}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed resize-y"
        ></textarea>
        <p className="text-xs text-gray-400 mt-2 text-right">
          Mendukung format paragraf sederhana.
        </p>
      </div>
    </div>
  );
};

export default ProfilDesaForm;
