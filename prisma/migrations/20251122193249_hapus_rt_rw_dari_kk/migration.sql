/*
  Warnings:

  - You are about to drop the column `rt` on the `KartuKeluarga` table. All the data in the column will be lost.
  - You are about to drop the column `rw` on the `KartuKeluarga` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KartuKeluarga" DROP COLUMN "rt",
DROP COLUMN "rw";
