import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import BeatHubLogo from '../components/beatHubLogo.jsx'
import { CiGrid41, CiFilter, CiSearch } from "react-icons/ci"
import { IoClose, IoChevronDown } from "react-icons/io5"
import { FaPlay, FaHeart, FaShare } from "react-icons/fa"
import { getNewReleases, getPopularArtists, getTopTracks, search } from '../api/spotifyService.js'
import AlbumCard from '../components/albumCard.jsx'
import ArtistCard from '../components/artistCard.jsx'
import TrackCard from '../components/trackCard.jsx'

const catalog = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(location.search)
    const type = searchParams.get('type') || 'albums'
    const searchQuery = searchParams.get('search') || ''

    // States
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchInput, setSearchInput] = useState(searchQuery)
    const [isSearchActive, setIsSearchActive] = useState(!!searchQuery)
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState('relevance')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [gridColumns, setGridColumns] = useState(4) // Number of columns (3-8)
    // Debounced search function
    const debounce = useCallback((func, delay) => {
        let timeoutId
        return (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
    }, [])

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.trim()) {
                const newSearchParams = new URLSearchParams(location.search)
                newSearchParams.set('search', query)
                navigate(`/catalog?${newSearchParams.toString()}`, { replace: true })
            }
        }, 500),
        [location.search, navigate]
    )

    // Fetch data function
    const fetchData = useCallback(async (isSearch = false, searchQuery = '') => {
        try {
            setLoading(true)
            let result = []
            const currentOffset = 0

            if (isSearch && searchQuery.trim()) {
                // Search functionality
                const searchResult = await search(searchQuery, type, currentOffset)
                switch (type) {
                    case 'albums':
                        result = searchResult.albums?.items || []
                        break
                    case 'artists':
                        result = searchResult.artists?.items || []
                        break
                    case 'tracks':
                        result = searchResult.tracks?.items || []
                        break
                }
            } else {
                // Default content
                switch (type) {
                    case 'albums':
                        const albumsData = await getNewReleases(currentOffset)
                        result = albumsData.albums?.items || []
                        break
                    case 'artists':
                        result = await getPopularArtists(currentOffset)
                        break
                    case 'tracks':
                        result = await getTopTracks(currentOffset)
                        break
                }
            }

            // Sort results
            result = sortResults(result, sortBy, type)

            setData(result)
            setHasMore(result.length >= 20)
            setError(null)
        } catch (err) {
            console.error(`Error fetching ${type}:`, err)
            setError(`Failed to load ${type}`)
        } finally {
            setLoading(false)
        }
    }, [type, sortBy])

    // Sort function
    const sortResults = (results, sortBy, type) => {
        const sorted = [...results]
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case 'date-newest':
                if (type === 'albums') {
                    return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                }
                return sorted
            case 'date-oldest':
                if (type === 'albums') {
                    return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                }
                return sorted
            case 'date': // Mantener compatibilidad con código existente
                if (type === 'albums') {
                    return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                }
                return sorted
            case 'popularity':
                return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            case 'followers':
                return sorted.sort((a, b) => (b.followers?.total || 0) - (a.followers?.total || 0))
            default:
                return sorted
        }
    }

    // Effects
    useEffect(() => {
        setPage(1)
        // Reset sort to default when search becomes active or type changes
        if (isSearchActive) {
            setSortBy('relevance')
        }
        fetchData(isSearchActive, searchQuery)
    }, [type, isSearchActive, searchQuery, fetchData])

    useEffect(() => {
        if (searchInput !== searchQuery) {
            if (searchInput.trim()) {
                debouncedSearch(searchInput)
                setIsSearchActive(true)
                setSortBy('relevance') // Reset sort when starting a new search
            } else {
                setIsSearchActive(false)
                const newSearchParams = new URLSearchParams(location.search)
                newSearchParams.delete('search')
                navigate(`/catalog?${newSearchParams.toString()}`, { replace: true })
            }
        }
    }, [searchInput, searchQuery, debouncedSearch, location.search, navigate])

    // Handlers
    const handleSearchToggle = () => {
        setIsSearchActive(!isSearchActive)
        if (!isSearchActive) {
            setSearchInput('')
        }
    }

    const handleClearSearch = () => {
        setSearchInput('')
        setIsSearchActive(false)
    }

    const handleLoadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        setLoadingMore(true) // Start loading animation

        // Calculate offset for next page
        const nextOffset = nextPage * 20

        // Make request with correct offset
        const loadMoreData = async () => {
            try {
                let result = []

                if (isSearchActive && searchQuery.trim()) {
                    const searchResult = await search(searchQuery, type, nextOffset)
                    switch (type) {
                        case 'albums':
                            result = searchResult.albums?.items || []
                            break
                        case 'artists':
                            result = searchResult.artists?.items || []
                            break
                        case 'tracks':
                            result = searchResult.tracks?.items || []
                            break
                    }
                } else {
                    switch (type) {
                        case 'albums':
                            const albumsData = await getNewReleases(nextOffset)
                            result = albumsData.albums?.items || []
                            break
                        case 'artists':
                            result = await getPopularArtists(nextOffset)
                            break
                        case 'tracks':
                            result = await getTopTracks(nextOffset)
                            break
                    }
                }

                // Sort results
                const sorted = [...result]
                switch (sortBy) {
                    case 'name':
                        result = sorted.sort((a, b) => a.name.localeCompare(b.name))
                        break
                    case 'date-newest':
                        if (type === 'albums') {
                            result = sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                        }
                        break
                    case 'date-oldest':
                        if (type === 'albums') {
                            result = sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                        }
                        break
                    case 'date': // Mantener compatibilidad
                        if (type === 'albums') {
                            result = sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                        }
                        break
                    case 'popularity':
                        result = sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                        break
                    default:
                        result = sorted
                }

                // Add to existing data
                setData(prev => [...prev, ...result])
                setHasMore(result.length >= 20)

            } catch (err) {
                console.error(`Error loading more ${type}:`, err)
                setError(`Failed to load more ${type}`)
            } finally {
                setLoadingMore(false) // Stop loading animation
            }
        }

        loadMoreData()
    }

    // Memoized content
    const contentStats = useMemo(() => {
        const total = data.length
        const searchText = searchQuery ? ` for "${searchQuery}"` : ''
        return `${total} ${type}${searchText}`
    }, [data.length, type, searchQuery])

    const renderContent = () => {
        // Generar clases dinámicas basadas en el número de columnas
        const getGridClass = (columns) => {
            const gridClasses = {
                3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
                4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4',
                5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
                6: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
                7: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7',
                8: 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
            }
            return gridClasses[columns] || gridClasses[4]
        }

        const contentClass = `grid ${getGridClass(gridColumns)} gap-8`

        return (
            <div className={contentClass}>
                {data.map((item, index) => {
                    const cardProps = {
                        key: item.id,
                        [type.slice(0, -1)]: item,
                        gridColumns
                    }

                    switch (type) {
                        case 'albums':
                            return <AlbumCard {...cardProps} />
                        case 'artists':
                            return <ArtistCard {...cardProps} />
                        case 'tracks':
                            return <TrackCard {...cardProps} />
                        default:
                            return null
                    }
                })}
            </div>
        )
    }
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-400">Loading {type}...</span>
        </div>
    )

    const EmptyState = () => (
        <div className="text-center py-16">
            <CiSearch className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery ? `No ${type} found` : `No ${type} available`}
            </h3>
            <p className="text-gray-500">
                {searchQuery
                    ? `Try searching with different keywords`
                    : `Check back later for new ${type}`
                }
            </p>
            {searchQuery && (
                <button
                    onClick={handleClearSearch}
                    className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                    Clear Search
                </button>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <header className='sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700'>
                <div className='flex items-center justify-between p-4'>
                    <BeatHubLogo />

                    {/* Search Bar */}
                    <div className='flex-1 max-w-md mx-4'>
                        <div className='relative'>
                            <CiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl' />
                            <input
                                type="text"
                                placeholder={`Search ${type}...`}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all'
                            />
                            {searchInput && (
                                <button
                                    onClick={handleClearSearch}
                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
                                >
                                    <IoClose />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className='flex items-center gap-3'>
                        {/* Slider */}
                        <div className='flex items-center gap-3'>
                            <CiGrid41 className='text-lg text-gray-400' />
                            <input
                                type="range"
                                min="3"
                                max="8"
                                value={gridColumns}
                                onChange={(e) => setGridColumns(parseInt(e.target.value))}
                                className='w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                                title={`Grid columns: ${gridColumns}`}
                            />
                            <span className='text-sm text-gray-400 min-w-[8px]'>
                                {gridColumns}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                            title="Toggle filters"
                        >
                            <CiFilter className='text-xl' />
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className='border-t border-gray-700'>
                    <div className='flex justify-center'>
                        {['albums', 'artists', 'tracks'].map((tabType) => (
                            <Link
                                key={tabType}
                                to={`/catalog?type=${tabType}${searchQuery ? `&search=${searchQuery}` : ''}`}
                                className={`px-6 py-3 text-sm font-medium capitalize transition-all ${type === tabType
                                    ? 'text-orange-500 border-b-2 border-orange-500 bg-gray-800/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                    }`}
                            >
                                {tabType}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Filters Panel */}
                {showFilters && (
                    <div className='border-t border-gray-700 bg-gray-800/50 p-4'>
                        <div className='flex items-center justify-between max-w-4xl mx-auto'>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-gray-400'>Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className='px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-orange-500'
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="name">Name</option>
                                    <option value="popularity">Popularity</option>
                                    {type === 'albums' && (
                                        <>
                                            <option value="date-newest">Release Date - Newest</option>
                                            <option value="date-oldest">Release Date - Oldest</option>
                                        </>
                                    )}
                                    {type === 'artists' && (
                                        <option value="followers">Followers</option>
                                    )}
                                </select>
                            </div>
                            <div className='text-sm text-gray-400'>
                                {contentStats}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className='container mx-auto px-4 py-6'>
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center py-16">
                        <div className="text-red-500 text-xl mb-4">{error}</div>
                        <button
                            onClick={() => fetchData(isSearchActive, searchQuery)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {renderContent()}

                        {/* Load More Button */}
                        {hasMore && data.length >= 20 && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className={`px-6 py-3 text-white rounded-lg transition-all duration-200 border border-gray-600 flex items-center gap-3 mx-auto ${loadingMore
                                        ? 'bg-gray-700 cursor-not-allowed opacity-75'
                                        : 'bg-gray-800 hover:bg-gray-700'
                                        }`}
                                >
                                    {loadingMore ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-orange-500"></div>
                                            Loading more {type}...
                                        </>
                                    ) : (
                                        `Load More ${type}`
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}

export default catalog