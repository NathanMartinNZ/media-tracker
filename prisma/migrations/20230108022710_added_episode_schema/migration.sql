-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "media_type" TEXT NOT NULL DEFAULT 'episode',
    "overview" TEXT,
    "still_path" TEXT,
    "air_date" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "episode_number" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
