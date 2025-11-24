-- CreateTable
CREATE TABLE "Banknote" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nominal" TEXT NOT NULL,
    "year" INTEGER,
    "emission" TEXT,
    "condition" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "imageUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banknote_pkey" PRIMARY KEY ("id")
);
