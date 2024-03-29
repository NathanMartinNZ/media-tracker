import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Episode, Season, WatchedEpisode } from "@prisma/client";
import SeasonTile from "../../components/SeasonTile";
import { formatDate } from "../../../src/helpers/index";

const Loading = () => {
  return <main className="flex min-h-screen flex-col items-center"></main>;
};

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      showId: ctx.params.showId,
    },
  };
}

export const ShowPage = ({ showId }: { showId: number }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const show = api.shows.getShowById.useQuery(showId);
  const seasons = api.seasons.getSeasonsByShowId.useQuery(showId);
  const episodes = api.episodes.getEpisodesByShowId.useQuery(showId);
  const watchedEpisodes = api.watched.getWatchedEpisodesByShowId.useQuery({
    showId: Math.floor(showId),
    userId: session?.user?.id || "",
  });
  const removeShowForUser = api.shows.removeShowForUser.useMutation();
  const hasWatchedAllEpisodes = api.watched.hasWatchedAllEpisodes.useQuery({
    showId: Math.floor(showId),
    userId: session?.user?.id ?? "",
  });
  const addAllEpisodesWatched = api.watched.addAllEpisodesWatched.useMutation();
  const removeAllEpisodesWatched =
    api.watched.removeAllEpisodesWatched.useMutation();

  if (!show.data || !session) {
    return <Loading />;
  }

  const sortedSeasons = (unsortedSeasons: Season[]) => {
    return unsortedSeasons.sort((a, b) =>
      a.season_number > b.season_number ? 1 : -1
    );
  };

  const allEpisodesWatched = () => {
    return hasWatchedAllEpisodes.data ? hasWatchedAllEpisodes.data : false;
  };

  const refetchWatchedEpisodes = () => {
    watchedEpisodes.refetch();
    hasWatchedAllEpisodes.refetch();
  };

  const handleRemoveShowForUser = async () => {
    if (!show.data || !session.user) {
      return;
    }
    await removeShowForUser.mutateAsync({
      showId: Math.floor(showId),
      userId: session.user.id,
    });
    router.push(`/`);
  };

  const handleAddAllEpisodesWatched = async () => {
    if (!seasons.data || !session.user) {
      return;
    }
    await addAllEpisodesWatched.mutateAsync({
      showId: Math.floor(showId),
      userId: session.user.id,
    });
    hasWatchedAllEpisodes.refetch();
    refetchWatchedEpisodes();
  };

  const handleRemoveAllEpisodesWatched = async () => {
    if (!seasons.data || !session.user) {
      return;
    }
    await removeAllEpisodesWatched.mutateAsync({
      seasonIds: seasons.data.map((s: Season) => s.id),
      userId: session.user.id,
    });
    hasWatchedAllEpisodes.refetch();
    refetchWatchedEpisodes();
  };

  return (
    <>
      <Head>
        <title>{show.data.title} - Media Tracker</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-8">
          <div className="flex w-full gap-4 lg:max-w-3xl">
            <Link
              className="mx-auto flex w-32 flex-col gap-4 rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 lg:mx-0"
              href="/"
            >
              <h3 className="text-1xl text-center font-bold">Homepage</h3>
            </Link>
          </div>
          <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:gap-8">
            <div className="flex justify-center self-start lg:flex-none">
              {show.data.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w200${show.data.poster_path}`}
                  alt={show.data.title}
                  width="200"
                  height="300"
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL="/plh-153-230.png"
                  className="mb-4 h-auto w-[200px] rounded-lg lg:mb-0"
                  priority
                />
              )}
            </div>
            <div className="flex flex-col gap-4 text-white">
              <h1 className="font-mediu text-3xl lg:text-5xl">
                {show.data.title}
              </h1>
              <div
                className={`flex flex-row gap-2 ${
                  !!show.data.genres.length ? "" : "hidden"
                }`}
              >
                {!!show.data.genres.length &&
                  show.data.genres.map((genre) => (
                    <div
                      key={genre}
                      className="flex items-center rounded-full bg-violet-500 px-2 py-1 text-center text-xs"
                    >
                      {genre}
                    </div>
                  ))}
              </div>
              {show.data.first_air_date && show.data.last_air_date && (
                <div className="flex flex-col gap-1">
                  <span>
                    First air date: {formatDate(show.data.first_air_date)}
                  </span>
                  <span>
                    Last air date: {formatDate(show.data.last_air_date)}
                  </span>
                </div>
              )}
              <div>{show.data.overview}</div>
              <div className="flex grow-0 gap-4">
                {allEpisodesWatched() ? (
                  <button
                    onClick={handleRemoveAllEpisodesWatched}
                    className="btn bg-teal-500 hover:bg-teal-600 dark:text-white"
                  >
                    Watched ✓
                  </button>
                ) : (
                  <button onClick={handleAddAllEpisodesWatched} className="btn">
                    Set All As Watched
                  </button>
                )}
                <span
                  onClick={() => handleRemoveShowForUser()}
                  className="flex grow items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-trash3 text-slate-400"
                    viewBox="0 0 16 16"
                    style={{ cursor: "pointer", opacity: 0.5 }}
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-4">
            {seasons.data &&
              episodes.data &&
              watchedEpisodes.data &&
              sortedSeasons(seasons.data).map((season) => (
                <SeasonTile
                  key={season.id}
                  season={season}
                  episodes={episodes.data.filter(
                    (ep: Episode) => ep.season_id === season.id
                  )}
                  watchedEpisodes={watchedEpisodes.data.filter(
                    (wep: WatchedEpisode) => wep.season_id === season.id
                  )}
                  refetchWatchedEpisodes={refetchWatchedEpisodes}
                />
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ShowPage;
