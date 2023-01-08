import Image from "next/image";
import { Episode } from "@prisma/client";

const EpisodeTile = ({
  episode,
  handleEpisodeWatched,
}: {
  episode: Episode;
  handleEpisodeWatched: any;
}) => {
  return (
    <div className="max-w-xl gap-2 lg:flex lg:max-w-3xl lg:flex-row lg:gap-8">
      <div className="flex justify-center self-start lg:flex-none">
        <Image
          src={`https://image.tmdb.org/t/p/w200${episode.still_path}`}
          alt={episode.title}
          width="100"
          height="150"
          className="mb-4 lg:mb-0"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-1xl font-medium text-white lg:text-2xl">{episode.title}</h3>
        <div>Air date: {episode.air_date}</div>
        <div>{episode.overview}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grow-0">
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
