/*
  Warnings:

  - You are about to drop the column `likedPercent` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `dislike` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `emotion` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Shelves` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToShelves` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FinishBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UnWacthedShelves` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `likedPercentage` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emotionId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BookToShelves" DROP CONSTRAINT "_BookToShelves_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToShelves" DROP CONSTRAINT "_BookToShelves_B_fkey";

-- DropForeignKey
ALTER TABLE "_FinishBooks" DROP CONSTRAINT "_FinishBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_FinishBooks" DROP CONSTRAINT "_FinishBooks_B_fkey";

-- DropForeignKey
ALTER TABLE "_LikedShelves" DROP CONSTRAINT "_LikedShelves_A_fkey";

-- DropForeignKey
ALTER TABLE "_UnWacthedShelves" DROP CONSTRAINT "_UnWacthedShelves_A_fkey";

-- DropForeignKey
ALTER TABLE "_UnWacthedShelves" DROP CONSTRAINT "_UnWacthedShelves_B_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "likedPercent",
ADD COLUMN     "likedPercentage" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "dislike",
DROP COLUMN "emotion",
DROP COLUMN "like",
ADD COLUMN     "emotionId" INTEGER NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "Shelves";

-- DropTable
DROP TABLE "_BookToShelves";

-- DropTable
DROP TABLE "_FinishBooks";

-- DropTable
DROP TABLE "_UnWacthedShelves";

-- CreateTable
CREATE TABLE "Emotion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Emotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelf" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#fff',
    "picture" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Shelf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToShelf" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FinishedBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UnwatchedShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Emotion_name_key" ON "Emotion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToShelf_AB_unique" ON "_BookToShelf"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToShelf_B_index" ON "_BookToShelf"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FinishedBooks_AB_unique" ON "_FinishedBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_FinishedBooks_B_index" ON "_FinishedBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UnwatchedShelves_AB_unique" ON "_UnwatchedShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_UnwatchedShelves_B_index" ON "_UnwatchedShelves"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_emotionId_fkey" FOREIGN KEY ("emotionId") REFERENCES "Emotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToShelf" ADD CONSTRAINT "_BookToShelf_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToShelf" ADD CONSTRAINT "_BookToShelf_B_fkey" FOREIGN KEY ("B") REFERENCES "Shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FinishedBooks" ADD CONSTRAINT "_FinishedBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FinishedBooks" ADD CONSTRAINT "_FinishedBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedShelves" ADD CONSTRAINT "_LikedShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnwatchedShelves" ADD CONSTRAINT "_UnwatchedShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnwatchedShelves" ADD CONSTRAINT "_UnwatchedShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
