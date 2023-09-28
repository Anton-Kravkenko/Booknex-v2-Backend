/*
  Warnings:

  - You are about to drop the column `like` on the `Shelves` table. All the data in the column will be lost.
  - You are about to drop the `_GenreToShelves` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GenreToShelves" DROP CONSTRAINT "_GenreToShelves_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToShelves" DROP CONSTRAINT "_GenreToShelves_B_fkey";

-- AlterTable
ALTER TABLE "Shelves" DROP COLUMN "like";

-- DropTable
DROP TABLE "_GenreToShelves";

-- CreateTable
CREATE TABLE "_LikedShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UnWacthedShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikedShelves_AB_unique" ON "_LikedShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedShelves_B_index" ON "_LikedShelves"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UnWacthedShelves_AB_unique" ON "_UnWacthedShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_UnWacthedShelves_B_index" ON "_UnWacthedShelves"("B");

-- AddForeignKey
ALTER TABLE "_LikedShelves" ADD CONSTRAINT "_LikedShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelves"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedShelves" ADD CONSTRAINT "_LikedShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnWacthedShelves" ADD CONSTRAINT "_UnWacthedShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelves"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnWacthedShelves" ADD CONSTRAINT "_UnWacthedShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
