import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const seasonsRouter = createTRPCRouter({
  getSeasonsByShowId: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.season.findMany({
      where: {
        show_id: input,
      },
    });
  })
});
