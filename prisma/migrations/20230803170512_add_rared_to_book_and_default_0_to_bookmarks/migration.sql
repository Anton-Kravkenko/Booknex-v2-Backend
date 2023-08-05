/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MessageToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rared` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_B_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "rared" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bookMarks" SET DEFAULT 0;

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_MessageToUser";
