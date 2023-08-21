-- AlterTable
ALTER TABLE "Boxes" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'No description',
ADD COLUMN     "rare" TEXT NOT NULL DEFAULT 'Common',
ALTER COLUMN "image" SET DEFAULT 'https://cdn.pixabay.com/photo/2016/03/31/19/58/book-1296045_960_720.png';
