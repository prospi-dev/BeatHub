import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import { getArtistsDetails } from '../api/spotifyService.js'
import { FaHeart, FaStar } from 'react-icons/fa'
import { IoMusicalNote } from 'react-icons/io5'
import { formatDuration } from '../utils/utils.js';

import AlbumCard from '../components/cards/AlbumCard.jsx'
import ReviewModal from '../components/reviews/ReviewModal.jsx'
import ReviewList from '../components/reviews/ReviewList.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import HeroSection from '../components/layout/HeroSection.jsx'
import Header from '../components/layout/Header.jsx'

const artistDetail = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [artist, setArtist] = useState(null)
  const [topTracks, setTopTracks] = useState([])
  const [albums, setAlbums] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshReviewsTrigger, setRefreshReviewsTrigger] = useState(0);
  const [existingUserReview, setExistingUserReview] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  const handleReviewSuccess = () => {
    // Al sumar 1, el useEffect de ReviewList se volverá a ejecutar
    setRefreshReviewsTrigger(prev => prev + 1);
  };

  // Memoize the callback for reviews
  const handleUserReviewFound = useCallback((review) => {
    setExistingUserReview(review);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getArtistsDetails(id)
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

  const formatFollowers = (followers) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers?.toLocaleString() || '0'
  }

  // --- RENDER FUNCTIONS (NOT COMPONENTS) ---
  // Changed from const Component = () => to normal functions returning JSX

  const renderTabNavigation = () => (
    <div className="border-b border-gray-700 mb-8">
      <div className="flex gap-8">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'albums', label: 'Albums' },
          { id: 'tracks', label: 'Top Tracks' },
          { id: 'reviews', label: 'Reviews' } // <-- Added the reviews tab that was in the switch but not in the buttons
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

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Popular Tracks */}
      {topTracks.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
          <div className="space-y-2">
            {topTracks.slice(0, 5).map((track, index) => (
              <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 group transition-colors cursor-pointer" onClick={() => navigate(`/track/${track.id}`)}>
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
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-colors" title="Add Review">
                  <FaHeart />
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
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Review List visible in overview */}
      <ReviewList
        itemId={id}
        itemType="artist"
        onUserReviewFound={setExistingUserReview}
        refreshTrigger={refreshReviewsTrigger}
      />

      {/* Artist Stats */}
      <section>
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{formatFollowers(artist?.followers?.total)}</div>
              <div className="text-gray-400">Followers</div>
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

  const renderAlbumsTab = () => (
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
    </div>
  )

  const renderTracksTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Time Popular</h2>
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
              <button className="text-gray-400 hover:text-white transition-colors" title="Add to Favorites">
                <FaHeart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'albums': return renderAlbumsTab();
      case 'tracks': return renderTracksTab();
      case 'reviews': return <ReviewList itemId={id} itemType="artist" onUserReviewFound={handleUserReviewFound} />;
      default: return renderOverviewTab();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* 2. Using the generic Header */}
      <Header showBackButton={true} onBackClick={() => navigate(-1)} />

      <main>
        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <LoadingSpinner message='Loading artist...' />
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
            <HeroSection
              type={'artist'}
              title={artist?.name}
              imageUrl={artist?.images?.[0]?.url}
              subtitleInfo={
                <>
                  <div className="flex items-center gap-4 text-gray-300 font-medium">
                    <span>{formatFollowers(artist?.followers?.total)} followers</span>
                    {artist?.genres?.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{artist.genres.slice(0, 3).join(', ')}</span>
                      </>
                    )}
                  </div>
                </>
              }
              existingUserReview={existingUserReview}
              onReviewClick={() => setIsReviewModalOpen(true)}
            />
            <div className="container mx-auto px-4 pb-8">
              {renderTabNavigation()}
              {renderContent()}
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

        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          itemName={artist?.name || 'this artist'}
          itemId={id}
          itemType="artist"
          existingReview={existingUserReview}
          onReviewSuccess={handleReviewSuccess}
        />
      </main>
    </div>
  )
}

export default artistDetail