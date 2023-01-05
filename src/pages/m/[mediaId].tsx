import { useRouter } from "next/router"
import { api } from "../../utils/api";
import { prisma } from "../../server/db"

export const mediaPage = ({ movie }:{ movie:any }) => {
  // const router = useRouter()
  // const mediaId = parseInt(router.query.mediaId as string, 10)
  // if(!mediaId) { return }
  // const movie = api.movies.getMovieById.useQuery(mediaId)

  return (
    <div>
        {JSON.stringify(movie)}
    </div>
  )
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps(ctx:any) {
  const movieId = parseInt(ctx.params.mediaId)
  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId
    }
  })

  return {
    props: { movie }
  }
}

export default mediaPage;