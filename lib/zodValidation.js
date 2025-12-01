import { z } from "zod";

// SCHEMA SURAT
export const suratSchema = z.object({
  pendudukId: z.string().min(1, "Data penduduk wajib dipilih"),

  // Validasi Snapshot Data Diri
  nikSnapshot: z
    .string()
    .length(16, "NIK harus tepat 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  namaSnapshot: z.string().min(3, "Nama terlalu pendek (min 3 karakter)"),

  // Validasi Data Surat
  jenisSurat: z.string().min(1, "Jenis surat wajib dipilih"),
  templateId: z.string().optional().nullable(), // Boleh null
  nomorSurat: z.string().optional().nullable(), // Boleh kosong saat request awal
  keperluan: z.string().min(5, "Keperluan harus diisi jelas (min 5 karakter)"),

  // Validasi Kontak
  noHp: z
    .string()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
      "Nomor HP tidak valid (Gunakan format 08xxx atau 628xxx)"
    )
    .optional()
    .or(z.literal("")), // Boleh string kosong

  // Validasi JSON Extra Data
  extraData: z.record(z.string(), z.any()).optional(),

  // Validasi File
  fileKtp: z.string().url("Link foto KTP tidak valid").optional().nullable(),
  fileKk: z.string().url("Link foto KK tidak valid").optional().nullable(),
  fileSuratJadi: z.string().url().optional().nullable(),

  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

// SCHEMA CEK BANSOS
export const cekBansosSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
});

// SCHEMA PENGADUAN
export const pengaduanSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek").optional().or(z.literal("")),
  nik: z
    .string()
    .length(16, "NIK harus tepat 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  noHp: z
    .string()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
      "Nomor HP tidak valid (Gunakan format 08xxx atau 628xxx)"
    )
    .optional()
    .or(z.literal("")),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  lokasi: z.string().min(3, "Lokasi wajib diisi"),
  isi: z.string().min(10, "Isi laporan terlalu singkat, jelaskan lebih detail"),
  foto: z.string().url().optional().or(z.literal("")),
  isAnonim: z.boolean(),
});
