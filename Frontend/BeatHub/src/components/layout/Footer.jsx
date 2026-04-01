import React from 'react'
import { Link } from 'react-router-dom';
import SpotifyFullLogo from '../../assets/logos/Full_Logo_White_CMYK.svg'
import { useNavigate } from 'react-router-dom';

const footer = () => {
    return (
        <footer className='bg-gray-900 px-6 py-12'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between space-y-12 md:space-y-0'>
                {/* Footer Links */}
                <div className='flex space-x-20'>
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
                            <Link to="/privacy" className='block text-gray-400 hover:text-orange-500 transition-colors'>Privacy Policy</Link>
                            <Link to="/terms" className='block text-gray-400 hover:text-orange-500 transition-colors'>Terms of Service</Link>
                            <Link to="/about" className='block text-gray-400 hover:text-orange-500 transition-colors'>About</Link>
                        </div>
                    </div>
                </div>

                {/* Spotify Attribution */}
                <div>
                    <div className='flex flex-col md:flex-row md:items-center gap-6'>
                        <div className='mb-6 md:mb-0'>
                            <img src={SpotifyFullLogo} alt="Spotify Logo" className='w-32 mb-4' />
                            <p className='text-gray-400 text-sm max-w-md'>
                                This product uses the Spotify Web API but is not endorsed, certified or otherwise approved by Spotify.
                                Spotify is a trademark of Spotify AB.
                            </p>
                        </div>
                        <div className='text-center md:text-right mt-6 md:mt-0'>
                            <p className='text-gray-500 text-sm'>© 2025 BeatHub.</p>
                            <p className='text-gray-600 text-xs mt-1'>Made with ♥ by prospi-dev</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default footer;