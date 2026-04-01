import React from 'react';
import { FaUserCircle, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ReviewCard = ({ review, renderStars, formatDate, onReadMore, isOwner, onDelete }) => {
    const MAX_LENGTH = 30;
    const isLongComment = review.comment && review.comment.length > MAX_LENGTH;

    return (
        <div className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-5 transition-all duration-300 h-fit">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <Link to={`/user/${review.username || 'unknown'}`} className="flex items-center gap-3 group">
                        {review.avatarUrl ? (
                            <img
                                src={review.avatarUrl}
                                alt={`${review.username}'s avatar`}
                                className="w-10 h-10 rounded-full object-cover border border-gray-600 group-hover:border-orange-500 transition-colors"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shrink-0 transition-transform group-hover:scale-105">
                                {review.username ? review.username.charAt(0).toUpperCase() : <FaUserCircle className="text-xl" />}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-white group-hover:text-orange-500 transition-colors">
                                {review.username || 'Anonymous'}
                            </p>
                            {renderStars(review.rating)}
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs text-gray-500 font-medium whitespace-nowrap ml-2 `}>
                        {formatDate(review.createdAt)}
                    </span>
                    {isOwner && (
                        <button
                            onClick={() => onDelete(review.id)}
                            className=" text-gray-500 hover:text-orange-500 transition-colors focus:outline-none mr-1"
                            title="Delete your review"
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            </div>

            {review.comment ? (
                <div className="mt-4">
                    <p className="text-gray-300 text-sm leading-relaxed break-words">
                        {isLongComment
                            ? `${review.comment.substring(0, MAX_LENGTH)}...`
                            : review.comment}
                    </p>
                    {isLongComment && (
                        <button
                            onClick={() => onReadMore(review)}
                            className="text-orange-500 hover:text-orange-400 text-xs font-semibold mt-2 transition-colors focus:outline-none"
                        >
                            Read more
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 text-sm italic mt-4">
                    No comment provided.
                </p>
            )}
        </div>
    );
};

export default ReviewCard;