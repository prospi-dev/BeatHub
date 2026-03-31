import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CiGrid41, CiFilter, CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaHeart, FaStar, FaMusic, FaCompactDisc, FaMicrophone, FaUserFriends } from 'react-icons/fa';

import AlbumCard from '../components/cards/AlbumCard.jsx';
import ArtistCard from '../components/cards/ArtistCard.jsx';
import TrackCard from '../components/cards/TrackCard.jsx';
import FeedView from '../components/cards/FeedView.jsx';
import Footer from '../components/layout/Footer.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Header from '../components/layout/Header.jsx';
import { useCatalogData } from '../hooks/useCatalogData.js';
import { useAppAuth } from '../hooks/useAppAuth.js';

const EmptyState = ({ type, searchQuery, handleClearSearch }) => (
    <div className="text-center py-16">
        <CiSearch className="text-6xl text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchQuery ? `No ${type} found` : `No ${type} available`}
        </h3>
        <p className="text-gray-500">
            {searchQuery ? `Try searching with different keywords` : `Check back later for new ${type}`}
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
);

const Catalog = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type') || 'albums';
    const searchQuery = searchParams.get('search') || '';

    const { user } = useAppAuth();

    // UI States
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [isSearchActive, setIsSearchActive] = useState(!!searchQuery);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');
    const [gridColumns, setGridColumns] = useState(4);

    // Custom Hook to handle data
    const {
        data, loading, error, hasMore, loadingMore,
        fetchInitialData, loadMoreData
    } = useCatalogData();

    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.trim()) {
                const newSearchParams = new URLSearchParams(location.search);
                newSearchParams.set('search', query);
                navigate(`/catalog?${newSearchParams.toString()}`, { replace: true });
            }
        }, 500),
        [location.search, navigate]
    );

    // Main effect to load data when type, search or sort changes
    useEffect(() => {
        if (type !== 'feed') {
            fetchInitialData(type, isSearchActive, searchQuery, sortBy);
        }
    }, [type, isSearchActive, searchQuery, sortBy, fetchInitialData]);

    // Effect to handle search input
    useEffect(() => {
        if (searchInput !== searchQuery) {
            if (searchInput.trim()) {
                debouncedSearch(searchInput);
                setIsSearchActive(true);
                setSortBy('relevance');
            } else {
                setIsSearchActive(false);
                const newSearchParams = new URLSearchParams(location.search);
                newSearchParams.delete('search');
                navigate(`/catalog?${newSearchParams.toString()}`, { replace: true });
            }
        }
    }, [searchInput, searchQuery, debouncedSearch, location.search, navigate]);

    const handleTypeChange = (newType) => {
        // If user tries to access the feed without being logged in, redirect to login page
        if (newType === 'feed' && !user) {
            navigate('/login');
            return;
        }
        setIsSearchActive(false);
        setSearchInput('');
        setSortBy('relevance');
        const newSearchParams = new URLSearchParams();
        newSearchParams.set('type', newType);
        navigate(`/catalog?${newSearchParams.toString()}`);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setIsSearchActive(false);
    };

    const handleLoadMoreClick = () => {
        loadMoreData(type, isSearchActive, searchQuery, sortBy);
    };

    const contentStats = useMemo(() => {
        const total = data.length;
        const searchText = searchQuery ? ` for "${searchQuery}"` : '';
        return `${total} ${type}${searchText}`;
    }, [data.length, type, searchQuery]);

    const renderContent = () => {
        // IF ITS FEED, WE DON'T USE EITHER THE GRID OF THE SORTING
        if (type === 'feed') {
            return <FeedView />;
        }

        const gridClasses = {
            3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
            4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4',
            5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
            6: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
            7: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7',
            8: 'grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
        };
        const contentClass = `grid ${gridClasses[gridColumns] || gridClasses[4]} gap-8`;

        return (
            <div className={contentClass}>
                {data.map((item) => {
                    const cardProps = { key: item.id, [type.slice(0, -1)]: item, gridColumns };
                    switch (type) {
                        case 'feed': return <FeedView />;
                        case 'albums': return <AlbumCard {...cardProps} />;
                        case 'artists': return <ArtistCard {...cardProps} />;
                        case 'tracks': return <TrackCard {...cardProps} />;
                        default: return null;
                    }
                })}
            </div>
        );
    };

    // Props injected into the Header
    const searchBar = (
        <div className='relative'>
            <CiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl' />
            <input
                type="text"
                placeholder={`Search ${type}...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={type === 'feed'}
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
    );

    const navigationTabs = (
        <>
            <nav className='relative flex border-t border-gray-700 min-h-11'>
                <div className='absolute left-1/2 -translate-x-1/2 flex justify-center items-center'>
                    {['feed', 'albums', 'artists', 'tracks'].map((tabType) => {
                        const targetUrl = tabType === 'feed' && !user
                            ? '/login'
                            : `/catalog?type=${tabType}${searchQuery && tabType !== 'feed' ? `&search=${searchQuery}` : ''}`;
                        return (
                            <Link
                                key={tabType}
                                to={targetUrl}
                                className={`px-6 py-3 text-sm font-medium capitalize transition-all ${type === tabType
                                    ? 'text-orange-500 border-b-2 border-orange-500 bg-gray-800/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                    }`}
                            >
                                {tabType}
                            </Link>
                        )
                    })}
                </div>
                <div className='hidden md:flex items-center gap-3 ml-auto mr-5'>
                    <CiGrid41 className='text-lg text-gray-400' />
                    <input
                        type="range" min="3" max="8"
                        value={gridColumns}
                        onChange={(e) => setGridColumns(parseInt(e.target.value))}
                        className='w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                    />
                    <span className='text-sm text-gray-400 min-w-[8px]'>{gridColumns}</span>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                        <CiFilter className='text-xl' />
                    </button>
                </div>
            </nav>
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
                        <div className='text-sm text-gray-400'>{contentStats}</div>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header centerContent={searchBar} bottomContent={navigationTabs} />

            <main className='container mx-auto px-4 py-6'>
                {type === 'feed' ? (
                    renderContent()
                ) : loading ? (
                    <LoadingSpinner message={`Loading ${type}...`} />
                ) : error ? (
                    <div className="text-center py-16">
                        <div className="text-red-500 text-xl mb-4">{error}</div>
                        <button
                            onClick={() => fetchInitialData(type, isSearchActive, searchQuery, sortBy)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : data.length === 0 ? (
                    <EmptyState type={type} searchQuery={searchQuery} handleClearSearch={handleClearSearch} />
                ) : (
                    <>
                        {renderContent()}
                        {hasMore && data.length >= 20 && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={handleLoadMoreClick}
                                    disabled={loadingMore}
                                    className={`px-6 py-3 text-white rounded-lg transition-all duration-200 border border-gray-600 flex items-center gap-3 mx-auto ${loadingMore ? 'bg-gray-700 cursor-not-allowed opacity-75' : 'bg-gray-800 hover:bg-gray-700'}`}
                                >
                                    {loadingMore ? (
                                        <><div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-orange-500"></div>Loading more {type}...</>
                                    ) : (
                                        `Load More ${type}`
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Catalog;