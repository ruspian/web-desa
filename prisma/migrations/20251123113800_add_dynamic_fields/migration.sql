-- AlterTable
ALTER TABLE "JenisSurat" ADD COLUMN     "fields" JSONB;

-- AlterTable
ALTER TABLE "SuratRequest" ADD COLUMN     "extraData" JSONB;
