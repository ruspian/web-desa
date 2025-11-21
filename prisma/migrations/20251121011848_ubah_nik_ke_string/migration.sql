/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nik" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");
