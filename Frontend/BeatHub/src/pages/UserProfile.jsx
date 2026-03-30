import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../api/users';
import { FaUserCircle, FaStar, FaHeart, FaMusic, FaCompactDisc, FaMicrophone } from 'react-icons/fa';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteTab, setFavoriteTab] = useState('all'); // 'all', 'artist', 'album', 'track'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile(username);
                setProfile(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("User not found or an error occurred.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    const renderStars = (rating) => {
        return (
            <div className="flex text-orange-500 text-sm">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < rating ? "#f97316" : "#374151"} />
                ))}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen bg-gray-900"><Header /><LoadingSpinner message='Loading profile...' /></div>;
    
    if (error) return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />
            <div className="container mx-auto p-8 text-center mt-20">
                <h2 className="text-3xl font-bold mb-4 text-gray-400">{error}</h2>
                <button onClick={() => navigate('/catalog')} className="text-orange-500 hover:underline">Go back to Catalog</button>
            </div>
        </div>
    );

    const filteredFavorites = favoriteTab === 'all' 
        ? profile.favorites 
        : profile.favorites.filter(fav => fav.itemType === favoriteTab);

    const getItemIcon = (type) => {
        switch(type) {
            case 'artist': return <FaMicrophone className="text-blue-400" />;
            case 'album': return <FaCompactDisc className="text-purple-400" />;
            case 'track': return <FaMusic className="text-green-400" />;
            default: return <FaHeart />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-12">
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />

            <div className="container mx-auto px-4 mt-8 md:mt-12">
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl mb-12">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shrink-0 text-5xl">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 font-medium">
                            <span className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                                <FaStar className="text-orange-500" /> {profile.totalReviews} Reviews
                            </span>
                            <span className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                                <FaHeart className="text-pink-500" /> {profile.totalFavorites} Favorites
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* REVIEWS */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                            <FaStar className="text-orange-500" /> Recent Reviews
                        </h2>
                        
                        {profile.reviews.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50">This user hasn't written any reviews yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {profile.reviews.map((review) => (
                                    <Link 
                                        to={`/${review.itemType}/${review.spotifyItemId}`} 
                                        key={review.id}
                                        className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-orange-500/50 rounded-2xl p-5 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1 block">
                                                    {review.itemType}
                                                </span>
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {review.comment ? (
                                            <p className="text-gray-300 text-sm italic mt-2 line-clamp-3">"{review.comment}"</p>
                                        ) : (
                                            <p className="text-gray-600 text-sm mt-2">No comment provided.</p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FAVORITES */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FaHeart className="text-pink-500" /> Favorites
                            </h2>
                            
                            {profile.favorites.length > 0 && (
                                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                                    {['all', 'artist', 'album', 'track'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setFavoriteTab(tab)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                                                favoriteTab === tab 
                                                ? 'bg-gray-600 text-white shadow-sm' 
                                                : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {profile.favorites.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50">This user hasn't saved any favorites yet.</p>
                        ) : filteredFavorites.length === 0 ? (
                            <p className="text-gray-500 italic">No {favoriteTab}s in favorites.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {filteredFavorites.map((fav, idx) => (
                                    <Link 
                                        to={`/${fav.itemType}/${fav.spotifyItemId}`} 
                                        key={idx}
                                        className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-pink-500/50 rounded-xl p-4 transition-all duration-300 flex items-center gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center shrink-0 border border-gray-700 group-hover:border-pink-500/50 transition-colors">
                                            {getItemIcon(fav.itemType)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-semibold text-white group-hover:text-pink-400 transition-colors truncate">
                                                View {fav.itemType}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Saved {new Date(fav.addedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default UserProfile;