import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { Season } from "@prisma/client";
import SeasonTile from "../../components/SeasonTile";
import { formatDate } from "../../../src/helpers/index";

const Loading = () => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"></main>
  );
}

export async function getServerSideProps(ctx:any) {
  return {
    props: {
      showId: ctx.params.showId
    }
  };
}

export const ShowPage = ({ showId }:{ showId:number }) => {
  const show = api.shows.getShowById.useQuery(showId);
  const seasons = api.seasons.getSeasonsByShowId.useQuery(showId);

  const sortedSeasons = (unsortedSeasons: Season[]) => {
    return unsortedSeasons.sort((a, b) =>
      a.season_number > b.season_number ? 1 : -1
    );
  };

  const allEpisodesWatched = () => {
    // TODO: Return true if all episodes are set to watched
    return false
  }

  if (!show.data) { return <Loading /> }

  return (
    <>
      <Head>
        <title>{show.data.title} - Media Tracker</title>
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
              {show.data.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w200${show.data.poster_path}`}
                  alt={show.data.title}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="rounded mb-4 lg:mb-0 w-[200px] h-auto"
                  priority
                />
              )}
            </div>
            <div className="flex flex-col gap-4 text-white">
              <h1 className="text-3xl font-mediu lg:text-5xl">
                {show.data.title}
              </h1>
              <div className={`flex flex-row gap-2 ${!!show.data.genres.length ? "" : "hidden"}`}>
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
              <div className="grow-0">
                {allEpisodesWatched() ? (
                  <button
                    className="btn bg-teal-500 hover:bg-teal-600 dark:text-white"
                  >
                    Watched ✓
                  </button>
                ) : (
                  <button
                    className="btn"
                  >
                    Not watched
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-4">
            {seasons.data &&
              sortedSeasons(seasons.data).map((season) => (
                <SeasonTile key={season.id} season={season} />
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ShowPage;
