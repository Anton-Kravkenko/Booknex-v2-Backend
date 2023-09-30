/*
  Warnings:

  - You are about to drop the column `picture` on the `Genre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "picture",
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#fff';
