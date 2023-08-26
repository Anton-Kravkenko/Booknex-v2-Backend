/*
  Warnings:

  - You are about to drop the column `InventoryItemId` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the `Boxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Perks` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnhancementsType" AS ENUM ('Box', 'Customizations', 'Pets', 'Modifications');

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "BoxInventoryItem";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "PerkInventoryItem";

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "InventoryItemId",
DROP COLUMN "type",
ADD COLUMN     "inventoryItemId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picture" TEXT;

-- DropTable
DROP TABLE "Boxes";

-- DropTable
DROP TABLE "Perks";

-- DropEnum
DROP TYPE "InventoryItemType";

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "emotion" TEXT[],

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enhancements" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'No description',
    "rare" TEXT NOT NULL DEFAULT 'Common',
    "price" INTEGER NOT NULL DEFAULT 0,
    "type" "EnhancementsType" NOT NULL,

    CONSTRAINT "Enhancements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enhancements_name_key" ON "Enhancements"("name");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "Enhancements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
