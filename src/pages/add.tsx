import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import AddingShow from "../components/AddingShow/AddingShow";
import Link from "next/link";

const Add = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("movie");
  const [searchResults, setSearchResults] = useState<any>();
  const [currentlyAdding, setCurrentlyAdding] = useState<boolean>(false);

  const moviesAlreadyAddedByUser = api.movies.getAllByUser.useQuery(
    session?.user?.id || ""
  );
  const showsAlreadyAddedByUser = api.shows.getAllByUser.useQuery(
    session?.user?.id || ""
  );

  const addMovieById = api.movies.addMovieById.useMutation();
  const getResultMovies = api.movies.getMoviesBySearchTerm.useQuery(
    searchTerm,
    { enabled: false }
  );

  const addShowById = api.shows.addShowById.useMutation();
  const getResultShows = api.shows.getShowsBySearchTerm.useQuery(searchTerm, {
    enabled: false,
  });

  const formatDate = (date: string) => {
    if (!date) {
      return;
    }
    const d = new Date(date);
    return d.toLocaleDateString("en-uk", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm === "") {
      return;
    }
    if (selectedType == "movie") {
      const res = await getResultMovies.refetch();
      if (res.isSuccess) {
        setSearchResults(res.data);
      }
    } else if (selectedType == "show") {
      const res = await getResultShows.refetch();
      if (res.isSuccess) {
        setSearchResults(res.data);
      }
    }
    setSearchTerm("");
  };

  const handleAdd = async (id: number) => {
    if (!session) {
      return;
    }
    // Add to DB then redirect to page
    if (selectedType === "movie" && session.user) {
      const res = await addMovieById.mutateAsync({
        movieId: id,
        userId: session.user.id,
      });
      router.push(`/movie/${res.movie_id}`);
    } else if (selectedType === "show" && session.user) {
      // Display loading indicator due to having to load all seasons & episodes
      setCurrentlyAdding(true);
      const res = await addShowById.mutateAsync({
        showId: id,
        userId: session.user.id,
      });
      router.push(`/show/${res.show_id}`);
    }
  };

  const alreadyAddedByUser = (id: number) => {
    if (
      !moviesAlreadyAddedByUser.isSuccess ||
      !showsAlreadyAddedByUser.isSuccess
    ) {
      return false;
    }

    // Check if movie or show already added by user to disable button
    const movieMatch = moviesAlreadyAddedByUser.data.find(
      (movie) => movie.id === id
    );
    const showMatch = showsAlreadyAddedByUser.data.find(
      (show) => show.id === id
    );

    return movieMatch || showMatch;
  };

  return (
    <>
      <Head>
        <title>Add | Media Tracker</title>
        <meta name="description" content="Add movie or show" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 pt-8 pb-16">
          <div className="w-full gap-4 lg:max-w-3xl">
            <Link
              className="mx-auto flex w-32 flex-col gap-4 rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 lg:mx-0"
              href="/"
            >
              <h3 className="text-1xl text-center font-bold">Homepage</h3>
            </Link>
          </div>
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Add</span> Movie or Show
          </h1>
          <div>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-wrap gap-2 lg:flex-row"
            >
              <input
                type="search"
                className="w-full rounded-xl bg-slate-700 px-3 py-3 font-semibold text-white no-underline transition hover:bg-slate-600 md:w-auto"
                name="addSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="grow rounded-xl bg-slate-700 px-3 py-3 text-center font-semibold text-white no-underline transition hover:bg-slate-600 md:w-auto"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-white/10 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Search
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {searchResults &&
              searchResults.results &&
              searchResults.results.map((result: any) => (
                <div key={result.id} className="max-w-[200px]">
                  <div className="dhover:bg-gray-700 card rounded-xl bg-gray-800 text-white shadow-xl">
                    {result.poster_path && (
                      <figure>
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                          alt={result.title || result.name}
                          width="200"
                          height="300"
                          sizes="100vw"
                          placeholder="blur"
                          blurDataURL="/plh-153-230.png"
                          className="h-auto w-[200px]"
                        />
                      </figure>
                    )}
                    <div className="card-body p-4">
                      <h2 className="card-title text-base md:text-lg">
                        {result.title || result.name}
                      </h2>
                      <div className="pb-2">
                        Air date:{" "}
                        {formatDate(result.release_date) ||
                          formatDate(result.first_air_date)}
                      </div>
                      <div className="card-actions">
                        {alreadyAddedByUser(result.id) ? (
                          <button
                            disabled
                            className="btn-primary btn border-none"
                            onClick={() => handleAdd(result.id)}
                          >
                            Added
                          </button>
                        ) : (
                          <button
                            className="btn-primary btn border-none"
                            onClick={() => handleAdd(result.id)}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {currentlyAdding && <AddingShow />}
        </div>
      </main>
    </>
  );
};

export default Add;
