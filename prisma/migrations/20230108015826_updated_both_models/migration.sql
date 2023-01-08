/*
  Warnings:

  - You are about to drop the column `name` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "media_type" TEXT NOT NULL DEFAULT 'movie';

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "name",
ADD COLUMN     "media_type" TEXT NOT NULL DEFAULT 'show',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
