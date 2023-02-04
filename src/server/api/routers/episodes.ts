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

  getEpisodesByShowId: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.episode.findMany({
      where: {
        show_id: input,
      },
    });
  })
});
