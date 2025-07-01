import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'

const artistCard = ({ artist }) => {
    
    const navigate = useNavigate()

    return (
        <div key={artist.id} className="w-full hover:scale-105" onClick={() => navigate(`/artist/${artist.id}`)}>
            <img
                src={artist.images?.[0]?.url || '/default-artist.png'}
                alt={artist.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
            />
            <h3 className="text-sm font-semibold truncate text-center">{artist.name}</h3>
            <p className="text-xs text-gray-400 text-center">{artist.followers?.total.toLocaleString()} followers</p>
        </div>
    )
}

export default artistCard