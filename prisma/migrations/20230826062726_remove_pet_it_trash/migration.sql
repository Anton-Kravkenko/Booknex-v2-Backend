/*
  Warnings:

  - The values [Pets] on the enum `EnhancementsType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnhancementsType_new" AS ENUM ('Box', 'Modifications');
ALTER TABLE "Enhancements" ALTER COLUMN "type" TYPE "EnhancementsType_new" USING ("type"::text::"EnhancementsType_new");
ALTER TYPE "EnhancementsType" RENAME TO "EnhancementsType_old";
ALTER TYPE "EnhancementsType_new" RENAME TO "EnhancementsType";
DROP TYPE "EnhancementsType_old";
COMMIT;
