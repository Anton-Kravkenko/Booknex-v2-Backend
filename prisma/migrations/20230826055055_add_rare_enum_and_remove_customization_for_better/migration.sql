/*
  Warnings:

  - The values [Customizations] on the enum `EnhancementsType` will be removed. If these variants are still used in the database, this will fail.
  - The `rare` column on the `Enhancements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "rare" AS ENUM ('Common', 'Rare', 'Epic', 'Legendary');

-- AlterEnum
BEGIN;
CREATE TYPE "EnhancementsType_new" AS ENUM ('Box', 'Pets', 'Modifications');
ALTER TABLE "Enhancements" ALTER COLUMN "type" TYPE "EnhancementsType_new" USING ("type"::text::"EnhancementsType_new");
ALTER TYPE "EnhancementsType" RENAME TO "EnhancementsType_old";
ALTER TYPE "EnhancementsType_new" RENAME TO "EnhancementsType";
DROP TYPE "EnhancementsType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Enhancements" DROP COLUMN "rare",
ADD COLUMN     "rare" "rare" NOT NULL DEFAULT 'Common';
