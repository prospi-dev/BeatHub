import React, { useState } from 'react';
import { FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import { createReview } from '../api/reviews'

const ReviewModal = ({ isOpen, onClose, itemName, itemId, itemType }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating of at least 1 star.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const trimmedComment = comment.trim();

            const payload = {
                spotifyItemId: itemId,
                rating,
                itemType,
                ...(trimmedComment ? { comment: trimmedComment } : {})
            };

            await createReview( payload);

            setSuccess(true);

            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                (typeof err?.response?.data === 'string' ? err.response.data : null);

            setError(backendMessage || 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRating(0);
        setHover(0);
        setComment('');
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">

            <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                >
                    <FaTimes />
                </button>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaStar className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Review Submitted!</h3>
                        <p className="text-gray-400">Thanks for sharing your thoughts.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2">Add Review</h2>
                        <p className="text-gray-400 mb-6">
                            What do you think about <span className="font-semibold text-orange-500">{itemName}</span>?
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="flex justify-center gap-2">
                                {[...Array(5)].map((_, index) => {
                                    const currentRating = index + 1;
                                    return (
                                        <label key={index} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="rating"
                                                className="hidden"
                                                value={currentRating}
                                                onClick={() => setRating(currentRating)}
                                            />
                                            <FaStar
                                                className="text-4xl transition-colors duration-150"
                                                color={currentRating <= (hover || rating) ? "#f97316" : "#374151"} // orange-500 vs gray-700
                                                onMouseEnter={() => setHover(currentRating)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Thoughts (Optional)
                                </label>
                                <textarea
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                                    rows="4"
                                    placeholder="Write a review... (max 1000 characters)"
                                    maxLength={1000}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {comment.length}/1000
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;