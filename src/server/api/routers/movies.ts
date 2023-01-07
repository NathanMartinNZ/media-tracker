import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const moviesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany();
  }),

  getMovieById: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.movie.findUnique({
      where: {
        id: input,
      },
    });
  }),

  setMovieWatchedById: publicProcedure
    .input(z.object({ id: z.number(), watched: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.movie.update({
        where: {
          id: input.id
        },
        data: {
          watched: input.watched
        }
      })
    })
});
