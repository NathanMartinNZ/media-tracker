-- CreateTable
CREATE TABLE "AddedMovie" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddedShow" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "show_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddedShow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AddedMovie" ADD CONSTRAINT "AddedMovie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedMovie" ADD CONSTRAINT "AddedMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedShow" ADD CONSTRAINT "AddedShow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedShow" ADD CONSTRAINT "AddedShow_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
