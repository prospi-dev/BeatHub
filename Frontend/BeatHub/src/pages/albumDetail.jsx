import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { getAlbumDetails, getMultipleArtistsDetails } from '../api/spotifyService'
import BeatHubLogo from '../components/beatHubLogo'
import { FaHeart, FaShare, FaArrowLeft, FaStar, FaClock } from 'react-icons/fa'
import { IoMusicalNote } from 'react-icons/io5'

const albumDetail = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [album, setAlbum] = useState(null)
    const [tracks, setTracks] = useState([])
    const [artistsDetails, setArtistsDetails] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()

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

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-400">Loading album...</span>
        </div>
    )

    const HeroSection = () => (
        <div className="relative h-96 mb-8">
            {/* Background image with overlay */}
            <div
                className="absolute inset-0 bg-contain bg-center"
                style={{
                    backgroundImage: `url(${album?.images?.[0]?.url || '/default-album.png'})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end p-8">
                <div className="flex items-end gap-6">
                    <img
                        src={album?.images?.[0]?.url || '/default-album.png'}
                        alt={album?.name}
                        className="w-48 h-48 rounded-lg shadow-2xl hidden md:block"
                    />
                    <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-1">
                            {album?.album_type?.toUpperCase() || 'ALBUM'}
                        </p>
                        <h1 className="text-5xl font-bold mb-2">{album?.name}</h1>
                        <div className="flex items-center gap-2 text-gray-300 mb-4">
                            <span className="font-semibold">
                                {album?.artists?.map(artist => artist.name).join(', ')}
                            </span>
                            <span>•</span>
                            <span>{new Date(album?.release_date).getFullYear()}</span>
                            <span>•</span>
                            <span>{album?.total_tracks} tracks</span>
                            <span>•</span>
                            <span>{getTotalDuration()}</span>
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
                                        onClick={() => navigate(`/artist/${artist.id}`)}
                                    >
                                        {artist.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="text-orange-500 hover:text-orange-400 transition-colors"
                                title="Add Review"
                            >
                                <FaStar />
                            </button>
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
                ) : album ? (
                    <>
                        <HeroSection />
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
            </main>
        </div>
    )
}

export default albumDetail