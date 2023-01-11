import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios";
import { Show } from "@prisma/client";
import { fetchShowData, fetchSeasonsData } from "../helpers/fetchRawData"

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
    }),

  getShowsBySearchTerm: publicProcedure.input(String).query(async ({ input }) => {
    const fetchShows = async () => {
      const shows = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_CLIENT_API}&language=en-US&page=1&include_adult=false&query=${input}`)
      return shows.data
    }
    const showsData = await fetchShows()
    console.log(showsData)
    return showsData
  }),

  addShowById: publicProcedure
    .input(Number)
    .mutation(async ({ input, ctx }) => {
      // Fetch show from TMDB
      const showData:any = await fetchShowData(input)
      // Fetch seasons & episodes from TMDB
      const seasonsData:any = await fetchSeasonsData(showData.season_numbers, showData.show.id)

      // Create show
      const createShow = await ctx.prisma.show.create({
        data: showData.show
      })
      // Create all seasons
      if(seasonsData.length) {
        await ctx.prisma.season.createMany({
          data: seasonsData,
          skipDuplicates: true
        })
      }

      return createShow
    }),
});
