import { Episode, Season, WatchedEpisode, WatchedMovie } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { randomUUID } from "crypto";

export const watchedRouter = createTRPCRouter({
  getWatchedMovieById: publicProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.watchedMovie.findMany({
        where: {
          AND: [{ movie_id: input.movieId }, { user_id: input.userId }],
        },
      });
    }),

  hasWatchedAllEpisodes: publicProcedure
    .input(
      z.object({
        seasonIds: z.number().array(),
        showId: z.number(),
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const show = await ctx.prisma.show.findUnique({
        where: {
          id: input.showId
        }
      });
      const watchedEpisodes = await ctx.prisma.watchedEpisode.findMany({
        where: {
          AND: [
            { season_id: { in: input.seasonIds } },
            { user_id: input.userId },
          ],
        },
      });
      const uniqueWatchedEpisodes = [...new Set(watchedEpisodes.map((e:WatchedEpisode) => e.episode_id))];
      if(!show) { return false }
      
      return uniqueWatchedEpisodes.length >= show.number_of_episodes;
    }),

  getWatchedEpisodesBySeasonId: publicProcedure
    .input(z.object({ seasonId: z.number(), userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.watchedEpisode.findMany({
        where: {
          AND: [{ season_id: input.seasonId }, { user_id: input.userId }],
        },
      });
    }),

  addMovieWatchedById: publicProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      const watchedObj: WatchedMovie = {
        id: randomUUID(),
        movie_id: input.movieId,
        user_id: input.userId,
        timestamp: new Date(),
      };

      return ctx.prisma.watchedMovie.create({
        data: watchedObj,
      });
    }),

  addEpisodeWatchedById: publicProcedure
    .input(
      z.object({
        episodeId: z.number(),
        seasonId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const watchedObj: WatchedEpisode = {
        id: randomUUID(),
        episode_id: input.episodeId,
        user_id: input.userId,
        season_id: input.seasonId,
        timestamp: new Date(),
      };

      return ctx.prisma.watchedEpisode.create({
        data: watchedObj,
      });
    }),

  addAllEpisodesWatched: publicProcedure
    .input(z.object({ seasonIds: z.number().array(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const episodes = await ctx.prisma.episode.findMany({
        where: {
          season_id: { in: input.seasonIds },
        },
      });

      const watchedObjs = episodes.map((episode: Episode) => {
        return {
          id: randomUUID(),
          episode_id: episode.id,
          user_id: input.userId,
          season_id: episode.season_id,
          timestamp: new Date(),
        } as WatchedEpisode;
      });

      return ctx.prisma.watchedEpisode.createMany({
        data: watchedObjs,
      });
    }),

  removeMovieWatchedById: publicProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchedMovie.deleteMany({
        where: {
          AND: [{ movie_id: input.movieId }, { user_id: input.userId }],
        },
      });
    }),

  removeEpisodeWatchedById: publicProcedure
    .input(z.object({ episodeId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchedEpisode.deleteMany({
        where: {
          AND: [{ episode_id: input.episodeId }, { user_id: input.userId }],
        },
      });
    }),

  removeAllEpisodesWatched: publicProcedure
    .input(z.object({ seasonIds: z.number().array(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.watchedEpisode.deleteMany({
        where: {
          AND: [
            { season_id: { in: input.seasonIds } },
            { user_id: input.userId },
          ],
        },
      });
    }),
});
