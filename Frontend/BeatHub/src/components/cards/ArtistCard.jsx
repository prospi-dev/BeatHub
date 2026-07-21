import { Link } from 'react-router-dom'

const ArtistCard = ({ artist }) => {
    return (
        <Link to={`/artist/${artist.id}`} className="block w-full hover:scale-105">
            {artist.images?.[0]?.url ? (
                <img
                    src={artist.images?.[0]?.url || '/default-artist.png'}
                    alt={artist.name}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                />
            ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                        {artist.name.charAt(0)}
                    </span>
                </div>
            )}
            <h3 className="text-sm font-semibold truncate text-center">{artist.name}</h3>
            <p className="text-xs text-gray-400 text-center">{artist.followers?.total.toLocaleString()} followers</p>
        </Link>
    )
}

export default ArtistCard
