/*
  Warnings:

  - You are about to drop the column `userId` on the `Boxes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Boxes" DROP CONSTRAINT "Boxes_userId_fkey";

-- AlterTable
ALTER TABLE "Boxes" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_BoxesToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoxesToUser_AB_unique" ON "_BoxesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BoxesToUser_B_index" ON "_BoxesToUser"("B");

-- AddForeignKey
ALTER TABLE "_BoxesToUser" ADD CONSTRAINT "_BoxesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Boxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxesToUser" ADD CONSTRAINT "_BoxesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
