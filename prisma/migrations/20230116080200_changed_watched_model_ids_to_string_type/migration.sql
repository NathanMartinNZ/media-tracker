/*
  Warnings:

  - The primary key for the `WatchedEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `WatchedMovie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "WatchedEpisode" DROP CONSTRAINT "WatchedEpisode_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WatchedEpisode_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WatchedEpisode_id_seq";

-- AlterTable
ALTER TABLE "WatchedMovie" DROP CONSTRAINT "WatchedMovie_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WatchedMovie_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WatchedMovie_id_seq";
