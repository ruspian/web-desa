/*
  Warnings:

  - The primary key for the `Agenda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Apbdes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BansosPenerima` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Berita` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Galeri` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LembagaDesa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MutasiPenduduk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Pengaduan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PerangkatDesa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PetaLokasi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PotensiDesa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfilDesa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SiteSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TransaksiKeuangan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Agenda_id_seq";

-- AlterTable
ALTER TABLE "Apbdes" DROP CONSTRAINT "Apbdes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Apbdes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Apbdes_id_seq";

-- AlterTable
ALTER TABLE "BansosPenerima" DROP CONSTRAINT "BansosPenerima_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BansosPenerima_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BansosPenerima_id_seq";

-- AlterTable
ALTER TABLE "Berita" DROP CONSTRAINT "Berita_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Berita_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Berita_id_seq";

-- AlterTable
ALTER TABLE "Galeri" DROP CONSTRAINT "Galeri_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Galeri_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Galeri_id_seq";

-- AlterTable
ALTER TABLE "LembagaDesa" DROP CONSTRAINT "LembagaDesa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LembagaDesa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LembagaDesa_id_seq";

-- AlterTable
ALTER TABLE "MutasiPenduduk" DROP CONSTRAINT "MutasiPenduduk_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MutasiPenduduk_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MutasiPenduduk_id_seq";

-- AlterTable
ALTER TABLE "Pengaduan" DROP CONSTRAINT "Pengaduan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pengaduan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pengaduan_id_seq";

-- AlterTable
ALTER TABLE "PerangkatDesa" DROP CONSTRAINT "PerangkatDesa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PerangkatDesa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PerangkatDesa_id_seq";

-- AlterTable
ALTER TABLE "PetaLokasi" DROP CONSTRAINT "PetaLokasi_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PetaLokasi_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PetaLokasi_id_seq";

-- AlterTable
ALTER TABLE "PotensiDesa" DROP CONSTRAINT "PotensiDesa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PotensiDesa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PotensiDesa_id_seq";

-- AlterTable
ALTER TABLE "ProfilDesa" DROP CONSTRAINT "ProfilDesa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProfilDesa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProfilDesa_id_seq";

-- AlterTable
ALTER TABLE "SiteSettings" DROP CONSTRAINT "SiteSettings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SiteSettings_id_seq";

-- AlterTable
ALTER TABLE "TransaksiKeuangan" DROP CONSTRAINT "TransaksiKeuangan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TransaksiKeuangan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TransaksiKeuangan_id_seq";
