import React from 'react'
import BeatHubLogo from '../components/beatHubLogo'
import { IoIosMenu, IoIosSearch, IoIosStar } from "react-icons/io";
import { FaHeadphones, FaUsers, FaPen, FaHeart, FaChartLine } from "react-icons/fa";
import { IoMusicalNote } from "react-icons/io5";
import { HiMusicNote } from "react-icons/hi";
import SpotifyFullLogo from '../assets/logos/Full_Logo_White_CMYK.svg'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-1000 via-gray-900 to-gray-1000 text-white">
            {/* Header */}
            <header className='flex flex-row justify-between items-center p-6'>
                <BeatHubLogo />
            </header>

            {/* Main Hero Section */}
            <main className='flex flex-col items-center justify-center px-6 py-20 text-center'>
                <div className='mb-8'>
                    <HiMusicNote className='text-6xl text-orange-500 mx-auto mb-4 animate-pulse' />
                </div>
                <h1 className='text-5xl md:text-7xl font-bold mb-6 max-w-5xl leading-tight bg-gradient-to-r from-white via-orange-200 to-orange-500 bg-clip-text text-transparent'>
                    Discover. Review. Share.
                </h1>
                <p className='text-xl text-gray-300 mb-4 max-w-2xl'>
                    Your ultimate platform for musical discovery
                </p>
                <p className='text-lg text-gray-400 mb-12 max-w-2xl'>
                    Explore millions of tracks, write reviews, and connect with music lovers worldwide through Spotify's vast catalog
                </p>

                <div className='flex flex-col sm:flex-row gap-4 mb-12'>
                    <button className='bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl flex items-center gap-2'
                        onClick={() => navigate('/catalog')}
                    >
                        <IoIosSearch className='text-xl' />
                        Start Exploring
                    </button>
                    <button className='bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 flex items-center gap-2'>
                        <FaPen className='text-lg' />
                        Write a Review
                    </button>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
                    <div className='text-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                        <IoMusicalNote className='text-3xl text-green-500 mx-auto mb-3' />
                        <h3 className='text-2xl font-bold text-white mb-1'>50M+</h3>
                        <p className='text-gray-400'>Songs Available</p>
                    </div>
                    <div className='text-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                        <FaPen className='text-3xl text-orange-500 mx-auto mb-3' />
                        <h3 className='text-2xl font-bold text-white mb-1'>10K+</h3>
                        <p className='text-gray-400'>Reviews Written</p>
                    </div>
                    <div className='text-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm'>
                        <FaUsers className='text-3xl text-blue-500 mx-auto mb-3' />
                        <h3 className='text-2xl font-bold text-white mb-1'>5K+</h3>
                        <p className='text-gray-400'>Active Users</p>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className='bg-gradient-to-b from-gray-00 to-gray-900 py-20 px-6'>
                <div className='max-w-6xl mx-auto'>
                    <h2 className='text-4xl font-bold text-center mb-16 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'>
                        Why Choose BeatHub?
                    </h2>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {/* Discover Music */}
                        <div className='bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300'>
                            <div className='bg-gradient-to-br from-green-500 to-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6'>
                                <FaHeadphones className='text-2xl text-white' />
                            </div>
                            <h3 className='text-2xl font-semibold mb-4 text-white'>Discover New Music</h3>
                            <p className='text-gray-300 leading-relaxed'>Explore millions of tracks from Spotify's catalog. Find new artists, albums, and songs tailored to your taste.</p>
                        </div>

                        {/* Write Reviews */}
                        <div className='bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300'>
                            <div className='bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6'>
                                <FaPen className='text-2xl text-white' />
                            </div>
                            <h3 className='text-2xl font-semibold mb-4 text-white'>Write Reviews</h3>
                            <p className='text-gray-300 leading-relaxed'>Share your thoughts on songs, albums, and artists. Help others discover great music through your insights.</p>
                        </div>

                        {/* Connect with Community */}
                        <div className='bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300'>
                            <div className='bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6'>
                                <FaUsers className='text-2xl text-white' />
                            </div>
                            <h3 className='text-2xl font-semibold mb-4 text-white'>Connect & Share</h3>
                            <p className='text-gray-300 leading-relaxed'>Join a community of music lovers. Share your favorites and discover what others are listening to.</p>
                        </div>

                        {/* Rate & Recommend */}
                        <div className='bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300'>
                            <div className='bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6'>
                                <IoIosStar className='text-2xl text-white' />
                            </div>
                            <h3 className='text-2xl font-semibold mb-4 text-white'>Rate & Recommend</h3>
                            <p className='text-gray-300 leading-relaxed'>Rate tracks and get personalized recommendations based on your music taste and preferences.</p>
                        </div>

                        {/* Track Analytics */}
                        <div className='bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300'>
                            <div className='bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6'>
                                <FaChartLine className='text-2xl text-white' />
                            </div>
                            <h3 className='text-2xl font-semibold mb-4 text-white'>Music Analytics</h3>
                            <p className='text-gray-300 leading-relaxed'>Get insights into your listening habits and discover trends in your musical journey.</p>
                        </div>

                        {/* Save Favorites */}
                        <div className='bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300'>
                            <div className='bg-gradient-to-br from-red-500 to-pink-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6'>
                                <FaHeart className='text-2xl text-white' />
                            </div>
                            <h3 className='text-2xl font-semibold mb-4 text-white'>Save Your Favorites</h3>
                            <p className='text-gray-300 leading-relaxed'>Create personalized collections of your favorite tracks, albums, and artists for easy access.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className='bg-gradient-to-r from-orange-500 to-red-500 py-16 px-6'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h2 className='text-4xl font-bold mb-6 text-white'>Ready to Start Your Musical Journey?</h2>
                    <p className='text-xl text-orange-100 mb-8 max-w-2xl mx-auto'>
                        Join thousands of music enthusiasts discovering, reviewing, and sharing their favorite tracks on BeatHub.
                    </p>
                    <button className='bg-white text-orange-500 hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-xl'>
                        Join BeatHub Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-gray-900 px-6 py-12'>
                <div className='max-w-6xl mx-auto'>
                    {/* Footer Links */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-12'>
                        <div>
                            <h4 className='text-lg font-semibold text-white mb-4'>Platform</h4>
                            <div className='space-y-2'>
                                <a href="/catalog" className='block text-gray-400 hover:text-orange-500 transition-colors'>Browse Music</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Write Reviews</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Discover Artists</a>
                            </div>
                        </div>
                        <div>
                            <h4 className='text-lg font-semibold text-white mb-4'>Community</h4>
                            <div className='space-y-2'>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>User Profiles</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Top Reviews</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Music Forums</a>
                            </div>
                        </div>
                        <div>
                            <h4 className='text-lg font-semibold text-white mb-4'>Support</h4>
                            <div className='space-y-2'>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Help Center</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Contact Us</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Report Issue</a>
                            </div>
                        </div>
                        <div>
                            <h4 className='text-lg font-semibold text-white mb-4'>Legal</h4>
                            <div className='space-y-2'>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Privacy Policy</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>Terms of Service</a>
                                <a href="#" className='block text-gray-400 hover:text-orange-500 transition-colors'>About</a>
                            </div>
                        </div>
                    </div>

                    {/* Spotify Attribution */}
                    <div className='border-t border-gray-700 pt-8'>
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                            <div className='mb-6 md:mb-0'>
                                <img src={SpotifyFullLogo} alt="Spotify Logo" className='w-32 mb-4' />
                                <p className='text-gray-400 text-sm max-w-md'>
                                    This product uses the Spotify Web API but is not endorsed, certified or otherwise approved by Spotify.
                                    Spotify is a trademark of Spotify AB.
                                </p>
                            </div>
                            <div className='text-center md:text-right'>
                                <p className='text-gray-500 text-sm'>© 2025 BeatHub. All rights reserved.</p>
                                <p className='text-gray-600 text-xs mt-1'>Made with ♥ for music lovers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home