-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL,
    "imdb_id" TEXT,
    "genres" TEXT[],
    "original_language" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "overview" TEXT,
    "popularity" DOUBLE PRECISION NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT,
    "release_date" TEXT NOT NULL,
    "runtime" INTEGER,
    "spoken_languages" TEXT[],
    "status" TEXT NOT NULL,
    "tagline" TEXT,
    "title" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);
