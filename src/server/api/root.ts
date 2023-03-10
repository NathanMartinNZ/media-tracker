import { createTRPCRouter } from "./trpc";
import { moviesRouter } from "./routers/movies";
import { showsRouter } from "./routers/shows";
import { episodesRouter } from "./routers/episodes";
import { seasonsRouter } from "./routers/seasons";
import { watchedRouter } from "./routers/watched";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  movies: moviesRouter,
  shows: showsRouter,
  seasons: seasonsRouter,
  episodes: episodesRouter,
  watched: watchedRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
