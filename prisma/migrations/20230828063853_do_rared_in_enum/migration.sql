/*
  Warnings:

  - The `rared` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rare` column on the `Enhancements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BoxRare" AS ENUM ('Common', 'Rare', 'Epic', 'Legendary');

-- CreateEnum
CREATE TYPE "BookRare" AS ENUM ('Common', 'Uncommon', 'Rare', 'Limited', 'Exquisite', 'Mythic', 'Precious', 'Priceless', 'Antiquarian');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "rared",
ADD COLUMN     "rared" "BookRare" NOT NULL DEFAULT 'Common';

-- AlterTable
ALTER TABLE "Enhancements" DROP COLUMN "rare",
ADD COLUMN     "rare" "BoxRare" NOT NULL DEFAULT 'Common';

-- DropEnum
DROP TYPE "rare";
