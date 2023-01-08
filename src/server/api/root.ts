import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { moviesRouter } from "./routers/movies";
import { showsRouter } from "./routers/shows";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  movies: moviesRouter,
  shows: showsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
