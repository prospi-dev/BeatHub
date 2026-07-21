import { Link } from 'react-router-dom'
const TrackCard = ({ track }) => {
    return (
        <Link to={`/track/${track.id}`} className="block w-full hover:scale-105">
            {track.album?.images?.[0]?.url ? (
                <img
                    src={track.album?.images?.[0]?.url || '/default-artist.png'}
                    alt={track.name}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                />
            ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                        {track.name.charAt(0)}
                    </span>
                </div>
            )}
            <h3 className="text-sm font-semibold truncate">{track.name}</h3>
            <p className="text-xs text-gray-400 truncate">{track.artists?.[0]?.name}</p>
            <p className="text-xs text-gray-500 truncate">{track.album?.name}</p>
            <div className="text-xs text-gray-500 mt-1">
                {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </div>
        </Link>
    )
}

export default TrackCard
