import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useState, useEffect } from "react";
import { Season } from "@prisma/client"
import SeasonTile from "../../components/SeasonTile";

export const showPage = () => {
  const router = useRouter();
  const showId = parseInt(router.query.showId as string, 10);
  if (!showId) {
    return;
  }
  const show = api.shows.getShowById.useQuery(showId);
  const showWatchedMutation = api.shows.setShowWatchedById.useMutation();
  const seasons = api.seasons.getSeasonsByShowId.useQuery(showId);

  const sortedSeasons = (unsortedSeasons:Season[]) => {
    return unsortedSeasons.sort((a, b) => (a.season_number > b.season_number) ? 1 : -1)
  }

  const handleShowWatched = async (watched:boolean) => {
    if (!show.data) {
      return;
    }
    // Update movie in DB to watched
    await showWatchedMutation.mutateAsync({
      id: show.data.id,
      watched: watched,
    });
    // Refetch movie to get correct watched state
    show.refetch();
  };

  if (!show.data) {
    return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"></main>
    );
  }

  return (
    <>
      <Head>
        <title>{show.data.title} - Media Tracker</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/"
            >
              <h3 className="text-center text-2xl font-bold">Homepage</h3>
            </Link>
          </div>
          <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:gap-8">
            <div className="flex justify-center self-start lg:flex-none">
              <Image
                src={`https://image.tmdb.org/t/p/w200${show.data.poster_path}`}
                alt={show.data.title}
                width="200"
                height="300"
                className="mb-4 lg:mb-0"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-medium text-white lg:text-5xl">
                {show.data.title}
              </h1>
              <div className="flex flex-row gap-2">
                {!!show.data.genres.length &&
                  show.data.genres.map((genre) => (
                    <div
                      key={genre}
                      className="rounded-full bg-violet-500 px-2 text-center text-white"
                    >
                      {genre}
                    </div>
                  ))}
              </div>
              <span>First air date: {show.data.first_air_date}</span>
              <span>Last air date: {show.data.last_air_date}</span>
              <div>{show.data.overview}</div>
              <div className="grow-0">
                {show.data.watched ? (
                  <button
                    className="btn bg-purple-800 hover:bg-purple-900"
                    onClick={() => handleShowWatched(false)}
                  >
                    Watched ✓
                  </button>
                ) : (
                  <button className="btn" onClick={() => handleShowWatched(true)}>
                    Not watched
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-8">
            {seasons.data &&
              sortedSeasons(seasons.data).map((season) => <SeasonTile season={season} />)}
          </div>
        </div>
      </main>
    </>
  );
};

export default showPage;
