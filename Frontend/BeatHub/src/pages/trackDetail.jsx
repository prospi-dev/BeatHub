import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { getTrackDetails, getMultipleArtistsDetails } from '../api/spotifyService'
import BeatHubLogo from '../components/beatHubLogo'
import { FaHeart, FaShare, FaArrowLeft, FaStar, FaClock, FaMusic } from 'react-icons/fa'
import { IoMusicalNote } from 'react-icons/io5'

const TrackDetail = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [track, setTrack] = useState(null)
    const [artistsDetails, setArtistsDetails] = useState([]) // Nuevo estado
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getTrackDetails(id)
            console.log('Track Details:', response)
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

    const formatDuration = (durationMs) => {
        const minutes = Math.floor(durationMs / 60000)
        const seconds = Math.floor((durationMs % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const formatReleaseDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-400">Loading track...</span>
        </div>
    )

    const HeroSection = () => (
        <div className="relative h-96 mb-8">
            {/* Background image with overlay */}
            <div
                className="absolute inset-0 bg-contain bg-center"
                style={{
                    backgroundImage: `url(${track?.album?.images?.[0]?.url || '/default-track.png'})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end p-6">
                <div className="flex items-end gap-6">
                    <img
                        src={track?.album?.images?.[0]?.url || '/default-track.png'}
                        alt={track?.name}
                        className="w-48 h-48 rounded-lg shadow-2xl hidden md:block"
                    />
                    <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-1">SONG</p>
                        <h1 className="text-5xl font-bold mb-2">{track?.name}</h1>
                        <div className="flex items-center gap-2 text-gray-300 mb-4">
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
                        <div className="flex items-center gap-3">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors">
                                <FaStar />
                                Add Review
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

    const ReviewsSection = () => (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors">
                    <FaStar />
                    Write Review
                </button>
            </div>

            {/* Placeholder for reviews - you can implement actual review functionality later */}
            <div className="text-center py-8">
                <IoMusicalNote className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No reviews yet</p>
                <p className="text-gray-500 text-sm">Be the first to share your thoughts about this track!</p>
            </div>
        </div>
    )

    const RelatedTracksSection = () => (
        track?.album && (
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
        )
    )

    const TrackInfo = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <ReviewsSection />
                <RelatedTracksSection />
            </div>

            <div className="space-y-6">
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
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <header className='sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700'>
                <div className='flex items-center justify-between p-4'>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <FaArrowLeft />
                        </button>
                        <BeatHubLogo />
                    </div>
                </div>
            </header>

            <main>
                {loading ? (
                    <div className="container mx-auto px-4 py-8">
                        <LoadingSpinner />
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
                        <HeroSection />
                        <div className="container mx-auto px-4 pb-8">
                            <TrackInfo />
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
            </main>
        </div>
    )
}

export default TrackDetail