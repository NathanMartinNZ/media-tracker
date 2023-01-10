import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios"
import { Movie } from "@prisma/client";

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
    }),
  
  getMoviesBySearchTerm: publicProcedure.input(String).query(({ input }) => {
    const fetchMovies = async () => {
      const movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_CLIENT_API}&language=en-US&page=1&include_adult=false&query=${input}`)
      return movies.data
    }
    return fetchMovies()
  }),

  addMovieById: publicProcedure
    .input(Number)
    .mutation(async ({ input, ctx }) => {
      // Fetch movie from TMDB
      const fetchMovie:any = async () => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${input}?api_key=${process.env.TMDB_CLIENT_API}&language=en-US`)
        // console.log(res.data)
        return res.data
      }
      const movieRaw = await fetchMovie()

      console.log(movieRaw)

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
        title: movieRaw.title,
        watched: false
      }

      // Add movie to DB
      return ctx.prisma.movie.create({
        data: movieClean
      })
    }),
});
