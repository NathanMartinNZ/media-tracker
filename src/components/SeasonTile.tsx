import { Season, WatchedEpisode } from "@prisma/client";
import { Episode } from "@prisma/client";
import { api } from "../utils/api";
import Image from "next/image";
import EpisodeTile from "./EpisodeTile";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";

const SeasonTile = ({
  season,
  episodes,
  watchedEpisodes,
  refetchWatchedEpisodes,
}: {
  season: Season;
  episodes: Episode[];
  watchedEpisodes: WatchedEpisode[];
  refetchWatchedEpisodes: () => void;
}) => {
  const { data: session } = useSession();
  const episodeWatchedMutation =
    api.watched.addEpisodeWatchedById.useMutation();
  const episodeNotWatchedMutation =
    api.watched.removeEpisodeWatchedById.useMutation();
  const [showEpisodes, setShowEpisodes] = useState<boolean>(false);

  if (!session) {
    return <Loading />;
  }

  const displayYear = (date: string) => {
    const d = new Date(date);
    return d.getFullYear();
  };

  const sortedEpisodes = (unsortedEpisodes: Episode[]) => {
    return unsortedEpisodes.sort((a, b) =>
      a.episode_number > b.episode_number ? 1 : -1
    );
  };

  const hasWatchedEpisode = (episodeId: number) => {
    return !!watchedEpisodes.filter(
      (watchedEp: WatchedEpisode) => watchedEp.episode_id === episodeId
    ).length;
  };

  const handleEpisodeWatched = async (episodeId: number, watched: boolean) => {
    if (!episodes || !session.user) {
      return;
    }
    if (!watched) {
      // Add episode watched for user to DB
      await episodeWatchedMutation.mutateAsync({
        episodeId: episodeId,
        seasonId: season.id,
        showId: season.show_id,
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
    refetchWatchedEpisodes();
  };

  const handleShowEpisodes = () => {
    setShowEpisodes(!showEpisodes);
  };

  return (
    <>
      <div
        className="flex w-full cursor-pointer space-x-4 rounded-lg bg-gray-800 p-4 text-white shadow-md hover:bg-gray-700"
        onClick={handleShowEpisodes}
      >
        <div className="hidden shrink-0 lg:block lg:w-[100px]">
          {season.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
              alt={season.title}
              width="100"
              height="150"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/plh-153-230.png"
              className="h-auto w-[100px] rounded-lg"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium lg:text-3xl">{season.title}</h2>
          <div>
            {season.air_date && displayYear(season.air_date)} |{" "}
            {episodes.length} episodes
          </div>
          <div>{season.overview}</div>
        </div>
      </div>
      <div className="w-full lg:flex lg:max-w-3xl lg:flex-row lg:flex-wrap lg:gap-8">
        {showEpisodes &&
          episodes &&
          sortedEpisodes(episodes).map((episode) => (
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
