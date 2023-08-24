/*
  Warnings:

  - You are about to drop the column `description` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `isBought` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Theme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "isBought",
DROP COLUMN "price",
ADD COLUMN     "bgColor" TEXT NOT NULL DEFAULT '#fff',
ADD COLUMN     "primaryColor" TEXT NOT NULL DEFAULT '#000',
ADD COLUMN     "textColor" TEXT NOT NULL DEFAULT '#000';
