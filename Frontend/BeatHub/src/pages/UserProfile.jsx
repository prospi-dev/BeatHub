import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../api/users';
import { FaUserCircle, FaStar, FaHeart } from 'react-icons/fa';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-12">
            <Header showBackButton={true} onBackClick={() => navigate(-1)} />

            {/* Profile Header */}
            <div className="container mx-auto px-4 mt-8 md:mt-16">
                <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
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

                {/* User Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                        Recent Reviews by {profile.username}
                    </h2>
                    
                    {profile.reviews.length === 0 ? (
                        <p className="text-gray-500 italic">This user hasn't written any reviews yet.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
                            {profile.reviews.map((review) => (
                                <Link 
                                    to={`/${review.itemType}/${review.spotifyItemId}`} 
                                    key={review.id}
                                    className="bg-gray-800/40 hover:bg-gray-700 border border-gray-700/50 hover:border-orange-500/50 rounded-2xl p-5 transition-all duration-300 block"
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
                                        <p className="text-gray-300 text-sm italic mt-3 line-clamp-3">"{review.comment}"</p>
                                    ) : (
                                        <p className="text-gray-600 text-sm mt-3">No comment provided.</p>
                                    )}
                                    <div className="mt-4 text-xs font-semibold text-gray-400 hover:text-white transition-colors">
                                        Click to view item →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;