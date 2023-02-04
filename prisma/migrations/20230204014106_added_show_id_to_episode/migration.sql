-- DropForeignKey
ALTER TABLE "WatchedEpisode" DROP CONSTRAINT "WatchedEpisode_show_id_fkey";

-- AlterTable
ALTER TABLE "WatchedEpisode" ALTER COLUMN "show_id" DROP NOT NULL,
ALTER COLUMN "show_id" DROP DEFAULT;
DROP SEQUENCE "WatchedEpisode_show_id_seq";

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show"("id") ON DELETE SET NULL ON UPDATE CASCADE;
