import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios";
import { AddedShow, Show } from "@prisma/client";
import { fetchShowData, fetchSeasonsAndEpisodesData } from "../helpers/fetchRawData"
import { randomUUID } from "crypto";

export const showsRouter = createTRPCRouter({
  getAllByUser: publicProcedure.input(String).query(({ input, ctx }) => {
    return ctx.prisma.show.findMany({
      where: {
        added: {
          some: {
            user_id: {
              equals: input
            }
          }
        }
      }
    });
  }),

  getShowById: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.show.findUnique({
      where: {
        id: input,
      },
    });
  }),

  getShowsBySearchTerm: publicProcedure.input(String).query(async ({ input }) => {
    const fetchShows = async () => {
      const shows = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_CLIENT_API}&language=en-US&page=1&include_adult=false&query=${input}`)
      return shows.data
    }
    const showsData = await fetchShows()
    return showsData
  }),

  addShowById: publicProcedure
    .input(z.object({ showId: z.number(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const showAlreadyAdded = await ctx.prisma.show.findUnique({
        where: {
          id: input.showId
        }
      })
      if(!showAlreadyAdded) {
        // Fetch show from TMDB
        const showData:any = await fetchShowData(input.showId)
        // Fetch seasons & episodes from TMDB
        const seasonsAndEpisodesData:any = await fetchSeasonsAndEpisodesData(showData.season_numbers, showData.show.id)
  
        // Create show
        await ctx.prisma.show.create({
          data: showData.show
        })
        // Create all seasons
        if(seasonsAndEpisodesData.seasons.length) {
          await ctx.prisma.season.createMany({
            data: seasonsAndEpisodesData.seasons,
            skipDuplicates: true
          })
        }
        // Create all episodes
        if(seasonsAndEpisodesData.episodes.length) {
          await ctx.prisma.episode.createMany({
            data: seasonsAndEpisodesData.episodes,
            skipDuplicates: true
          })
        }
      }

      // Add show to User AddedShow model in DB
      const userAddedShow = await ctx.prisma.addedShow.create({
        data: {
          id: randomUUID(),
          show_id: input.showId,
          user_id: input.userId,
          timestamp: new Date()
        } as AddedShow
      })

      return userAddedShow
    }),
});
