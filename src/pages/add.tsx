import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import AddingShow from "../components/AddingShow/AddingShow";
import Link from "next/link";

const Add = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("movie");
  const [searchResults, setSearchResults] = useState<any>();
  const [currentlyAdding, setCurrentlyAdding] = useState<boolean>(false);

  const moviesAlreadyAdded = api.movies.getAll.useQuery();
  const showsAlreadyAdded = api.shows.getAll.useQuery();

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
    // Add to DB then redirect to page
    if (selectedType === "movie") {
      const res = await addMovieById.mutateAsync(id);
      router.push(`/movie/${res.id}`);
    } else if (selectedType === "show") {
      // Display loading indicator due to having to load all seasons & episodes
      setCurrentlyAdding(true);
      const res = await addShowById.mutateAsync(id);
      router.push(`/show/${res.id}`);
    }
  };

  const alreadyAdded = (id: number) => {
    if (!moviesAlreadyAdded.isSuccess || !showsAlreadyAdded.isSuccess) {
      return false;
    }

    // Check if movie or show already added to disable button
    const movieMatch = moviesAlreadyAdded.data.find((movie) => movie.id === id);
    const showMatch = showsAlreadyAdded.data.find((show) => show.id === id);

    return movieMatch || showMatch;
  };

  return (
    <>
      <Head>
        <title>Add | Media Tracker</title>
        <meta name="description" content="Add movie or show" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 pt-8 pb-16">
          <div className="w-full gap-4 lg:max-w-3xl">
            <Link
              className="mx-auto flex w-32 flex-col gap-4 rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 lg:mx-0"
              href="/"
            >
              <h3 className="text-1xl text-center font-bold">Homepage</h3>
            </Link>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Add</span> Movie or Show
          </h1>
          <div>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-wrap gap-2 lg:flex-row"
            >
              <input
                type="search"
                className="rounded px-3 py-3"
                name="addSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="rounded px-3"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
              <button type="submit" className="btn py-4">
                Search
              </button>
            </form>
          </div>
          <div className="w-full lg:flex lg:max-w-3xl lg:flex-wrap lg:gap-8">
            {searchResults &&
              searchResults.results &&
              searchResults.results.map((result: any) => (
                <div
                  key={result.id}
                  className="relative mb-8 w-full gap-2 lg:flex lg:flex-row lg:gap-8"
                >
                  <div className="flex hidden w-[100px] shrink-0 lg:block">
                    {result.poster_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                        alt={result.title || result.name}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="h-auto w-[100px] rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex flex-col lg:gap-4">
                    <h3 className="text-1xl font-medium text-white lg:mr-8 lg:text-2xl">
                      {result.title || result.name}
                    </h3>
                    <div>
                      Air date:{" "}
                      {formatDate(result.release_date) ||
                        formatDate(result.first_air_date)}
                    </div>
                    <div className="hidden lg:block">{result.overview}</div>
                  </div>
                  <div className="flex-1 gap-4">
                    {alreadyAdded(result.id) ? (
                      <button
                        disabled
                        className="btn absolute top-0 right-0 bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => handleAdd(result.id)}
                      >
                        Added
                      </button>
                    ) : (
                      <button
                        className="btn absolute top-0 right-0 bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => handleAdd(result.id)}
                      >
                        Add
                      </button>
                    )}
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
