import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes, FaUserCircle } from 'react-icons/fa';
import { getReviewsByItem } from '../api/reviews';
import ReviewCard from './ReviewCard';
import { useAuth } from '../context/AuthContext';

const ReviewList = ({ itemId, itemType, onUserReviewFound }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();

    const [visibleCount, setVisibleCount] = useState(4);
    const REVIEWS_PER_PAGE = 4;

    const [selectedReview, setSelectedReview] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);

    const fetchReviews = async () => {
        if (!itemId) return;

        try {
            setLoading(true);
            const data = await getReviewsByItem(itemId);
            setReviews(data);
            console.log("Fetched reviews:", data);
            console.log("Current user:", user.email);

            if (user && data.length > 0) {
                const userReview = data.find(review => review.email === user.email);

                console.log("Found user review:", userReview);

                if (userReview && onUserReviewFound) {
                    onUserReviewFound(userReview);
                } else if (onUserReviewFound) {
                    onUserReviewFound(null);
                }
            }

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
        setVisibleCount(REVIEWS_PER_PAGE);
    }, [itemId]);

    const renderStars = (rating, sizeClass = "text-sm") => {
        return (
            <div className={`flex text-orange-500 ${sizeClass}`}>
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < rating ? "#f97316" : "#374151"} />
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + REVIEWS_PER_PAGE);
    };

    const openReadMoreModal = (review) => {
        setSelectedReview(review);
        setIsReadModalOpen(true);
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = totalStars / reviews.length;
        return average.toFixed(1);
    };

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
    if (error) return <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-xl">{error}</div>;

    const averageRating = getAverageRating();
    const visibleReviews = reviews.slice(0, visibleCount);
    const hasMoreReviews = visibleCount < reviews.length;

    return (
        <div className="space-y-6">
            {itemType !== 'track' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-white">Community Reviews</h2>

                    {reviews.length > 0 && (
                        <div className="flex items-center gap-4 bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-2">
                                <FaStar className="text-orange-500 text-xl" />
                                <span className="text-white font-bold text-lg">{averageRating}</span>
                                <span className="text-gray-500 text-sm">/ 5</span>
                            </div>

                            <div className="w-px h-6 bg-gray-700"></div>

                            <span className="text-gray-400 text-sm font-medium">
                                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="text-center p-12 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                    <p className="text-gray-400 mb-2">No reviews yet.</p>
                    <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 items-start">
                        {visibleReviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                renderStars={renderStars}
                                formatDate={formatDate}
                                onReadMore={openReadMoreModal}
                            />
                        ))}
                    </div>

                    {hasMoreReviews && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full transition-colors border border-gray-700 hover:border-gray-500"
                            >
                                Load more reviews ({reviews.length - visibleCount} remaining)
                            </button>
                        </div>
                    )}
                </>
            )}

            {isReadModalOpen && selectedReview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                        <button
                            onClick={() => setIsReadModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <FaTimes />
                        </button>

                        <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-6">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md text-xl shrink-0">
                                {selectedReview.username ? selectedReview.username.charAt(0).toUpperCase() : <FaUserCircle />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedReview.username || 'Anonymous'}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    {renderStars(selectedReview.rating, "text-lg")}
                                    <span className="text-sm text-gray-500">{formatDate(selectedReview.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap break-words">
                                {selectedReview.comment}
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewList;