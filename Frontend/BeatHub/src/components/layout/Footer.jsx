import React from 'react'
import SpotifyFullLogo from '../../assets/logos/Full_Logo_White_CMYK.svg'
import { useNavigate } from 'react-router-dom';

const footer = () => {
    return (
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
    )
}

export default footer;