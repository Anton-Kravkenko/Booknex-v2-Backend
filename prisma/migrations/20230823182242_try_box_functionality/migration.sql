/*
  Warnings:

  - You are about to drop the column `userId` on the `Boxes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InventoryItemType" AS ENUM ('Boxes');

-- DropForeignKey
ALTER TABLE "Boxes" DROP CONSTRAINT "Boxes_userId_fkey";

-- AlterTable
ALTER TABLE "Boxes" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "type" "InventoryItemType" NOT NULL,
    "boxesId" INTEGER,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_boxesId_fkey" FOREIGN KEY ("boxesId") REFERENCES "Boxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
