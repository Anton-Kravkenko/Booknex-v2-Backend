/*
  Warnings:

  - You are about to drop the `_LikedShelves` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LikedShelves" DROP CONSTRAINT "_LikedShelves_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedShelves" DROP CONSTRAINT "_LikedShelves_B_fkey";

-- DropTable
DROP TABLE "_LikedShelves";

-- CreateTable
CREATE TABLE "_WatchedShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WatchedShelves_AB_unique" ON "_WatchedShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_WatchedShelves_B_index" ON "_WatchedShelves"("B");

-- AddForeignKey
ALTER TABLE "_WatchedShelves" ADD CONSTRAINT "_WatchedShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchedShelves" ADD CONSTRAINT "_WatchedShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
