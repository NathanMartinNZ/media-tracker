import axios from "axios"
import { Episode, Season, Show } from "@prisma/client"

const fetchShowData = async (input:number) => {
  // Fetch show from TMDB
  const res = await axios.get(`https://api.themoviedb.org/3/tv/${input}?api_key=${process.env.TMDB_CLIENT_API}&language=en-US`)
  const showRaw = await res.data

  // Parse show obj to pull only relevant data
  const showClean:Show = {
    id: showRaw.id,
    media_type: "show",
    genres: showRaw.genres.map((genre:any) => genre.name),
    original_language: showRaw.original_language,
    overview: showRaw.overview,
    popularity: showRaw.popularity,
    backdrop_path: showRaw.backdrop_path,
    poster_path: showRaw.poster_path,
    first_air_date: showRaw.first_air_date,
    last_air_date: showRaw.last_air_date,
    spoken_languages: showRaw.spoken_languages.map((lang:any) => lang.iso_639_1),
    status: showRaw.status,
    tagline: showRaw.tagline,
    title: showRaw.name,
    networks: showRaw.networks.map((network:any) => network.name),
    number_of_episodes: showRaw.number_of_episodes,
    number_of_seasons: showRaw.number_of_seasons,
    watched: false
  }

  return {
    show: showClean,
    season_numbers: showRaw.seasons.map((season:any) => season.season_number)
  }
}

const fetchSeasonsAndEpisodesData = async ( season_numbers:number[], showId:number) => {
  const seasonsArr:Season[] = []
  const episodesArr:Episode[] = []

  for(const season_number of season_numbers) {
    // Fetch seasons & episodes from TMDB
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${showId}/season/${season_number}?api_key=${process.env.TMDB_CLIENT_API}&language=en-US`)
    const seasonRaw = res.data
  
    // Parse show obj to pull only relevant data
    const seasonClean:Season = {
      id: seasonRaw.id,
      show_id: showId,
      media_type: "season",
      overview: seasonRaw.overview,
      poster_path: seasonRaw.poster_path,
      air_date: seasonRaw.air_date,
      title: seasonRaw.name,
      season_number: seasonRaw.season_number
    }

    // Push season to array
    seasonsArr.push(seasonClean)

    // Push episodes to array
    seasonRaw.episodes.forEach((episodeRaw:any) => {
      const episode:Episode = {
        id: episodeRaw.id,
        season_id: seasonRaw.id,
        media_type: "episode",
        overview: episodeRaw.overview,
        still_path: episodeRaw.still_path,
        air_date: episodeRaw.air_date,
        title: episodeRaw.name,
        episode_number: episodeRaw.episode_number,
        watched: false
      }
      episodesArr.push(episode)
    })
  }

  return {
    seasons: seasonsArr,
    episodes: episodesArr
  }
}

export {
  fetchShowData,
  fetchSeasonsAndEpisodesData
}