import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { getArtistsDetails } from '../api/spotifyService'
import BeatHubLogo from '../components/beatHubLogo'
import { FaHeart, FaShare, FaArrowLeft, FaStar } from 'react-icons/fa'
import { IoMusicalNote } from 'react-icons/io5'
import AlbumCard from '../components/albumCard'
const artistDetail = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [artist, setArtist] = useState(null)
  const [topTracks, setTopTracks] = useState([])
  const [albums, setAlbums] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getArtistsDetails(id)
      console.log('Artist Details:', response)
      setArtist(response.artist)
      setTopTracks(response.topTracks?.tracks || [])
      setAlbums((response.albums?.items || []).filter(album => album.album_type === 'album'))
      setError(null)
    } catch (err) {
      console.error('Error fetching artist details:', err)
      setError('Failed to load artist details')
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

  const formatFollowers = (followers) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers?.toLocaleString() || '0'
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      <span className="ml-3 text-gray-400">Loading artist...</span>
    </div>
  )

  const HeroSection = () => (
    <div className="relative h-96 mb-8">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-contain bg-center"
        style={{
          backgroundImage: `url(${artist?.images?.[0]?.url || '/default-artist.png'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end p-8">
        <div className="flex items-end gap-6">
          <img
            src={artist?.images?.[0]?.url || '/default-artist.png'}
            alt={artist?.name}
            className="w-48 h-48 rounded-full border-3 border-white shadow-2xl hidden md:block lg:block"
          />
          <div className="mb-4">
            <h1 className="text-5xl font-bold mb-2">{artist?.name}</h1>
            <div className="flex items-center gap-4 text-gray-300 mb-4">
              <span>{formatFollowers(artist?.followers?.total)} followers</span>
              {artist?.genres?.length > 0 && (
                <>
                  <span>•</span>
                  <span>{artist.genres.slice(0, 3).join(', ')}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors">
                <FaStar />
                Add Review
              </button>
              <button className="border border-gray-400 hover:border-white text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors">
                <FaHeart />
                Follow
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

  const TabNavigation = () => (
    <div className="border-b border-gray-700 mb-8">
      <div className="flex gap-8">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'albums', label: 'Albums' },
          { id: 'tracks', label: 'Top Tracks' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 font-medium transition-all ${activeTab === tab.id
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Popular Tracks */}
      {topTracks.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
          <div className="space-y-2">
            {topTracks.slice(0, 5).map((track, index) => (
              <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 group transition-colors" onClick={() => navigate(`/track/${track.id}`)}>
                <span className="text-gray-400 w-6 text-center">{index + 1}</span>
                <img
                  src={track.album?.images?.[0]?.url || '/default-track.png'}
                  alt={track.name}
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{track.name}</h3>
                  <p className="text-sm text-gray-400">{track.album?.name}</p>
                </div>
                <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                <button className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-orange-400 transition-all" title="Add Review">
                  <FaStar />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Releases */}
      {albums.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Latest Releases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.slice(0, 5).map((album) => (
              <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group" key={album.id}>
                <AlbumCard key={album.id} album={album} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Artist Stats */}
      <section>
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{formatFollowers(artist?.followers?.total)}</div>
              <div className="text-gray-400">Monthly Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{albums.length}</div>
              <div className="text-gray-400">Albums</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{artist?.popularity || 0}</div>
              <div className="text-gray-400">Popularity Score</div>
            </div>
          </div>
          {artist?.genres?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre) => (
                  <span key={genre} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )

  const AlbumsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discography</h2>
        <span className="text-gray-400">{albums.length} releases</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.map((album) =>
          <div key={album.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group">
            <AlbumCard album={album} />
            <p className="text-xs text-gray-500 mt-1">{album.total_tracks} tracks</p>
          </div>
        )}
      </div>
    </div >
  )

  const TracksTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Time Popular</h2>
        <div className="flex gap-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors" title="Add Review">
            <FaStar />
            Add Review
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {topTracks.map((track, index) => (
          <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 group transition-colors">
            <span className="text-gray-400 w-8 text-center">{index + 1}</span>
            <img
              src={track.album?.images?.[0]?.url || '/default-track.png'}
              alt={track.name}
              className="w-12 h-12 rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium text-white">{track.name}</h3>
              <p className="text-sm text-gray-400">{track.album?.name} • {new Date(track.album?.release_date).getFullYear()}</p>
            </div>
            <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-orange-500 hover:text-orange-400 transition-colors" title="Add Review">
                <FaStar />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors" title="Add to Favorites">
                <FaHeart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'albums':
        return <AlbumsTab />
      case 'tracks':
        return <TracksTab />
      default:
        return <OverviewTab />
    }
  }

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
        ) : artist ? (
          <>
            <HeroSection />
            <div className="container mx-auto px-4 pb-8">
              <TabNavigation />
              {renderTabContent()}
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <IoMusicalNote className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Artist not found</h3>
              <p className="text-gray-500">The artist you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default artistDetail