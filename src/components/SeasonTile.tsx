import { Season } from "@prisma/client";
import { Episode } from "@prisma/client";
import { api } from "../utils/api";
import Image from "next/image";
import EpisodeTile from "./EpisodeTile";

const SeasonTile = ({ season }: { season: Season }) => {
  const episodes = api.episodes.getEpisodesBySeasonId.useQuery(season.id);
  const episodeWatchedMutation =
    api.episodes.setEpisodeWatchedById.useMutation();

  const displayYear = (date: string) => {
    const d = new Date(date);
    return d.getFullYear();
  };

  const sortedEpisodes = (unsortedEpisodes:Episode[]) => {
    return unsortedEpisodes.sort((a, b) => (a.episode_number > b.episode_number) ? 1 : -1)
  }

  const handleEpisodeWatched = async (episodeId: number, watched: boolean) => {
    if (!episodes) {
      return;
    }
    // Update episode in DB to watched
    await episodeWatchedMutation.mutateAsync({
      id: episodeId,
      watched: watched,
    });
    // Refetch episodes to get correct watched state
    episodes.refetch();
  };

  return (
    <>
      <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:gap-8 overflow-hidden border rounded-lg shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="flex justify-center self-start lg:flex-none">
          {season.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
              alt={season.title}
              width="100"
              height="150"
              className="mb-4 lg:mb-0"
            />
          )}
        </div>
        <div className="flex flex-col gap-4 lg:py-4 ">
          <h2 className="text-2xl font-medium text-white lg:text-3xl">{season.title}</h2>
          <div>
            {displayYear(season.air_date)} | {episodes.data?.length} episodes
          </div>
          <div>{season.overview}</div>
        </div>
      </div>
      <div className="max-w-xl lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-8">
        {episodes.data &&
          sortedEpisodes(episodes.data).map((episode) => (
            <EpisodeTile
              key={episode.id}
              episode={episode}
              handleEpisodeWatched={handleEpisodeWatched}
            />
          ))}
      </div>
    </>
  );
};

export default SeasonTile;
