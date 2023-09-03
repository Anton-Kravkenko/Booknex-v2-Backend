/*
  Warnings:

  - You are about to drop the `_ReadBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ReadBooks" DROP CONSTRAINT "_ReadBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReadBooks" DROP CONSTRAINT "_ReadBooks_B_fkey";

-- DropTable
DROP TABLE "_ReadBooks";

-- CreateTable
CREATE TABLE "_FinishBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FinishBooks_AB_unique" ON "_FinishBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_FinishBooks_B_index" ON "_FinishBooks"("B");

-- AddForeignKey
ALTER TABLE "_FinishBooks" ADD CONSTRAINT "_FinishBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FinishBooks" ADD CONSTRAINT "_FinishBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
