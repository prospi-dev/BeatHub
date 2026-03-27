import { useParams, useNavigate, Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { getAlbumDetails, getMultipleArtistsDetails } from '../api/spotifyService'
import BeatHubLogo from '../components/beatHubLogo'
import { FaHeart, FaShare, FaArrowLeft, FaStar, FaClock, FaUser } from 'react-icons/fa'
import { IoMusicalNote } from 'react-icons/io5'
import { useColor } from 'color-thief-react'
import ReviewModal from '../components/ReviewModal'
import ReviewList from '../components/reviewList'
import { useAppAuth } from '../hooks/useAppAuth'
import Footer from '../components/footer'
import LoadingSpinner from '../components/loadingSpinner'
import HeroSection from '../components/heroSection'

const albumDetail = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [album, setAlbum] = useState(null)
    const [tracks, setTracks] = useState([])
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [existingUserReview, setExistingUserReview] = useState(null)
    const [artistsDetails, setArtistsDetails] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, handleLogout } = useAppAuth()

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getAlbumDetails(id)
            console.log(response)
            setAlbum(response.album)
            setTracks(response.tracks?.items || [])

            if (response.album?.artists?.length > 0) {
                const artistIds = response.album.artists.map(artist => artist.id)
                const artistsDetailsResponse = await getMultipleArtistsDetails(artistIds)
                setArtistsDetails(artistsDetailsResponse)
            }

            setError(null)
        } catch (err) {
            console.error('Error fetching album details:', err)
            setError('Failed to load album details. Please try again later.')
        }
        finally {
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

    const getTotalDuration = () => {
        if (!tracks.length) return '0:00'
        const totalMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0)
        const totalMinutes = Math.floor(totalMs / 60000)
        const hours = Math.floor(totalMinutes / 60)
        const minute = totalMinutes % 60
        return hours > 0 ? `${hours}h ${minute}m` : `${minute}m`
    }

    const formatReleaseDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const TrackList = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Tracks</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                        <FaClock />
                        Duration
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                {tracks.map((track, index) => (
                    <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 group transition-colors" onClick={() => navigate(`/track/${track.id}`)}>
                        <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                        <div className="flex-1">
                            <h3 className="font-medium text-white">{track.name}</h3>
                            <div className='flex flex-row gap-2'>
                                {track.artists?.map(artist => (
                                    <p
                                        key={artist.id}
                                        className="text-sm text-gray-400 hover:text-white hover:underline cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/artist/${artist.id}`);
                                        }}
                                    >
                                        {artist.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Add to Favorites"
                            >
                                <FaHeart />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
    const AlbumInfo = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
                <TrackList />
            </div>
            <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold mb-4">Album Information</h3>
                    <div className="space-y-3">
                        <div>
                            <span className="text-gray-400">Release Date:</span>
                            <p className="text-white">{formatReleaseDate(album?.release_date)}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Total Tracks:</span>
                            <p className="text-white">{album?.total_tracks}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Duration:</span>
                            <p className="text-white">{getTotalDuration()}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Type:</span>
                            <p className="text-white capitalize">{album?.album_type}</p>
                        </div>
                        {album?.label && (
                            <div>
                                <span className="text-gray-400">Label:</span>
                                <p className="text-white">{album.label}</p>
                            </div>
                        )}
                    </div>
                </div>
                <ReviewList itemId={id} itemType="album" />
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

                {album?.genres && album.genres.length > 0 && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="font-bold mb-4">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {album.genres.map((genre) => (
                                <span key={genre} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                    {genre}
                                </span>
                            ))}
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
                    <div className='flex items-center gap-3 ml-auto'>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="text-gray-400 text-base hover:text-white transition">
                                    <span className="text-white font-medium"><FaUser className='text-2xl text-orange-500' /></span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white font-semibold py-2 px-4 transition-colors"
                                >
                                    Log In
                                </Link>

                                <Link
                                    to="/register"
                                    className="hidden bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-500/20 md:block"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {loading ? (
                    <div className="container mx-auto px-4 py-8">
                        <LoadingSpinner message='Loading album...' />
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
                ) : album ? (
                    <>
                        <HeroSection
                            type={album?.album_type || 'album'}
                            title={album?.name}
                            imageUrl={album?.images?.[0]?.url}
                            subtitleInfo={
                                <>
                                    <span className="font-bold text-white hover:underline cursor-pointer">
                                        {album?.artists?.map(artist => artist.name).join(', ')}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(album?.release_date).getFullYear()}</span>
                                    <span>•</span>
                                    <span>{album?.total_tracks} tracks</span>
                                    <span>•</span>
                                    <span className="text-gray-400">{getTotalDuration()}</span>
                                </>
                            }
                            existingUserReview={existingUserReview} 
                            onReviewClick={() => setIsReviewModalOpen(true)}
                        />

                        <div className="container mx-auto px-4 pb-8">
                            <AlbumInfo />
                        </div>
                    </>
                ) : (
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-16">
                            <IoMusicalNote className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">Album not found</h3>
                            <p className="text-gray-500">The album you're looking for doesn't exist or has been removed.</p>
                        </div>
                    </div>
                )}
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    itemName={album?.name || 'this album'}
                    itemId={id}
                    itemType="album"
                />
            </main>
            <Footer />
        </div>
    )
}

export default albumDetail