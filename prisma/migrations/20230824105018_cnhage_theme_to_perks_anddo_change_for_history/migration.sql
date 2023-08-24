/*
  Warnings:

  - The values [Theme] on the enum `InventoryItemType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isBought` on the `Boxes` table. All the data in the column will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookId` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryItemType_new" AS ENUM ('Boxes', 'Perks');
ALTER TABLE "InventoryItem" ALTER COLUMN "type" TYPE "InventoryItemType_new" USING ("type"::text::"InventoryItemType_new");
ALTER TYPE "InventoryItemType" RENAME TO "InventoryItemType_old";
ALTER TYPE "InventoryItemType_new" RENAME TO "InventoryItemType";
DROP TYPE "InventoryItemType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "ThemeInventoryItem";

-- DropForeignKey
ALTER TABLE "_BookToHistory" DROP CONSTRAINT "_BookToHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToHistory" DROP CONSTRAINT "_BookToHistory_B_fkey";

-- AlterTable
ALTER TABLE "Boxes" DROP COLUMN "isBought";

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "bookId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "isBought" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Theme";

-- DropTable
DROP TABLE "_BookToHistory";

-- CreateTable
CREATE TABLE "Perks" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'No description',
    "rare" TEXT NOT NULL DEFAULT 'Common',
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Perks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Perks_name_key" ON "Perks"("name");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "PerkInventoryItem" FOREIGN KEY ("InventoryItemId") REFERENCES "Perks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
