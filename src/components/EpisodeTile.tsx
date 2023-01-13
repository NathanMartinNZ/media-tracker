import Image from "next/image";
import { Episode } from "@prisma/client";
import { formatDate } from "../helpers/index"

const EpisodeTile = ({
  episode,
  handleEpisodeWatched,
}: {
  episode: Episode;
  handleEpisodeWatched: any;
}) => {

  const episodeNumberDisplay = () => {
    if(`Episode ${episode.episode_number}` !== episode.title) {
      return `Episode ${episode.episode_number} |`
    }
  }

  return (
    <div className="flex w-full lg:space-x-4 p-4">
      <div className="flex shrink-0 hidden lg:block w-[100px]">
        {episode.still_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w200${episode.still_path}`}
            alt={episode.title}
            width="0"
            height="0"
            sizes="100vw"
            className="rounded-lg w-[100px] h-auto"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 grow">
        <h3 className="text-1xl font-medium text-white lg:text-2xl">{episode.title}</h3>
        <div>{episodeNumberDisplay()} Air date: {formatDate(episode.air_date)}</div>
        <div className="hidden lg:block">{episode.overview}</div>
      </div>
      <div className="w-[100px]">
        <div className="">
          {episode.watched ? (
            <button
              className="btn bg-purple-800 hover:bg-purple-900"
              onClick={() => handleEpisodeWatched(episode.id, false)}
            >
              Watched ✓
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => handleEpisodeWatched(episode.id, true)}
            >
              Not watched
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeTile;
