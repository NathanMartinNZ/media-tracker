import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import Loading from "../../components/Loading"

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      movieId: ctx.params.movieId
    },
  };
}
 
export const MoviePage = ({ movieId }: { movieId: number }) => {
  const { data: session } = useSession()
  const movie = api.movies.getMovieById.useQuery(movieId);
  const movieWatchedMutation = api.watched.addMovieWatchedById.useMutation();
  const movieNotWatchedMutation = api.watched.removeMovieWatchedById.useMutation();
  const watchedMovie = api.watched.getWatchedMovieById.useQuery({ movieId: Math.floor(movieId), userId: session?.user?.id || "" })

  if (!movie.data || !session) { return <Loading />; }

  const displayYear = (date: string) => {
    const d = new Date(date);
    return d.getFullYear();
  };

  const handleWatched = async (watched: boolean) => {
    if (!movie.data || !session.user) {
      return;
    }
    if(!watched) {
      // Add movie watched for user to DB
      await movieWatchedMutation.mutateAsync({
        movieId: movie.data.id,
        userId: session.user.id,
      });
    } else {
      // Remove movie watched for user from DB
      await movieNotWatchedMutation.mutateAsync({
        movieId: movie.data.id,
        userId: session.user.id,
      });
    }
    // Refetch to get updated watched state
    watchedMovie.refetch();
  };

  return (
    <>
      <Head>
        <title>{movie.data.title} - Media Tracker</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-8">
          <div className="w-full gap-4 lg:max-w-3xl">
            <Link
              className="mx-auto flex w-32 flex-col gap-4 rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 lg:mx-0"
              href="/"
            >
              <h3 className="text-1xl text-center font-bold">Homepage</h3>
            </Link>
          </div>
          <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:gap-8">
            <div className="flex justify-center self-start lg:flex-none">
              {movie.data.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movie.data.poster_path}`}
                  alt={movie.data.title}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="mb-4 h-auto w-[200px] rounded lg:mb-0"
                  priority
                />
              )}
            </div>
            <div className="flex flex-col gap-4 text-white">
              <h1 className="text-3xl font-medium lg:text-5xl">
                {movie.data.title}
                {movie.data.release_date && (
                  <span className="font-light">
                    {" "}({displayYear(movie.data.release_date)})
                  </span>
                )}
              </h1>
              <div
                className={`flex flex-row gap-2 ${
                  !!movie.data.genres.length ? "" : "hidden"
                }`}
              >
                {!!movie.data.genres.length &&
                  movie.data.genres.map((genre) => (
                    <div
                      key={genre}
                      className="flex items-center rounded-full bg-violet-500 px-2 py-1 text-center text-xs"
                    >
                      {genre}
                    </div>
                  ))}
              </div>
              <span>{movie.data.runtime} mins</span>
              <div>{movie.data.overview}</div>
              <div className="grow-0">
                {watchedMovie.isSuccess && watchedMovie.data.length ? (
                  <button
                    className="btn bg-teal-500 hover:bg-teal-600 dark:text-white"
                    onClick={() => handleWatched(true)}
                  >
                    Watched ✓
                  </button>
                ) : (
                  <button className="btn" onClick={() => handleWatched(false)}>
                    Not watched
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MoviePage;
