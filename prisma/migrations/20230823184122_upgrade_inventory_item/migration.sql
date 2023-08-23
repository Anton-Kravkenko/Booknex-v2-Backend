/*
  Warnings:

  - You are about to drop the column `boxesId` on the `InventoryItem` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "InventoryItemType" ADD VALUE 'Theme';

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_boxesId_fkey";

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "boxesId",
ADD COLUMN     "InventoryItemId" INTEGER;

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'No description',
    "rare" TEXT NOT NULL DEFAULT 'Common',
    "price" INTEGER NOT NULL DEFAULT 0,
    "isBought" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "BoxInventoryItem" FOREIGN KEY ("InventoryItemId") REFERENCES "Boxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "ThemeInventoryItem" FOREIGN KEY ("InventoryItemId") REFERENCES "Theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
