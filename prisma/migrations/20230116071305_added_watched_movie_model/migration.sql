/*
  Warnings:

  - You are about to drop the column `watched` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "watched";

-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "WatchedMovie" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchedMovie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
