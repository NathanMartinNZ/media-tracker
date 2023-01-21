-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "air_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "release_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "air_date" DROP NOT NULL;
