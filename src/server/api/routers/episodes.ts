import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const episodesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.episode.findMany();
  }),

  getEpisodeById: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.episode.findUnique({
      where: {
        id: input,
      },
    });
  }),

  getEpisodesBySeasonId: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.episode.findMany({
      where: {
        season_id: input,
      },
    });
  }),

  setEpisodeWatchedById: publicProcedure
    .input(z.object({ id: z.number(), watched: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.episode.update({
        where: {
          id: input.id
        },
        data: {
          watched: input.watched
        }
      })
    })
});
