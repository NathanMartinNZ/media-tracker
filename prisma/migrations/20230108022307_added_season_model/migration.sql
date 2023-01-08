/*
  Warnings:

  - You are about to drop the column `seasons` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Show" DROP COLUMN "seasons";

-- CreateTable
CREATE TABLE "Season" (
    "id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    "media_type" TEXT NOT NULL DEFAULT 'season',
    "overview" TEXT,
    "poster_path" TEXT,
    "air_date" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "season_number" INTEGER NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
