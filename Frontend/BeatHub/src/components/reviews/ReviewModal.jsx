import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import { createReview, updateReview } from '../../api/reviews'

const ReviewModal = ({ isOpen, onClose, itemName, itemId, itemType, existingReview, onReviewSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // State to control the animation lifecycle
    const [isMounted, setIsMounted] = useState(false);   
    const [isVisible, setIsVisible] = useState(false);   

    // Opening logic: mount first, then enable visibility (one frame later)
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            // Small delay so the browser paints the initial state before animating
            const t = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(t);
        } else {
            // On close: hide first (triggers exit animation), then unmount
            setIsVisible(false);
            const t = setTimeout(() => setIsMounted(false), 250); 
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || '');
        } else if (isOpen && !existingReview) {
            setRating(0);
            setComment('');
        }
    }, [isOpen, existingReview]);

    // Unmounting is managed here, not directly by React
    if (!isMounted) return null;

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
            if (existingReview) {
                await updateReview(existingReview.id, payload);
            } else {
                await createReview(payload);
            }
            setSuccess(true);
            if (onReviewSuccess) onReviewSuccess();
            setTimeout(() => handleClose(), 1500);
        } catch (err) {
            const backendMessage = err?.response?.data?.message || err?.response?.data?.error || (typeof err?.response?.data === 'string' ? err.response.data : null);
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
        onClose(); // isOpen -> false -> triggers the closing useEffect
    };

    return (
        // Backdrop: use an opacity transition instead of animate-in/out
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm
                transition-opacity duration-250
                ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }} // Close when clicking outside
        >
            {/* Panel: opacity + scale transition */}
            <div
                className={`relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8
                    transition-all duration-250
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
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
                                            <input type="radio" name="rating" className="hidden" value={currentRating} onClick={() => setRating(currentRating)} />
                                            <FaStar
                                                className="text-4xl transition-colors duration-150"
                                                color={currentRating <= (hover || rating) ? "#f97316" : "#374151"}
                                                onMouseEnter={() => setHover(currentRating)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Your Thoughts (Optional)</label>
                                <textarea
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                                    rows="4"
                                    placeholder="Write a review... (max 1000 characters)"
                                    maxLength={1000}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{comment.length}/1000</div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {loading ? <><FaSpinner className="animate-spin" />Submitting...</> : 'Submit Review'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;