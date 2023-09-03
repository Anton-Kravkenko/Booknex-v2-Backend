/*
  Warnings:

  - You are about to drop the `_BuyBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BuyBooks" DROP CONSTRAINT "_BuyBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_BuyBooks" DROP CONSTRAINT "_BuyBooks_B_fkey";

-- DropTable
DROP TABLE "_BuyBooks";
