import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShare, FaStar } from 'react-icons/fa'
import { useAppAuth } from '../../hooks/useAppAuth'
import FavoriteButton from '../common/FavoriteButton'
// Import the default COMPONENT, NOT the hook
import Color from 'color-thief-react'

const HeroSection = memo(({
    itemId,         
    type,           
    title,          
    imageUrl,       
    subtitleInfo,   
    existingUserReview, 
    onReviewClick   
}) => {
    const navigate = useNavigate()
    const { user } = useAppAuth()

    const fallbackImage = `/default-${type?.toLowerCase() || 'album'}.png`
    const finalImageUrl = imageUrl || fallbackImage

    const renderHeroContent = (bgColor) => (
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
                        crossOrigin="anonymous"
                    />
                    <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-1 font-bold tracking-widest">
                            {type?.toUpperCase()}
                        </p>
                        <h1 className="text-5xl font-bold mb-2 text-white">{title}</h1>

                        <div className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
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
                            <FavoriteButton itemId={itemId} itemType={type} />
                            <button className="border border-gray-400 hover:border-white text-white p-3 rounded-full transition-colors">
                                <FaShare />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Color src={finalImageUrl} crossOrigin="anonymous" format="hex">
            {({ data, loading, error }) => {
                const bgColor = (!loading && !error && data) ? data : '#1f2937';
                return renderHeroContent(bgColor);
            }}
        </Color>
    )
})

export default HeroSection;