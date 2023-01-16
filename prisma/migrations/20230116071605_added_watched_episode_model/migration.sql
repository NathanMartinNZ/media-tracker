/*
  Warnings:

  - You are about to drop the column `watched` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `watched` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "watched";

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "watched";

-- CreateTable
CREATE TABLE "WatchedEpisode" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchedEpisode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
