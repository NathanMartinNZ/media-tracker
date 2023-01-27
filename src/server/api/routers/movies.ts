import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios"
import { AddedMovie, Movie } from "@prisma/client";
import { randomUUID } from "crypto";

export const moviesRouter = createTRPCRouter({
  getAllByUser: publicProcedure.input(String).query(({ input, ctx }) => {
    return ctx.prisma.movie.findMany({
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

  getMovieById: publicProcedure.input(Number).query(({ input, ctx }) => {
    return ctx.prisma.movie.findUnique({
      where: {
        id: input,
      },
    });
  }),

  getMoviesBySearchTerm: publicProcedure.input(String).query(async ({ input }) => {
    const fetchMovies = async () => {
      const movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_CLIENT_API}&language=en-US&page=1&include_adult=false&query=${input}`)
      return movies.data
    }
    const moviesData = await fetchMovies()
    return moviesData
  }),

  addMovieById: publicProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const movieAlreadyAdded = await ctx.prisma.movie.findUnique({
        where: {
          id: input.movieId
        }
      })
      if(!movieAlreadyAdded) {
        // Fetch movie from TMDB
        const fetchMovie:any = async () => {
          const res = await axios.get(`https://api.themoviedb.org/3/movie/${input.movieId}?api_key=${process.env.TMDB_CLIENT_API}&language=en-US`)
          return res.data
        }
        const movieRaw = await fetchMovie()

        // Parse movie obj to pull only relevant data
        const movieClean:Movie = {
          id: movieRaw.id,
          media_type: "movie",
          imdb_id: movieRaw.imdb_id,
          genres: movieRaw.genres.map((genre:any) => genre.name),
          original_language: movieRaw.original_language,
          original_title: movieRaw.original_title,
          overview: movieRaw.overview,
          popularity: movieRaw.popularity,
          backdrop_path: movieRaw.backdrop_path,
          poster_path: movieRaw.poster_path,
          release_date: movieRaw.release_date,
          runtime: movieRaw.runtime,
          spoken_languages: movieRaw.spoken_languages.map((lang:any) => lang.iso_639_1),
          status: movieRaw.status,
          tagline: movieRaw.tagline,
          title: movieRaw.title
        }
  
        // Add movie to DB
        await ctx.prisma.movie.create({
          data: movieClean
        })
      }

      // Add movie to User AddedMovie model in DB
      const userAddedMovie = await ctx.prisma.addedMovie.create({
        data: {
          id: randomUUID(),
          movie_id: input.movieId,
          user_id: input.userId,
          timestamp: new Date()
        } as AddedMovie
      })

      return userAddedMovie
    }),

  removeMovieForUser: publicProcedure.input(z.object({ movieId: z.number(), userId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.addedMovie.deleteMany({
      where: {
        movie_id: input.movieId,
        user_id: input.userId
      }
    });
  }),
});
