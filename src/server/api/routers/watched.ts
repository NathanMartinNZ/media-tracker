import { WatchedEpisode, WatchedMovie } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { randomUUID } from "crypto";

export const watchedRouter = createTRPCRouter({
  getWatchedMovieById: publicProcedure.input(z.object({ movieId: z.number(), userId: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.watchedMovie.findMany({ where: {
      AND: [
        { movie_id: input.movieId },
        { user_id: input.userId }
      ]
    }});
  }),

  getWatchedEpisodesBySeasonId: publicProcedure.input(z.object({ seasonId: z.number(), userId: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.watchedEpisode.findMany({ where: {
      AND: [
        { season_id: input.seasonId },
        { user_id: input.userId }
      ]
    }});
  }),

  addMovieWatchedById: publicProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      const watchedObj:WatchedMovie = {
        id: randomUUID(),
        movie_id: input.movieId,
        user_id: input.userId,
        timestamp: new Date()
      }

      return ctx.prisma.watchedMovie.create({
        data: watchedObj
      })
    }),

  addEpisodeWatchedById: publicProcedure
    .input(z.object({ episodeId: z.number(), seasonId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      const watchedObj:WatchedEpisode = {
        id: randomUUID(),
        episode_id: input.episodeId,
        user_id: input.userId,
        season_id: input.seasonId,
        timestamp: new Date()
      }

      return ctx.prisma.watchedEpisode.create({
        data: watchedObj
      })
    }),

  removeMovieWatchedById: publicProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchedMovie.deleteMany({
        where: {
          AND: [
            {movie_id: input.movieId},
            {user_id: input.userId}
          ]
        }
      })
    }),

  removeEpisodeWatchedById: publicProcedure
    .input(z.object({ episodeId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchedEpisode.deleteMany({
        where: {
          AND: [
            {episode_id: input.episodeId},
            {user_id: input.userId}
          ]
        }
      })
    }),

});
