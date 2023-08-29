/*
  Warnings:

  - You are about to drop the column `rared` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `Enhancements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_userId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "rared";

-- DropTable
DROP TABLE "Enhancements";

-- DropTable
DROP TABLE "InventoryItem";

-- DropEnum
DROP TYPE "BookRare";

-- DropEnum
DROP TYPE "BoxRare";

-- DropEnum
DROP TYPE "EnhancementsType";
