import axios from "axios"
import { Season, Show } from "@prisma/client"
import { seasonsRouter } from "../routers/seasons"

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

const fetchSeasonsData = async ( season_numbers:number[], showId:number) => {
  if(!season_numbers.length) { return [] }

  const seasonsArr = season_numbers.map(async (season_number:number) => {
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

    return seasonClean
  })

  return Promise.all(seasonsArr)
}

export {
  fetchShowData,
  fetchSeasonsData
}