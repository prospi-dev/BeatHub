import React from 'react'
import { useNavigate } from 'react-router-dom'
const albumCard = ({album}) => {
    const navigate = useNavigate()
    return (
        <div key={album.id} className="w-full hover:scale-105" onClick={() => navigate(`/album/${album.id}`)}>
            <img
                src={album.images?.[0]?.url}
                alt={album.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
            />
            <h3 className="text-sm font-semibold truncate">{album.name}</h3>
            <p className="text-xs text-gray-400 truncate">{album.artists?.[0]?.name}</p>
            <p className="text-xs text-gray-500">{new Date(album.release_date).getFullYear()}</p>
        </div>
    )
}

export default albumCard