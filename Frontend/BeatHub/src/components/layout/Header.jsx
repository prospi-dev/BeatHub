import React from 'react';
import { Link } from 'react-router-dom';
import BeatHubLogo from '../common/BeatHubLogo';
import { FaArrowLeft } from 'react-icons/fa';
import { useAppAuth } from '../../hooks/useAppAuth';

const Header = ({
    showBackButton = false,
    onBackClick,
    centerContent = null,
    bottomContent = null
}) => {
    const { user, handleLogout } = useAppAuth();

    return (
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 flex flex-col">
            <div className="relative flex items-center p-4 min-h-[84px]">
                <div className="flex items-center gap-2 md:gap-4 shrink-0 z-10">
                    {showBackButton && (
                        <button
                            onClick={onBackClick}
                            className="p-1.5 md:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                        >
                            <FaArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    )}
                    <div className="flex items-center">
                        <BeatHubLogo />
                    </div>
                </div>

                {centerContent && (
                    <div className="flex-1 px-2 flex justify-center w-full z-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:max-w-lg">
                        {centerContent}
                    </div>
                )}

                {/* Header Actions (Auth) */}
                <div className="flex items-center gap-2 md:gap-3 ml-auto z-10">
                    {user ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link to={`/user/${user.username}`} className="flex items-center">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={`${user.username}'s avatar`}
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 md:border-4 border-gray-800 shadow-md shrink-0 bg-gray-900"
                                    />
                                ) : (
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-md shrink-0">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-xs md:text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg transition cursor-pointer"
                            >
                                <span className="hidden sm:inline">Logout</span>
                                <span className="sm:hidden">Log out</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 md:gap-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white font-semibold text-sm md:text-base py-1.5 px-3 md:py-2 md:px-4 transition-colors rounded-lg hover:bg-gray-800 md:hover:bg-transparent"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-orange-500 text-white font-semibold text-sm md:text-base py-1.5 px-4 md:py-2 md:px-6 rounded-full hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {bottomContent}
        </header>
    );
};

export default Header;