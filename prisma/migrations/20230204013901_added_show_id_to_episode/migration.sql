-- AlterTable
ALTER TABLE "WatchedEpisode" ADD COLUMN     "show_id" SERIAL NOT NULL;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
