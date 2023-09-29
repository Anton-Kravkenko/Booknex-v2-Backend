-- CreateTable
CREATE TABLE "_simular" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_simular_AB_unique" ON "_simular"("A", "B");

-- CreateIndex
CREATE INDEX "_simular_B_index" ON "_simular"("B");

-- AddForeignKey
ALTER TABLE "_simular" ADD CONSTRAINT "_simular_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_simular" ADD CONSTRAINT "_simular_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
