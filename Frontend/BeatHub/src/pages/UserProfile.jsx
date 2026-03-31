import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar, FaHeart, FaMusic, FaCompactDisc, FaMicrophone, FaSearch } from 'react-icons/fa';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { useAppAuth } from '../hooks/useAppAuth';
import { useProfile } from '../hooks/useProfile';
import { followUser, unfollowUser } from '../api/network';

// --- UTILS ---
const renderStars = (rating) => (
    <div className="flex text-orange-500 text-sm">
        {[...Array(5)].map((_, i) => <FaStar key={i} color={i < rating ? "#f97316" : "#374151"} />)}
    </div>
);

const getItemIcon = (type) => {
    if (type === 'track') return <FaMusic className="text-gray-400" />;
    if (type === 'album') return <FaCompactDisc className="text-gray-400" />;
    return <FaMicrophone className="text-gray-400" />;
};

// --- UI COMPONENTS ---
const ProfileHeader = ({ profile, searchQuery, setSearchQuery, isOwnProfile, isFollowing, handleFollowToggle, followLoading }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl mb-12 relative overflow-hidden">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shrink-0 text-5xl z-10">
            {profile.username.charAt(0).toUpperCase()}
        </div>

        <div className="text-center md:text-left flex-1 z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold">{profile.username}</h1>

                {!isOwnProfile && (
                    <button
                        onClick={handleFollowToggle}
                        disabled={followLoading}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${isFollowing
                            ? 'bg-gray-700 hover:bg-red-500/80 text-white border border-gray-600 hover:border-red-500'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                            } disabled:opacity-50`}
                    >
                        {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 font-medium mt-3">
                <span className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                    <FaStar className="text-orange-500" /> {profile.totalReviews} Reviews
                </span>
                <span className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                    <FaHeart className="text-pink-500" /> {profile.totalFavorites} Favorites
                </span>
            </div>
        </div>

        <div className="w-full md:w-72 mt-4 md:mt-0 relative z-10">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text" placeholder="Search in profile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
        </div>
    </div>
);

const ReviewsColumn = ({ rawReviews, displayedReviews, debouncedSearch, loadingReviews, reviewsPage, hasMoreReviews, setReviewsPage }) => (
    <div className="relative">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
            Reviews <span className="text-sm font-normal text-gray-500">({rawReviews.length})</span>
        </h2>
        {loadingReviews && reviewsPage === 1 ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-600 border-t-orange-500 rounded-full animate-spin"></div></div>
        ) : displayedReviews.length === 0 ? (
            <p className="text-gray-500 italic bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                {debouncedSearch ? 'No reviews match your search.' : 'No reviews yet.'}
            </p>
        ) : (
            <div className="space-y-4">
                {displayedReviews.map((review) => (
                    <Link to={`/${review.itemType}/${review.spotifyItemId}`} key={review.id} className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-orange-500/50 rounded-2xl p-4 transition-all duration-300 flex flex-col gap-3">
                        <div className="flex items-start gap-4">
                            <img src={review.spotifyData?.image || '/default-album.png'} alt="cover" className="w-16 h-16 rounded-lg object-cover shadow-md bg-gray-900 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start"><h3 className="font-bold text-white truncate pr-2">{review.spotifyData?.name || 'Loading...'}</h3>{renderStars(review.rating)}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                    {getItemIcon(review.itemType)}<span className="capitalize">{review.itemType}</span>
                                    {review.spotifyData?.artist && (<><span>•</span><span className="truncate">{review.spotifyData.artist}</span></>)}
                                </div>
                            </div>
                        </div>
                        {review.comment && <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded-xl italic line-clamp-3">"{review.comment}"</p>}
                        <span className="text-xs text-gray-500 text-right w-full">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </Link>
                ))}
            </div>
        )}
        {hasMoreReviews && (
            <button onClick={() => setReviewsPage(prev => prev + 1)} disabled={loadingReviews} className={`w-full py-3 mt-4 border rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${loadingReviews ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white hover:border-gray-500'}`}>
                {loadingReviews && reviewsPage > 1 && <div className="w-4 h-4 border-2 border-gray-400 border-t-orange-500 rounded-full animate-spin"></div>}
                {loadingReviews && reviewsPage > 1 ? 'Loading...' : 'Load More Reviews'}
            </button>
        )}
    </div>
);

const FavoritesColumn = ({ rawFavorites, displayedFavorites, debouncedSearch, favFilter, setFavFilter, loadingFavs, favsPage, hasMoreFavorites, setFavsPage }) => (
    <div className="relative">
        <div className="flex flex-row xl:items-center justify-between gap-4 border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 whitespace-nowrap">
                Favorites <span className="text-sm font-normal text-gray-500">({rawFavorites.length})</span>
            </h2>
            {rawFavorites.length > 0 && (
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700 overflow-x-auto hide-scrollbar">
                    {['all', 'track', 'album', 'artist'].map(filter => (
                        <button key={filter} onClick={() => setFavFilter(filter)} className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${favFilter === filter ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>{filter}</button>
                    ))}
                </div>
            )}
        </div>
        {loadingFavs && favsPage === 1 ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-600 border-t-pink-500 rounded-full animate-spin"></div></div>
        ) : displayedFavorites.length === 0 ? (
            <p className="text-gray-500 italic bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                {debouncedSearch ? 'No favorites match your search.' : favFilter === 'all' ? 'No favorites yet.' : `No ${favFilter}s in favorites.`}
            </p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedFavorites.map((fav) => (
                    <Link to={`/${fav.itemType}/${fav.spotifyItemId}`} key={`${fav.itemType}-${fav.spotifyItemId}`} className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-pink-500/50 rounded-2xl p-3 transition-all duration-300 flex items-center gap-4 group">
                        <div className="relative w-14 h-14 shrink-0">
                            <img src={fav.spotifyData?.image || '/default-album.png'} alt="cover" className={`w-full h-full object-cover shadow-md bg-gray-900 ${fav.itemType === 'artist' ? 'rounded-full' : 'rounded-lg'}`} />
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700 text-xs">{getItemIcon(fav.itemType)}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-sm truncate group-hover:text-pink-400 transition-colors">{fav.spotifyData?.name || 'Loading...'}</h3>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{fav.spotifyData?.artist}</p>
                        </div>
                    </Link>
                ))}
            </div>
        )}
        {hasMoreFavorites && (
            <button onClick={() => setFavsPage(prev => prev + 1)} disabled={loadingFavs} className={`w-full py-3 mt-4 border rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${loadingFavs ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white hover:border-gray-500'}`}>
                {loadingFavs && favsPage > 1 && <div className="w-4 h-4 border-2 border-gray-400 border-t-pink-500 rounded-full animate-spin"></div>}
                {loadingFavs && favsPage > 1 ? 'Loading...' : 'Load More Favorites'}
            </button>
        )}
    </div>
);


// --- MAIN ORCHESTRATOR COMPONENT ---
const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user } = useAppAuth();

    // Local Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [favFilter, setFavFilter] = useState('all');
    const debouncedSearch = useDebounce(searchQuery, 400);

    // Network States
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const {
        profile, loadingProfile, error,
        rawReviews, rawFavorites, displayedReviews, displayedFavorites,
        loadingReviews, loadingFavs, reviewsPage, setReviewsPage,
        favsPage, setFavsPage, hasMoreReviews, hasMoreFavorites,
        initialIsFollowing
    } = useProfile(username, debouncedSearch, favFilter);

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const isOwnProfile = user && (user.username === username);

    const handleFollowToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setFollowLoading(true);
            if (isFollowing) {
                await unfollowUser(username);
                setIsFollowing(false);
            } else {
                await followUser(username);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        } finally {
            setFollowLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-12">
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />
            <div className="container mx-auto px-4 mt-8 md:mt-12">

                <ProfileHeader
                    profile={profile}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isOwnProfile={isOwnProfile}
                    isFollowing={isFollowing}
                    handleFollowToggle={handleFollowToggle}
                    followLoading={followLoading}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[400px]">
                    <ReviewsColumn
                        rawReviews={rawReviews} displayedReviews={displayedReviews} debouncedSearch={debouncedSearch}
                        loadingReviews={loadingReviews} reviewsPage={reviewsPage} hasMoreReviews={hasMoreReviews} setReviewsPage={setReviewsPage}
                    />
                    <FavoritesColumn
                        rawFavorites={rawFavorites} displayedFavorites={displayedFavorites} debouncedSearch={debouncedSearch}
                        favFilter={favFilter} setFavFilter={setFavFilter} loadingFavs={loadingFavs} favsPage={favsPage}
                        hasMoreFavorites={hasMoreFavorites} setFavsPage={setFavsPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;