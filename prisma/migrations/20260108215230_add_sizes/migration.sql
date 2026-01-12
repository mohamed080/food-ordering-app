/*
  Warnings:

  - The values [SAMLL] on the enum `ProductSizes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductSizes_new" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
ALTER TABLE "Sizes" ALTER COLUMN "name" TYPE "ProductSizes_new" USING ("name"::text::"ProductSizes_new");
ALTER TYPE "ProductSizes" RENAME TO "ProductSizes_old";
ALTER TYPE "ProductSizes_new" RENAME TO "ProductSizes";
DROP TYPE "public"."ProductSizes_old";
COMMIT;
