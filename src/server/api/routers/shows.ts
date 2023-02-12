import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios";
import { AddedShow, Episode, Season, Show } from "@prisma/client";
import {
  fetchShowData,
  fetchSeasonsAndEpisodesData,
} from "../helpers/fetchRawData";
import { randomUUID } from "crypto";

export const showsRouter = createTRPCRouter({
  getAllByUser: publicProcedure.input(String).query(({ input, ctx }) => {
    return ctx.prisma.show.findMany({
      where: {
        added: {
          some: {
            user_id: {
              equals: input,
            },
          },
        },
      },
    });
  }),

  getShowById: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.show.findUnique({
      where: {
        id: input,
      },
    });
  }),

  getShowsBySearchTerm: publicProcedure
    .input(String)
    .query(async ({ input }) => {
      const fetchShows = async () => {
        const shows = await axios.get(
          `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_CLIENT_API}&language=en-US&page=1&include_adult=false&query=${input}`
        );
        return shows.data;
      };
      const showsData = await fetchShows();
      return showsData;
    }),

  addShowById: publicProcedure
    .input(z.object({ showId: z.number(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const showAlreadyAdded = await ctx.prisma.show.findUnique({
        where: {
          id: input.showId,
        },
      });
      if (!showAlreadyAdded) {
        // Fetch show from TMDB
        const showData: { show: Show; season_numbers: number[] } =
          await fetchShowData(input.showId);
        // Fetch seasons & episodes from TMDB
        const seasonsAndEpisodesData: {
          seasons: Season[];
          episodes: Episode[];
        } = await fetchSeasonsAndEpisodesData(
          showData.season_numbers,
          showData.show.id
        );

        // Create show
        await ctx.prisma.show.create({
          data: showData.show,
        });
        // Create all seasons
        if (seasonsAndEpisodesData.seasons.length) {
          await ctx.prisma.season.createMany({
            data: seasonsAndEpisodesData.seasons,
            skipDuplicates: true,
          });
        }
        // Create all episodes
        if (seasonsAndEpisodesData.episodes.length) {
          await ctx.prisma.episode.createMany({
            data: seasonsAndEpisodesData.episodes,
            skipDuplicates: true,
          });
        }
      }

      // Add show to User AddedShow model in DB
      const userAddedShow = await ctx.prisma.addedShow.create({
        data: {
          id: randomUUID(),
          show_id: input.showId,
          user_id: input.userId,
          timestamp: new Date(),
        } as AddedShow,
      });

      return userAddedShow;
    }),

  removeShowForUser: publicProcedure
    .input(z.object({ showId: z.number(), userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.addedShow.deleteMany({
        where: {
          show_id: input.showId,
          user_id: input.userId,
        },
      });
    }),

  checkShowForUpdates: publicProcedure
    .input(z.object({ pw: z.string() }))
    .query(({ input, ctx }) => {
      // Stop if pw is incorrect
      if (input.pw !== process.env.EXTERNAL_HOST_PW) {
        return { message: "Failed to authenticate" };
      }

      // Run non-blocking tasks
      setTimeout(async () => {
        // Get all shows
        const shows = await ctx.prisma.show.findMany();
        const seasons = await ctx.prisma.season.findMany();
        const episodes = await ctx.prisma.episode.findMany();

        // Set map for seasons & episodes for later checking
        const seasonsMap: Map<number, boolean> = new Map();
        for (const season of seasons) {
          seasonsMap.set(season.id, true);
        }
        const episodesMap: Map<number, boolean> = new Map();
        for (const episode of episodes) {
          episodesMap.set(episode.id, true);
        }

        // Loop through all shows to create new seasons & episodes
        for (const show of shows) {
          // Fetch show from TMDB
          const latestShowData: { show: Show; season_numbers: number[] } =
            await fetchShowData(show.id);

          // Skip if no new seasons or episodes
          if (
            show.number_of_seasons === latestShowData.show.number_of_seasons &&
            show.number_of_episodes === latestShowData.show.number_of_episodes
          ) {
            continue;
          }

          const latestSeasonsAndEpisodesData: {
            seasons: Season[];
            episodes: Episode[];
          } = await fetchSeasonsAndEpisodesData(
            latestShowData.season_numbers,
            latestShowData.show.id
          );
          // New seasons & episodes to be created
          const newSeasons = latestSeasonsAndEpisodesData.seasons.filter(
            (latestSeason: Season) => !seasonsMap.get(latestSeason.id)
          );
          const newEpisodes = latestSeasonsAndEpisodesData.episodes.filter(
            (latestEpisode: Episode) => !episodesMap.get(latestEpisode.id)
          );
          // Create new seasons if any
          if (newSeasons.length) {
            await ctx.prisma.season.createMany({
              data: newSeasons,
            });
          }
          // Create new episodes if any
          if (newEpisodes.length) {
            await ctx.prisma.episode.createMany({
              data: newEpisodes,
            });
          }
          // Update show if new seasons or episodes created
          if (newSeasons.length || newEpisodes.length) {
            await ctx.prisma.show.update({
              where: { id: show.id },
              data: latestShowData.show,
            });
          }
        }
      }, 0);

      // Return response straight away
      return { message: "Job started" };
    }),
});
