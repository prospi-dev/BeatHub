import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../api/users';
import { getTrackDetails, getAlbumDetails, getArtistsDetails } from '../api/spotifyService';
import { FaStar, FaHeart, FaMusic, FaCompactDisc, FaMicrophone, FaSearch } from 'react-icons/fa';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    // Raw data from backend (IDs only)
    const [profile, setProfile] = useState(null);
    const [rawReviews, setRawReviews] = useState([]);
    const [rawFavorites, setRawFavorites] = useState([]);

    // Hydrated data with Spotify info
    const [enrichedReviews, setEnrichedReviews] = useState([]);
    const [enrichedFavorites, setEnrichedFavorites] = useState([]);

    // Loading states
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [loadingFavs, setLoadingFavs] = useState(false);
    const [error, setError] = useState(null);

    // Filters
    const [favFilter, setFavFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 400);
    // Use debouncedSearch in useEffect and filters, not searchQuery directly

    // Pagination
    const ITEMS_PER_PAGE = 5;
    const [reviewsPage, setReviewsPage] = useState(1);
    const [favsPage, setFavsPage] = useState(1);

    // Why useRef and not useState for the cache? Because useRef stores the value between renders without causing a new render.
    // If I used useState, saving an item in the cache would cause a re-render, which would re-execute the effect, which would save more items… infinite loop.
    // useRef is invisible to React: it changes the value but React doesn't know about it or react to it.
    const spotifyCache = useRef(new Map()); // persists across renders, doesn't cause re-renders

    // Helper: Function to fetch Spotify data for an item
    const fetchSpotifyDetails = useCallback(async (item) => {
        // 1. Is it already in the component's local cache?
        if (spotifyCache.current.has(item.spotifyItemId)) {
            return { ...item, spotifyData: spotifyCache.current.get(item.spotifyItemId) };
        }

        try {
            let spotifyData = null;
            if (item.itemType === 'track') {
                const res = await getTrackDetails(item.spotifyItemId);
                spotifyData = { name: res.track.name, image: res.track.album.images[0]?.url, artist: res.track.artists[0]?.name };
            } else if (item.itemType === 'album') {
                const res = await getAlbumDetails(item.spotifyItemId);
                spotifyData = { name: res.album.name, image: res.album.images[0]?.url, artist: res.album.artists[0]?.name };
            } else if (item.itemType === 'artist') {
                const res = await getArtistsDetails(item.spotifyItemId);
                spotifyData = { name: res.artist.name, image: res.artist.images[0]?.url, artist: 'Artist' };
            }

            // 2. Save to cache before returning
            spotifyCache.current.set(item.spotifyItemId, spotifyData);
            return { ...item, spotifyData };
        } catch (e) {
            const fallback = { name: 'Unknown Item', image: null, artist: 'Unknown' };
            spotifyCache.current.set(item.spotifyItemId, fallback);
            return { ...item, spotifyData: fallback };
        }
    }, []);

    // 1. INITIAL PROFILE LOAD (FAST)
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoadingProfile(true);
                const data = await getUserProfile(username);
                setProfile(data);
                setRawReviews(data.reviews || []);
                setRawFavorites(data.favorites || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("User not found or an error occurred.");
            } finally {
                setLoadingProfile(false);
            }
        };

        if (username) {
            fetchProfileData();
            setEnrichedReviews([]);
            setEnrichedFavorites([]);
            setReviewsPage(1);
            setFavsPage(1);
            setSearchQuery('');
        }
    }, [username]);

    // 2. LAZY HYDRATION FOR REVIEWS
    useEffect(() => {
        // Abort Controller: While Spotify responds (can take 200-500ms), the user might clear the search and type something else.
        // Without the controller, two responses could arrive and the second might overwrite the first unpredictably.
        const controller = new AbortController();

        const hydrateVisibleReviews = async () => {
            if (rawReviews.length === 0) return;
            setLoadingReviews(true);

            const itemsToHydrate = debouncedSearch
                ? rawReviews
                : rawReviews.slice(0, reviewsPage * ITEMS_PER_PAGE);

            const hydrated = await Promise.all(itemsToHydrate.map(fetchSpotifyDetails));

            // If this effect was already canceled (user kept typing), we don't update state
            if (!controller.signal.aborted) {
                setEnrichedReviews(hydrated);
                setLoadingReviews(false);
            }
        };

        hydrateVisibleReviews();
        return () => controller.abort(); // cleanup on unmount or re-run
    }, [reviewsPage, rawReviews, debouncedSearch, fetchSpotifyDetails]);

    // 3. LAZY HYDRATION FOR FAVORITES
    useEffect(() => {
        const hydrateVisibleFavs = async () => {
            if (rawFavorites.length === 0) { setEnrichedFavorites([]); return; }
            setLoadingFavs(true);

            const itemsToHydrate = searchQuery
                ? rawFavorites
                : rawFavorites.slice(0, favsPage * ITEMS_PER_PAGE);

            const hydrated = await Promise.all(itemsToHydrate.map(fetchSpotifyDetails));
            setEnrichedFavorites(hydrated);
            setLoadingFavs(false);
        };
        hydrateVisibleFavs();
    }, [favsPage, rawFavorites, searchQuery, fetchSpotifyDetails]);

    // After: separated to avoid resetting more than necessary
    useEffect(() => {
        setReviewsPage(1);
        setFavsPage(1);
    }, [debouncedSearch]); // only when searching

    useEffect(() => {
        setFavsPage(1);
    }, [favFilter]); // only favorites change on tab switch

    const renderStars = (rating) => {
        return (
            <div className="flex text-orange-500 text-sm">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < rating ? "#f97316" : "#374151"} />
                ))}
            </div>
        );
    };

    const getItemIcon = (type) => {
        if (type === 'track') return <FaMusic className="text-gray-400" />;
        if (type === 'album') return <FaCompactDisc className="text-gray-400" />;
        return <FaMicrophone className="text-gray-400" />;
    };

    if (loadingProfile) return <div className="min-h-screen bg-gray-900"><Header /><LoadingSpinner message='Loading profile...' /></div>;

    if (error) return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />
            <div className="container mx-auto p-8 text-center mt-20">
                <h2 className="text-3xl font-bold mb-4 text-gray-400">{error}</h2>
                <button onClick={() => navigate('/catalog')} className="text-orange-500 hover:underline">Go back to Catalog</button>
            </div>
        </div>
    );

    // 4. FILTERING LOGIC (applies only to hydrated and loaded items)
    const lowerQuery = searchQuery.toLowerCase();

    const displayedReviews = enrichedReviews.filter(review => {
        if (!searchQuery) return true;
        return (
            review.spotifyData?.name?.toLowerCase().includes(lowerQuery) ||
            review.spotifyData?.artist?.toLowerCase().includes(lowerQuery) ||
            review.comment?.toLowerCase().includes(lowerQuery) ||
            review.itemType.includes(lowerQuery)
        );
    });

    const displayedFavorites = enrichedFavorites.filter(fav => {
        const matchesTab = favFilter === 'all' || fav.itemType === favFilter;
        const matchesSearch = !searchQuery ||
            fav.spotifyData?.name?.toLowerCase().includes(lowerQuery) ||
            fav.spotifyData?.artist?.toLowerCase().includes(lowerQuery) ||
            fav.itemType.includes(lowerQuery);

        return matchesTab && matchesSearch;
    });

    // Check if there are more in the general raw database
    const hasMoreReviews = enrichedReviews.length < rawReviews.length;
    const hasMoreFavorites = enrichedFavorites.length < rawFavorites.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-12">
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />

            <div className="container mx-auto px-4 mt-8 md:mt-12">

                {/* Profile Header */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl mb-12">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shrink-0 text-5xl">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 font-medium mt-3">
                            <span className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                                <FaStar className="text-orange-500" /> {profile.totalReviews} Reviews
                            </span>
                            <span className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                                <FaHeart className="text-pink-500" /> {profile.totalFavorites} Favorites
                            </span>
                        </div>
                    </div>

                    {/* Global Profile Search */}
                    <div className="w-full md:w-72 mt-4 md:mt-0 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in profile..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                        />
                    </div>
                </div>

                {/* 2 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* COLUMN 1: REVIEWS */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                            Reviews <span className="text-sm font-normal text-gray-500">({rawReviews.length})</span>
                        </h2>

                        {displayedReviews.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                                {searchQuery ? 'No reviews match your search in loaded items.' : 'No reviews yet.'}
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {displayedReviews.map((review) => (
                                    <Link
                                        to={`/${review.itemType}/${review.spotifyItemId}`}
                                        key={review.id}
                                        className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-orange-500/50 rounded-2xl p-4 transition-all duration-300 flex flex-col gap-3"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={review.spotifyData?.image || '/default-album.png'}
                                                alt="cover"
                                                className="w-16 h-16 rounded-lg object-cover shadow-md bg-gray-900 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-white truncate pr-2">
                                                        {review.spotifyData?.name || 'Loading...'}
                                                    </h3>
                                                    {renderStars(review.rating)}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                    {getItemIcon(review.itemType)}
                                                    <span className="capitalize">{review.itemType}</span>
                                                    {review.spotifyData?.artist && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate">{review.spotifyData.artist}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {review.comment && (
                                            <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded-xl italic line-clamp-3">
                                                "{review.comment}"
                                            </p>
                                        )}
                                        <span className="text-xs text-gray-500 text-right w-full">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Load More Reviews Button with Mini Spinner */}
                        {hasMoreReviews && (
                            <button
                                onClick={() => setReviewsPage(prev => prev + 1)}
                                disabled={loadingReviews}
                                className={`w-full py-3 mt-4 border rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
                                    ${loadingReviews
                                        ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white hover:border-gray-500'
                                    }`}
                            >
                                {loadingReviews && (
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-orange-500 rounded-full animate-spin"></div>
                                )}
                                {loadingReviews ? 'Loading...' : 'Load More Reviews'}
                            </button>
                        )}
                    </div>

                    {/* COLUMN 2: FAVORITES */}
                    <div>
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-700 pb-4 mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3 whitespace-nowrap">
                                Favorites <span className="text-sm font-normal text-gray-500">({rawFavorites.length})</span>
                            </h2>

                            {/* Favorites Filter */}
                            {rawFavorites.length > 0 && (
                                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700 overflow-x-auto hide-scrollbar">
                                    {['all', 'track', 'album', 'artist'].map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setFavFilter(filter)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${favFilter === filter
                                                ? 'bg-gray-700 text-white shadow'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {displayedFavorites.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                                {searchQuery
                                    ? 'No favorites match your search in loaded items.'
                                    : favFilter === 'all' ? 'No favorites yet.' : `No ${favFilter}s in favorites.`
                                }
                            </p>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {displayedFavorites.map((fav) => (
                                        <Link
                                            to={`/${fav.itemType}/${fav.spotifyItemId}`}
                                            key={`${fav.itemType}-${fav.spotifyItemId}`}
                                            className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-pink-500/50 rounded-2xl p-3 transition-all duration-300 flex items-center gap-4 group"
                                        >
                                            <div className="relative w-14 h-14 shrink-0">
                                                <img
                                                    src={fav.spotifyData?.image || '/default-album.png'}
                                                    alt="cover"
                                                    className={`w-full h-full object-cover shadow-md bg-gray-900 ${fav.itemType === 'artist' ? 'rounded-full' : 'rounded-lg'}`}
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700 text-xs">
                                                    {getItemIcon(fav.itemType)}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-white text-sm truncate group-hover:text-pink-400 transition-colors">
                                                    {fav.spotifyData?.name || 'Loading...'}
                                                </h3>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                                    {fav.spotifyData?.artist}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Load More Favorites Button with Mini Spinner */}
                        {hasMoreFavorites && (
                            <button
                                onClick={() => setFavsPage(prev => prev + 1)}
                                disabled={loadingFavs}
                                className={`w-full py-3 mt-4 border rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
                                    ${loadingFavs
                                        ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white hover:border-gray-500'
                                    }`}
                            >
                                {loadingFavs && (
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-pink-500 rounded-full animate-spin"></div>
                                )}
                                {loadingFavs ? 'Loading...' : 'Load More Favorites'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;