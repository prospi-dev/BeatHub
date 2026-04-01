import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActivityFeed } from '../../api/network';
import { getTrackDetails, getAlbumDetails, getArtistsDetails } from '../../api/spotifyService';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaHeart, FaStar, FaMusic, FaCompactDisc, FaMicrophone, FaUserFriends } from 'react-icons/fa';

const FeedView = () => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedAndHydrate = async () => {
            try {
                setLoading(true);

                const rawFeed = await getActivityFeed();

                if (!rawFeed || rawFeed.length === 0) {
                    setFeed([]);
                    setLoading(false);
                    return;
                }

                const fetchSpotifyDetails = async (item) => {
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
                        return { ...item, spotifyData };
                    } catch (e) {
                        return { ...item, spotifyData: { name: 'Unknown Item', image: '/default-album.png', artist: 'Unknown' } };
                    }
                };

                const hydratedFeed = await Promise.all(rawFeed.map(item => fetchSpotifyDetails(item)));

                setFeed(hydratedFeed);
                setError(null);
            } catch (err) {
                console.error("Error fetching feed:", err);
                setError("Failed to load your activity feed.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedAndHydrate();
    }, []);

    const renderStars = (rating) => (
        <div className="flex text-orange-500 text-xs">
            {[...Array(5)].map((_, i) => <FaStar key={i} color={i < rating ? "#f97316" : "#374151"} />)}
        </div>
    );

    const getItemIcon = (type) => {
        if (type === 'track') return <FaMusic className="text-gray-400 text-xs" />;
        if (type === 'album') return <FaCompactDisc className="text-gray-400 text-xs" />;
        return <FaMicrophone className="text-gray-400 text-xs" />;
    };

    if (loading) return <LoadingSpinner message='Loading feed...' />;

    const filteredFeed = feed.filter(item => {
        if (filter === 'all') return true;
        return item.activityType === filter;
    });

    return (
        <div className="w-full max-w-3xl mx-auto pb-12">
            {error ? (
                <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-red-500/50 text-red-400">
                    {error}
                </div>
            ) : feed.length === 0 ? (
                <div className="text-center p-12 bg-gray-800/30 rounded-3xl border border-gray-700/50">
                    <FaUserFriends className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-400 mb-2">It's quiet here...</h2>
                    <p className="text-gray-500 mb-6">You aren't following anyone yet, or they haven't posted anything.</p>
                    <button onClick={() => navigate('/catalog?type=albums')} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors">
                        Explore Catalog
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6 bg-gray-900 rounded-lg p-1 border border-gray-700 w-fit">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            All Activity
                        </button>
                        <button
                            onClick={() => setFilter('REVIEW')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${filter === 'REVIEW' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FaStar className={filter === 'REVIEW' ? 'text-orange-500' : ''} /> Reviews
                        </button>
                        <button
                            onClick={() => setFilter('FAVORITE')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${filter === 'FAVORITE' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FaHeart className={filter === 'FAVORITE' ? 'text-pink-500' : ''} /> Favorites
                        </button>
                    </div>

                    {filteredFeed.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 italic bg-gray-800/30 rounded-2xl border border-gray-700/50">
                            No {filter === 'REVIEW' ? 'reviews' : 'favorites'} to show right now.
                        </div>
                    ) : (
                        filteredFeed.map((activity, idx) => (
                            <div key={`${activity.id}-${idx}`} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 hover:border-gray-500 transition-colors">
                                {/* ACTIVITY HEADER */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-sm">
                                            {activity.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <Link to={`/user/${activity.username}`} className="font-bold hover:text-orange-400 transition-colors">
                                                {activity.username}
                                            </Link>
                                            <span className="text-gray-400 text-sm ml-1">
                                                {activity.activityType === 'REVIEW' ? 'reviewed' : 'favorited'} {activity.itemType}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(activity.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <Link to={`/${activity.itemType}/${activity.spotifyItemId}`} className="block bg-gray-900/50 rounded-xl p-4 group">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={activity.spotifyData?.image}
                                            alt="cover"
                                            className="w-16 h-16 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white truncate pr-2 group-hover:text-orange-400 transition-colors">
                                                    {activity.spotifyData?.name}
                                                </h3>
                                                <div className="shrink-0">
                                                    {activity.activityType === 'REVIEW' && renderStars(activity.rating)}
                                                    {activity.activityType === 'FAVORITE' && <FaHeart className="text-pink-500" />}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                {getItemIcon(activity.itemType)}
                                                <span className="capitalize">{activity.itemType}</span>
                                                {activity.spotifyData?.artist && (
                                                    <><span>•</span><span className="truncate">{activity.spotifyData.artist}</span></>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show comment if it is a review */}
                                    {activity.activityType === 'REVIEW' && activity.comment && (
                                        <p className="mt-4 text-gray-300 text-sm italic border-l-2 border-gray-700 pl-3 line-clamp-3">
                                            "{activity.comment}"
                                        </p>
                                    )}
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
export default FeedView;