-- AlterTable
ALTER TABLE "User" ADD COLUMN     "readingTime" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "bookMarks" SET DEFAULT 300;

-- CreateTable
CREATE TABLE "_BuyBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BuyBooks_AB_unique" ON "_BuyBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_BuyBooks_B_index" ON "_BuyBooks"("B");

-- AddForeignKey
ALTER TABLE "_BuyBooks" ADD CONSTRAINT "_BuyBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuyBooks" ADD CONSTRAINT "_BuyBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
