import { Season, WatchedEpisode } from "@prisma/client";
import { Episode } from "@prisma/client";
import { api } from "../utils/api";
import Image from "next/image";
import EpisodeTile from "./EpisodeTile";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading"

const SeasonTile = ({ season }: { season: Season }) => {
  const { data: session } = useSession()
  const episodes = api.episodes.getEpisodesBySeasonId.useQuery(season.id);
  const episodeWatchedMutation = api.watched.addEpisodeWatchedById.useMutation();
  const episodeNotWatchedMutation = api.watched.removeEpisodeWatchedById.useMutation();
  const watchedEpisodes = api.watched.getWatchedEpisodesBySeasonId.useQuery({ seasonId: Math.floor(season.id), userId: session?.user?.id || "" })

  const [ showEpisodes, setShowEpisodes ] = useState<boolean>(false)

  useEffect(() => {
    console.log("watchedEpisodes refetch called")
  }, [season, watchedEpisodes])

  if (!session) { return <Loading />; }

  const displayYear = (date: string) => {
    const d = new Date(date);
    return d.getFullYear();
  };

  const sortedEpisodes = (unsortedEpisodes:Episode[]) => {
    return unsortedEpisodes.sort((a, b) => (a.episode_number > b.episode_number) ? 1 : -1)
  }

  const hasWatchedEpisode = (episodeId:number) => {
    if(!watchedEpisodes.data) { return false }

    return !!watchedEpisodes.data.filter((watchedEp:WatchedEpisode) => watchedEp.episode_id === episodeId).length
  }

  const handleEpisodeWatched = async (episodeId: number, watched: boolean) => {
    if (!episodes || !session.user) {
      return;
    }
    if(!watched) {
      // Add episode watched for user to DB
      await episodeWatchedMutation.mutateAsync({
        episodeId: episodeId,
        seasonId: season.id,
        userId: session.user.id,
      });
    } else {
      // Remove episode watched for user from DB
      await episodeNotWatchedMutation.mutateAsync({
        episodeId: episodeId,
        userId: session.user.id,
      });
    }
    // Refetch episodes to get updated watched state
    watchedEpisodes.refetch();
  };

  const handleShowEpisodes = () => {
    setShowEpisodes(!showEpisodes)
  }

  return (
    <>
      <div 
        className="flex w-full space-x-4 p-4 cursor-pointer rounded-lg shadow-md bg-violet-300 hover:bg-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={handleShowEpisodes}
      >
        <div className="shrink-0 hidden lg:block lg:w-[100px]">
          {season.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
              alt={season.title}
              width="0"
              height="0"
              sizes="100vw"
              className="rounded-lg w-[100px] h-auto"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium lg:text-3xl">{season.title}</h2>
          <div>
            {season.air_date && displayYear(season.air_date)} | {episodes.data?.length} episodes
          </div>
          <div>{season.overview}</div>
        </div>
      </div>
      <div className="w-full lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-8">
        {showEpisodes && episodes.data &&
          sortedEpisodes(episodes.data).map((episode) => (
            <EpisodeTile
              key={episode.id}
              episode={episode}
              watchedEpisode={hasWatchedEpisode(episode.id)}
              handleEpisodeWatched={handleEpisodeWatched}
            />
          ))}
      </div>
    </>
  );
};

export default SeasonTile;
