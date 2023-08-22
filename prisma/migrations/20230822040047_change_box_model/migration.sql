/*
  Warnings:

  - You are about to drop the `_BoxesToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BoxesToUser" DROP CONSTRAINT "_BoxesToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BoxesToUser" DROP CONSTRAINT "_BoxesToUser_B_fkey";

-- AlterTable
ALTER TABLE "Boxes" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "_BoxesToUser";

-- AddForeignKey
ALTER TABLE "Boxes" ADD CONSTRAINT "Boxes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
