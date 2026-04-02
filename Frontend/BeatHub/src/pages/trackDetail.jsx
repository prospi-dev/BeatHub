import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import { getTrackDetails, getMultipleArtistsDetails } from '../api/spotifyService'
import { IoMusicalNote } from 'react-icons/io5'

import Header from '../components/layout/Header'
import ReviewModal from '../components/reviews/ReviewModal'
import ReviewList from '../components/reviews/ReviewList'
import Footer from '../components/layout/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import HeroSection from '../components/layout/HeroSection'
import FavoriteButton from '../components/common/FavoriteButton'

import { formatDuration, formatReleaseDate } from '../utils/utils'

const TrackDetail = () => {
    // 1. States
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [track, setTrack] = useState(null)
    const [artistsDetails, setArtistsDetails] = useState([])
    const [refreshReviewsTrigger, setRefreshReviewsTrigger] = useState(0);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [existingUserReview, setExistingUserReview] = useState(null)

    const { id } = useParams()
    const navigate = useNavigate()

    const handleOpenReviewModal = useCallback(() => {
        setIsReviewModalOpen(true);
    }, []);

    const handleReviewSuccess = () => {
        setRefreshReviewsTrigger(prev => prev + 1);
    };

    // 2. Data Fetching
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getTrackDetails(id)
            setTrack(response.track)

            if (response.track?.artists?.length > 0) {
                const artistIds = response.track.artists.map(artist => artist.id)
                const artistsDetailsResponse = await getMultipleArtistsDetails(artistIds)
                setArtistsDetails(artistsDetailsResponse)
            }

            setError(null)
        } catch (err) {
            console.error('Error fetching track details:', err)
            setError('Failed to load track details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchData()
        }
    }, [id])

    // 3. Main Render
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

            {/* Ultra Clean Header */}
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />

            <main>
                {loading ? (
                    <div className="container mx-auto px-4 py-8">
                        <LoadingSpinner message='Loading track...' />
                    </div>
                ) : error ? (
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-16">
                            <div className="text-red-500 text-xl mb-4">{error}</div>
                            <button
                                onClick={fetchData}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : track ? (
                    <>
                        {/* HERO SECTION */}
                        <HeroSection
                            itemId={id}
                            type={'track'}
                            title={track?.name}
                            imageUrl={track?.album?.images?.[0]?.url}
                            subtitleInfo={
                                <div className="flex items-center gap-2 text-gray-300 flex-wrap md:flex-row">
                                    <span className="font-semibold">
                                        {track?.artists?.map(artist => artist.name).join(', ')}
                                    </span>
                                    <span>•</span>
                                    <span
                                        className="hover:text-white cursor-pointer transition-colors"
                                        onClick={() => navigate(`/album/${track?.album?.id}`)}
                                    >
                                        {track?.album?.name}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(track?.album?.release_date).getFullYear()}</span>
                                    <span>•</span>
                                    <span>{formatDuration(track?.duration_ms)}</span>
                                </div>
                            }
                            existingUserReview={existingUserReview}
                            onReviewClick={handleOpenReviewModal}
                        />

                        {/* UNROLLED MAIN CONTENT */}
                        <div className="container mx-auto px-4 pb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* LEFT COLUMN: Reviews and Related Album */}
                                <div className="lg:col-span-2 space-y-8">

                                    {/* Reviews Section */}
                                    <ReviewList
                                        itemId={id}
                                        itemType="album"
                                        onUserReviewFound={setExistingUserReview}
                                        refreshTrigger={refreshReviewsTrigger}
                                    />

                                    {/* "More from this Album" Section */}
                                    {track?.album && (
                                        <div className="bg-gray-800 p-6 rounded-lg mb-8">
                                            <h2 className="text-2xl font-bold mb-6">More from this Album</h2>
                                            <div
                                                className="flex items-center gap-4 hover:bg-gray-700 p-3 rounded-lg transition-colors cursor-pointer"
                                                onClick={() => navigate(`/album/${track.album.id}`)}
                                            >
                                                <img
                                                    src={track.album.images?.[0]?.url || '/default-album.png'}
                                                    alt={track.album.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white">{track.album.name}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {track.artists?.map(artist => artist.name).join(', ')} • {new Date(track.album.release_date).getFullYear()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">{track.album.total_tracks} tracks</p>
                                                </div>
                                                <div className="text-gray-400 hover:text-white transition-colors">
                                                    <span className="text-sm">View Album →</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT COLUMN: Track Info and Artists */}
                                <div className="space-y-6">

                                    {/* Track Information */}
                                    <div className="bg-gray-800 p-6 rounded-lg">
                                        <h3 className="font-bold mb-4">Track Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-gray-400">Album:</span>
                                                <p
                                                    className="text-white hover:text-orange-500 cursor-pointer transition-colors"
                                                    onClick={() => navigate(`/album/${track?.album?.id}`)}
                                                >
                                                    {track?.album?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Release Date:</span>
                                                <p className="text-white">{formatReleaseDate(track?.album?.release_date)}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Duration:</span>
                                                <p className="text-white">{formatDuration(track?.duration_ms)}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Track Number:</span>
                                                <p className="text-white">{track?.track_number} of {track?.album?.total_tracks}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Popularity:</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${track?.popularity || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-white text-sm">{track?.popularity || 0}/100</span>
                                                </div>
                                            </div>
                                            {track?.explicit && (
                                                <div>
                                                    <span className="text-gray-400">Content:</span>
                                                    <p className="text-white">
                                                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">EXPLICIT</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Artists */}
                                    {artistsDetails && artistsDetails.length > 0 && (
                                        <div className="bg-gray-800 p-6 rounded-lg">
                                            <h3 className="font-bold mb-4">Artists</h3>
                                            <div className="space-y-2">
                                                {artistsDetails.map((artist) => (
                                                    <div
                                                        key={artist.id}
                                                        className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer"
                                                        onClick={() => navigate(`/artist/${artist.id}`)}
                                                    >
                                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                                            {artist.images?.[0]?.url ? (
                                                                <img
                                                                    src={artist.images[0].url}
                                                                    alt={artist.name}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <IoMusicalNote className="text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-white font-medium">{artist.name}</p>
                                                            <p className="text-xs text-gray-400">Artist</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Availability */}
                                    {track?.available_markets && (
                                        <div className="bg-gray-800 p-6 rounded-lg">
                                            <h3 className="font-bold mb-4">Availability</h3>
                                            <div>
                                                <span className="text-gray-400">Available in:</span>
                                                <p className="text-white">{track.available_markets.length} countries</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-16">
                            <IoMusicalNote className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">Track not found</h3>
                            <p className="text-gray-500">The track you're looking for doesn't exist or has been removed.</p>
                        </div>
                    </div>
                )}

                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    itemName={track?.name || 'this track'}
                    itemId={id}
                    itemType="track"
                    existingReview={existingUserReview}
                    onReviewSuccess={handleReviewSuccess}
                />
            </main>
            <Footer />
        </div>
    )
}

export default TrackDetail