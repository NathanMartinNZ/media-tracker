import { useRouter } from "next/router"
import { api } from "../../utils/api";

export const mediaPage = () => {
  const router = useRouter()
  const mediaId = parseInt(router.query.mediaId as string, 10)
  if(!mediaId) { return }
  const movie = api.movies.getMovieById.useQuery(mediaId)

  return (
    <div>
        {JSON.stringify(movie)}
    </div>
  )
};

export default mediaPage;