-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WARGA');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Agama" AS ENUM ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU', 'LAINNYA');

-- CreateEnum
CREATE TYPE "StatusPenduduk" AS ENUM ('HIDUP', 'MENINGGAL', 'PINDAH');

-- CreateEnum
CREATE TYPE "StatusSurat" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TipeKeuangan" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "StatusBerita" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'WARGA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KartuKeluarga" (
    "id" TEXT NOT NULL,
    "noKK" TEXT NOT NULL,
    "kepalaKeluarga" TEXT NOT NULL,
    "alamat" TEXT,
    "dusun" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KartuKeluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penduduk" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jk" "Gender" NOT NULL,
    "tempatLahir" TEXT,
    "tglLahir" TIMESTAMP(3) NOT NULL,
    "agama" "Agama" NOT NULL DEFAULT 'ISLAM',
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "statusKawin" TEXT,
    "statusKeluarga" TEXT,
    "dusun" TEXT,
    "status" "StatusPenduduk" NOT NULL DEFAULT 'HIDUP',
    "kkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penduduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutasiPenduduk" (
    "id" SERIAL NOT NULL,
    "jenis" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "pendudukId" TEXT,
    "namaWarga" TEXT NOT NULL,

    CONSTRAINT "MutasiPenduduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerangkatDesa" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nip" TEXT,
    "noHp" TEXT,
    "foto" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "urutan" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "PerangkatDesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LembagaDesa" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "singkatan" TEXT NOT NULL,
    "ketua" TEXT,
    "anggota" INTEGER NOT NULL DEFAULT 0,
    "deskripsi" TEXT,
    "logo" TEXT,
    "warna" TEXT DEFAULT 'blue',

    CONSTRAINT "LembagaDesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratRequest" (
    "id" TEXT NOT NULL,
    "jenisSurat" TEXT NOT NULL,
    "nomorSurat" TEXT,
    "keperluan" TEXT NOT NULL,
    "status" "StatusSurat" NOT NULL DEFAULT 'PENDING',
    "alasanTolak" TEXT,
    "nikSnapshot" TEXT NOT NULL,
    "namaSnapshot" TEXT NOT NULL,
    "noHp" TEXT,
    "fileKtp" TEXT,
    "fileKk" TEXT,
    "filePengantar" TEXT,
    "pendudukId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuratRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BansosPenerima" (
    "id" SERIAL NOT NULL,
    "jenisBansos" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "nominal" DECIMAL(15,2),
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "pendudukId" TEXT NOT NULL,

    CONSTRAINT "BansosPenerima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id" SERIAL NOT NULL,
    "tiketId" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "lokasi" TEXT,
    "foto" TEXT,
    "kategori" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isAnonim" BOOLEAN NOT NULL DEFAULT false,
    "nama" TEXT,
    "nik" TEXT,
    "noHp" TEXT,
    "tanggapan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apbdes" (
    "id" SERIAL NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tipe" "TipeKeuangan" NOT NULL,
    "kategori" TEXT NOT NULL,
    "anggaran" DECIMAL(15,2) NOT NULL,
    "realisasi" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apbdes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransaksiKeuangan" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "uraian" TEXT NOT NULL,
    "tipe" "TipeKeuangan" NOT NULL,
    "kategori" TEXT NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "bukti" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransaksiKeuangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT NOT NULL,
    "author" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusBerita" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Galeri" (
    "id" SERIAL NOT NULL,
    "caption" TEXT,
    "image" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotensiDesa" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PotensiDesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetaLokasi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "PetaLokasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" SERIAL NOT NULL,
    "namaDesa" TEXT NOT NULL DEFAULT 'Desa Makmur Jaya',
    "alamat" TEXT,
    "telepon" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "strukturImg" TEXT,
    "visi" TEXT,
    "misi" TEXT[],
    "sejarah" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "KartuKeluarga_noKK_key" ON "KartuKeluarga"("noKK");

-- CreateIndex
CREATE UNIQUE INDEX "Penduduk_nik_key" ON "Penduduk"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "SuratRequest_nomorSurat_key" ON "SuratRequest"("nomorSurat");

-- CreateIndex
CREATE UNIQUE INDEX "Pengaduan_tiketId_key" ON "Pengaduan"("tiketId");

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");

-- AddForeignKey
ALTER TABLE "Penduduk" ADD CONSTRAINT "Penduduk_kkId_fkey" FOREIGN KEY ("kkId") REFERENCES "KartuKeluarga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutasiPenduduk" ADD CONSTRAINT "MutasiPenduduk_pendudukId_fkey" FOREIGN KEY ("pendudukId") REFERENCES "Penduduk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratRequest" ADD CONSTRAINT "SuratRequest_pendudukId_fkey" FOREIGN KEY ("pendudukId") REFERENCES "Penduduk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BansosPenerima" ADD CONSTRAINT "BansosPenerima_pendudukId_fkey" FOREIGN KEY ("pendudukId") REFERENCES "Penduduk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
