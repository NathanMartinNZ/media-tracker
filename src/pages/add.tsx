import Head from "next/head"
import Link from "next/link"
import React, { useRef } from "react"

const Add = () => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!searchInputRef.current) { return }
    console.log(searchInputRef.current.value)
    // TODO: Call API to retrieve search results
    searchInputRef.current.value = ""
  }

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
              <input type="search" name="addSearch" ref={searchInputRef} />
              <button type="submit" className="btn">Search</button>
            </form>
          </div>
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-3 gap-10 text-white">

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Add;
