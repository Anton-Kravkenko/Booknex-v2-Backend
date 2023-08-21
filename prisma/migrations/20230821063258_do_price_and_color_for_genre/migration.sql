/*
  Warnings:

  - You are about to drop the column `readingTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Quotation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_userId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#000000';

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "time" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "readingTime",
DROP COLUMN "role",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Quotation";
