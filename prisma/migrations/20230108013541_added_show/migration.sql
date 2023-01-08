-- CreateTable
CREATE TABLE "Show" (
    "id" INTEGER NOT NULL,
    "genres" TEXT[],
    "original_language" TEXT NOT NULL,
    "overview" TEXT,
    "popularity" DOUBLE PRECISION NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT,
    "first_air_date" TEXT NOT NULL,
    "last_air_date" TEXT NOT NULL,
    "spoken_languages" TEXT[],
    "status" TEXT NOT NULL,
    "tagline" TEXT,
    "name" TEXT NOT NULL,
    "networks" TEXT NOT NULL,
    "number_of_episodes" INTEGER NOT NULL,
    "number_of_seasons" INTEGER NOT NULL,
    "seasons" INTEGER[],
    "watched" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);
