import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';
import Header from '../components/layout/Header';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <FaMusic className="text-6xl text-orange-500 mb-6 animate-bounce" />
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-6">Looks like this track is skipping...</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    The page you are looking for doesn't exist or has been moved. Let's get you back to the music.
                </p>
                <Link 
                    to="/catalog" 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105"
                >
                    Back to Catalog
                </Link>
            </main>
        </div>
    );
};

export default NotFound;