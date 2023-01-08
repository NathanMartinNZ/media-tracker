import { Episode } from "@prisma/client"

const Episode = ({ episode }:{ episode:Episode }) => {
    return (
        <div key={episode.id}>
            <div>{episode.still_path}</div>
            <div>{episode.title}</div>
            <div>{episode.air_date} | </div>
            <div>{episode.overview}</div>
        </div>
    )
}

export default Episode