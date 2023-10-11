/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Shelf` table. All the data in the column will be lost.
  - You are about to drop the `_LikedBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UnwatchedShelves` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LikedBooks" DROP CONSTRAINT "_LikedBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedBooks" DROP CONSTRAINT "_LikedBooks_B_fkey";

-- DropForeignKey
ALTER TABLE "_UnwatchedShelves" DROP CONSTRAINT "_UnwatchedShelves_A_fkey";

-- DropForeignKey
ALTER TABLE "_UnwatchedShelves" DROP CONSTRAINT "_UnwatchedShelves_B_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
DROP COLUMN "image",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "picture" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shelf" DROP COLUMN "image",
ADD COLUMN     "picture" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "title" DROP DEFAULT;

-- DropTable
DROP TABLE "_LikedBooks";

-- DropTable
DROP TABLE "_UnwatchedShelves";

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HhiddenShelves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_HhiddenShelves_AB_unique" ON "_HhiddenShelves"("A", "B");

-- CreateIndex
CREATE INDEX "_HhiddenShelves_B_index" ON "_HhiddenShelves"("B");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HhiddenShelves" ADD CONSTRAINT "_HhiddenShelves_A_fkey" FOREIGN KEY ("A") REFERENCES "Shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HhiddenShelves" ADD CONSTRAINT "_HhiddenShelves_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
