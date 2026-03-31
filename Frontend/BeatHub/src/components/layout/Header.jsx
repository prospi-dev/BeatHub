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
    console.log(user);
    return (
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 flex flex-col">
            <div className="relative flex items-center p-4 min-h-[84px]">
                <div className="flex items-center gap-4 shrink-0">
                    {showBackButton && (
                        <button
                            onClick={onBackClick}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                        >
                            <FaArrowLeft />
                        </button>
                    )}
                    <BeatHubLogo />
                </div>

                {centerContent && (
                    <div className="absolute left-1/2 -translate-x-1/2 max-w-3xs md:w-full lg:max-w-lg px-4">
                        {centerContent}
                    </div>
                )}

                {/* Header Actions (Auth) */}
                <div className="flex items-center gap-3 ml-auto">
                    {user ? (
                        <Link to={`/user/${user.username}`} className="flex items-center gap-4">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={`${user.username}'s avatar`}
                                    className="w-10 h-10 rounded-full object-cover border-4 border-gray-800 shadow-md shrink-0 z-10 bg-gray-900"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shrink-0  z-10">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white font-semibold py-2 px-4 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="hidden bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-500/20 md:block"
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