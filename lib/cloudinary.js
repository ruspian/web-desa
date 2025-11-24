export const uploadToCloudinary = async (blob, fileName) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = "ml_default"; // PRESET UPLOAD

  const formData = new FormData();
  formData.append("file", blob, fileName);
  formData.append("upload_preset", uploadPreset);

  // Gunakan endpoint 'raw' untuk file dokumen (.docx/.pdf)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Gagal upload file ke server");
  const data = await res.json();
  return data.secure_url;
};
