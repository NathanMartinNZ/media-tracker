import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Movie, Show } from "@prisma/client";
import Filters from "../components/Filters"
import { filterMedia } from "../helpers/index"
import { useMemo, useState } from "react";


const Home: NextPage = () => {
  const { data: session } = useSession();
  const movies = api.movies.getAllByUser.useQuery(session?.user?.id || "");
  const shows = api.shows.getAllByUser.useQuery(session?.user?.id || "");
  const [ filters, setFilters ] = useState({
    typeOfMedia: "both",
    watched: "both"
  });
  const filteredMedia = useMemo(() => filterMedia({movies, shows}, filters), [movies, shows, filters])

  const getUrl = (media: Movie | Show) => {
    if (media.media_type == "movie") {
      return `/movie/${media.id}`;
    } else {
      return `/show/${media.id}`;
    }
  };

  return (
    <>
      <Head>
        <title>Media Tracker</title>
        <meta name="description" content="Personal media tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-fit flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Media</span> Tracker
          </h1>
          <div className="flex p-4 gap-4">
            {filteredMedia && filteredMedia.length > 0 && <Filters filters={filters} setFilters={setFilters} />}
            <Link
              className="rounded-xl bg-white/10 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              href="/add"
            >
              Add
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {movies &&
              shows &&
              movies.isSuccess &&
              shows.isSuccess &&
              filteredMedia &&
              filteredMedia.map((media:Movie|Show) => (
                <div key={media.id} className="max-w-[200px]">
                  <div className="card rounded-xl bg-gray-300 hover:bg-gray-200 shadow-xl dark:bg-gray-800 dark:hover:bg-gray-700">
                    {media.poster_path && (
                      <figure>
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                          alt={media.title}
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="w-[200px] h-auto"
                        />
                      </figure>
                    )}
                    <div className="card-body p-4">
                      <h2 className="card-title text-base md:text-lg">
                        {media.title}
                      </h2>
                      <div className="card-actions justify-start">
                        <Link
                          href={getUrl(media)}
                          className="btn btn-primary text-sm border-none"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
