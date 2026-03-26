import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { getReviewsByItem } from '../api/reviews';

const ReviewList = ({ itemId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        if (!itemId) return;

        try {
            setLoading(true);
            const data = await getReviewsByItem(itemId);
            setReviews(data);
            setError('');
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError('Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [itemId]);

    // Function to render star ratings
    const renderStars = (rating) => {
        return (
            <div className="flex text-orange-500 text-sm">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < rating ? "#f97316" : "#374151"} />
                ))}
            </div>
        );
    };

    // Function to format date in a user-friendly way
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-xl">{error}</div>;
    }

    return (
        <div className="mt-8 space-y-6">
            {reviews[0].itemType != 'track' && (
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Community Reviews</h2>
                    <span className="text-gray-400 text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </span>
                </div>)}

            {reviews.length === 0 ? (
                <div className="text-center p-12 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                    <p className="text-gray-400 mb-2">No reviews yet.</p>
                    <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-5 transition-all duration-300"
                        >
                            {/* Review Header: User + Stars + Date */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                                        {/* Take the first letter of the user, or an icon if it fails */}
                                        {review.username ? review.username.charAt(0).toUpperCase() : <FaUserCircle />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{review.username || 'Anonymous'}</p>
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    {formatDate(review.createdAt)}
                                </span>
                            </div>

                            {/* Review Body: Comment */}
                            {review.comment ? (
                                <p className="text-gray-300 text-sm leading-relaxed mt-4">
                                    "{review.comment}"
                                </p>
                            ) : (
                                <p className="text-gray-500 text-sm italic mt-4">
                                    No comment provided.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewList;