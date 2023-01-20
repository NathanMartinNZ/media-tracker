/*
  Warnings:

  - Added the required column `season_id` to the `WatchedEpisode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WatchedEpisode" ADD COLUMN     "season_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
