import { Season } from "@prisma/client";
import { api } from "../utils/api";
import Episode from "./Episode";

const Season = ({ season }: { season: Season }) => {
  const episodes = api.episodes.getEpisodesBySeasonId.useQuery(season.id);
  console.log(season);

  return (
    <div key={season.id}>
      <div>
        <div>{season.poster_path}</div>
        <div>{season.title}</div>
        <div>{season.air_date} | </div>
        <div>{season.overview}</div>
      </div>
      <div>
        {episodes.data &&
          episodes.data.map((episode) => <Episode episode={episode} />)}
      </div>
    </div>
  );
};

export default Season;
