import React from 'react'
import { useNavigate } from 'react-router-dom'
const trackCard = ({ track }) => {
    const navigate = useNavigate();
    
    return (
        <div key={track.id} className="w-full hover:scale-105" onClick={() => navigate(`/track/${track.id}`)}>
            <img
                src={track.album?.images?.[0]?.url}
                alt={track.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
            />
            <h3 className="text-sm font-semibold truncate">{track.name}</h3>
            <p className="text-xs text-gray-400 truncate">{track.artists?.[0]?.name}</p>
            <p className="text-xs text-gray-500 truncate">{track.album?.name}</p>
            <div className="text-xs text-gray-500 mt-1">
                {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </div>
        </div>
    )
}

export default trackCard