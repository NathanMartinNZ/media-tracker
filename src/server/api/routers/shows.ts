import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const showsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.show.findMany();
  }),

  getShowById: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.show.findUnique({
      where: {
        id: input,
      },
    });
  }),

  setShowWatchedById: publicProcedure
    .input(z.object({ id: z.number(), watched: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.show.update({
        where: {
          id: input.id
        },
        data: {
          watched: input.watched
        }
      })
    })
});
