-- CreateTable
CREATE TABLE "ProfilDesa" (
    "id" SERIAL NOT NULL,
    "visi" TEXT,
    "misi" TEXT[],
    "sejarah" TEXT,
    "nama" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "potoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilDesa_pkey" PRIMARY KEY ("id")
);
