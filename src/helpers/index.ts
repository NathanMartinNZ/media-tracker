import { Movie, Show } from "@prisma/client"

const formatDate = (date:string) => {
  if(!date) { return }
  const d = new Date(date)
  return d.toLocaleDateString("en-uk", { year:"numeric", month:"short", day:"numeric"})
}

const toTitleCase = (str:string) => {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

const filterMedia = (media:any, filters:any) => {
  if(!media.movies.data && !media.shows.data) { return [] }

  const mediaCopy = [...media.movies.data, ...media.shows.data]
  return mediaCopy.filter((m:Movie|Show) => {
    if(filters.typeOfMedia === "both" || filters.typeOfMedia.includes(m.media_type)) {
      return true
    } else {
      return false
    }
  })
}

export { formatDate, toTitleCase, filterMedia }