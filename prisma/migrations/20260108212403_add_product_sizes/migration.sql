-- CreateEnum
CREATE TYPE "ProductSizes" AS ENUM ('SAMLL', 'MEDIUM', 'LARGE');

-- CreateTable
CREATE TABLE "Sizes" (
    "id" TEXT NOT NULL,
    "name" "ProductSizes" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Sizes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sizes" ADD CONSTRAINT "Sizes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
