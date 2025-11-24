/*
  Warnings:

  - The primary key for the `JenisSurat` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "JenisSurat" DROP CONSTRAINT "JenisSurat_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "JenisSurat_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "JenisSurat_id_seq";

-- AlterTable
ALTER TABLE "SuratRequest" ADD COLUMN     "jenisSuratId" TEXT;

-- AddForeignKey
ALTER TABLE "SuratRequest" ADD CONSTRAINT "SuratRequest_jenisSuratId_fkey" FOREIGN KEY ("jenisSuratId") REFERENCES "JenisSurat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
