/*
  Warnings:

  - You are about to drop the column `color` on the `Genre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#fff';

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "color";

-- CreateTable
CREATE TABLE "Shelves" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#fff',

    CONSTRAINT "Shelves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GenreToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GenreToShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToShelves_AB_unique" ON "_BookToShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToShelves_B_index" ON "_BookToShelves"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToUser_AB_unique" ON "_GenreToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToUser_B_index" ON "_GenreToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToShelves_AB_unique" ON "_GenreToShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToShelves_B_index" ON "_GenreToShelves"("B");

-- CreateIndex
CREATE INDEX "Book_title_author_idx" ON "Book"("title", "author");

-- AddForeignKey
ALTER TABLE "_BookToShelves" ADD CONSTRAINT "_BookToShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToShelves" ADD CONSTRAINT "_BookToShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "Shelves"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToUser" ADD CONSTRAINT "_GenreToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToUser" ADD CONSTRAINT "_GenreToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToShelves" ADD CONSTRAINT "_GenreToShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToShelves" ADD CONSTRAINT "_GenreToShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "Shelves"("id") ON DELETE CASCADE ON UPDATE CASCADE;
