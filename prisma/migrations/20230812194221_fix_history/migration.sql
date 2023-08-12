/*
  Warnings:

  - You are about to drop the column `bookId` on the `History` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_bookId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "bookId";

-- CreateTable
CREATE TABLE "_BookToHistory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToHistory_AB_unique" ON "_BookToHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToHistory_B_index" ON "_BookToHistory"("B");

-- AddForeignKey
ALTER TABLE "_BookToHistory" ADD CONSTRAINT "_BookToHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToHistory" ADD CONSTRAINT "_BookToHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "History"("id") ON DELETE CASCADE ON UPDATE CASCADE;
