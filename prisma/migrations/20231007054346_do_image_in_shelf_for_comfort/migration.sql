/*
  Warnings:

  - You are about to drop the column `picture` on the `Shelf` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shelf" DROP COLUMN "picture",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';
