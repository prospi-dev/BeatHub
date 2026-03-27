import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaShare, FaStar } from 'react-icons/fa'
import { useAppAuth } from '../hooks/useAppAuth'
import { useColor } from 'color-thief-react'

const HeroSection = ({ 
    type,           // "ALBUM", "TRACK", "ARTIST" 
    title,          // Nombre del album/track/artista
    imageUrl,       // URL de la imagen principal
    subtitleInfo,   // Un array o string con la info inferior (ej: ["Artista", "2023", "12 tracks"])
    existingUserReview, // Para el botón condicional
    onReviewClick   // Qué hacer cuando tocan el botón de Review
}) => {
    const navigate = useNavigate()
    const { user } = useAppAuth()

    const fallbackImage = `/default-${type?.toLowerCase() || 'album'}.png`
    const finalImageUrl = imageUrl || fallbackImage

    const { data: dominantColor } = useColor(finalImageUrl, 'hex', {
        crossOrigin: 'anonymous',
    })

    const bgColor = dominantColor || '#1f2937'

    return (
        <div
            className="relative h-96 mb-8 transition-colors duration-1000"
            style={{ background: `linear-gradient(to bottom, ${bgColor} 0%, #111827 100%)` }}
        >
            <div className="relative h-full flex items-end p-8">
                <div className="flex items-end gap-6">
                    <img
                        src={finalImageUrl}
                        alt={title}
                        className="w-48 h-48 rounded-lg shadow-2xl hidden md:block object-cover"
                    />
                    <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-1 font-bold tracking-widest">
                            {type?.toUpperCase()}
                        </p>
                        <h1 className="text-5xl font-bold mb-2 text-white">{title}</h1>
                        
                        <div className="flex items-center gap-2 text-gray-300 mb-4 font-medium">
                            {subtitleInfo}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { user ? onReviewClick() : navigate('/login') }}
                                className={`${existingUserReview
                                    ? 'bg-gray-700 hover:bg-gray-600 border border-gray-500'
                                    : 'bg-orange-500 hover:bg-orange-600'
                                    } text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-lg`}
                            >
                                <FaStar className={existingUserReview ? 'text-orange-500' : ''} />
                                {existingUserReview ? 'Edit Review' : 'Add Review'}
                            </button>
                            <button className="border border-gray-400 hover:border-white text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors">
                                <FaHeart />
                                Save
                            </button>
                            <button className="border border-gray-400 hover:border-white text-white p-3 rounded-full transition-colors">
                                <FaShare />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;