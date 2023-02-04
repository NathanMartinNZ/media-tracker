-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "show_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show"("id") ON DELETE SET NULL ON UPDATE CASCADE;
