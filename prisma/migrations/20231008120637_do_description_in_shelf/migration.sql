/*
  Warnings:

  - You are about to drop the column `name` on the `Shelf` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Shelf` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Shelf" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled';

-- CreateIndex
CREATE UNIQUE INDEX "Shelf_title_key" ON "Shelf"("title");
