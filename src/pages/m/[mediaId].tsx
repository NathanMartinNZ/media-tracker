import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

export const mediaPage = () => {
  const router = useRouter();
  const mediaId = parseInt(router.query.mediaId as string, 10);
  if (!mediaId) {
    return;
  }
  const movie = api.movies.getMovieById.useQuery(mediaId);

  if (!movie.data) {
    return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"></main>
    );
  }

  return (
    <>
      <Head>
        <title>{movie.data.title} - Media Tracker</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            {movie.data.title}
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/"
            >
              <h3 className="text-center text-2xl font-bold">Back</h3>
            </Link>
          </div>
          <div>
            <div>
              <Image
                src={`https://image.tmdb.org/t/p/w200${movie.data.poster_path}`}
                alt={movie.data.title}
                width="200"
                height="300"
              />
              <div>
                <h2>
                  {movie.data.title} ({movie.data.release_date})
                </h2>
                {!!movie.data.genres.length &&
                  movie.data.genres.map((genre) => (
                    <div
                      key={genre}
                      className="rounded-full bg-violet-500 text-center"
                    >
                      {genre}
                    </div>
                  ))}
                <span>{movie.data.runtime}mins</span>
                <div>{movie.data.overview}</div>
                <button className="btn">Not watched</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// import { prisma } from "../../server/db"
// export async function getStaticPaths() {
//   const movies = await prisma.movie.findMany()
//   const paths = movies.map(movie => ({
//     params: { mediaId: movie.id.toString()}
//   }))
//   return {
//     paths: paths,
//     fallback: true
//   }
// }

// export async function getStaticProps(ctx:any) {
//   const movieId = parseInt(ctx.params.mediaId)
//   const movie = await prisma.movie.findUnique({
//     where: {
//       id: movieId
//     }
//   })

//   return {
//     props: { movie }
//   }
// }

export default mediaPage;
