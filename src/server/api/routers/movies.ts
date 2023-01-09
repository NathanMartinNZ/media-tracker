import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios"

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
  })
});
