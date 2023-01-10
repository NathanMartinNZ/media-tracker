import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../utils/api";

const Add = () => {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("movie");
  const [searchResults, setSearhResults] = useState<any>();

  const addMovieById = api.movies.addMovieById.useMutation()
  const getResultMovies = api.movies.getMoviesBySearchTerm.useQuery(
    searchTerm,
    { enabled: false }
  );

  useEffect(() => {
    // Set searchResultData
    if (getResultMovies.isSuccess) {
      setSearhResults(() => getResultMovies.data);
    }
  }, [getResultMovies]);

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm === "") {
      return;
    }
    if (selectedType == "movie") {
      await getResultMovies.refetch();
    }
    setSearchTerm("");
  };

  const handleAddMovie = async (id: number) => {
    // Add movie to DB
    await addMovieById.mutateAsync(id)
    // Redirect to homepage
    router.push("/")
  };

  return (
    <>
      <Head>
        <title>Add | Media Tracker</title>
        <meta name="description" content="Add movie or show" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Add Movie or Show</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 ">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="search"
                name="addSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
              <button type="submit" className="btn">
                Search
              </button>
            </form>
          </div>
          <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-8">
            {searchResults &&
              searchResults.results &&
              searchResults.results.map((result: any) => (
                <div
                  key={result.id}
                  className="max-w-xl gap-2 lg:flex lg:max-w-3xl lg:flex-row lg:gap-8"
                >
                  <div className="flex justify-center self-start lg:flex-none">
                    {result.poster_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                        alt={result.title}
                        width="100"
                        height="150"
                        className="mb-4 lg:mb-0"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-1xl font-medium text-white lg:text-2xl">
                      {result.title}
                    </h3>
                    <div>Air date: {result.release_date}</div>
                    <div>{result.overview}</div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grow-0">
                      <button
                        className="btn bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => handleAddMovie(result.id)}
                      >
                        Add
                      </button>
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

export default Add;
