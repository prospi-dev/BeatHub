import React from 'react'
import SpotifyFullLogo from '../../assets/logos/Full_Logo_White_CMYK.svg'
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='bg-gray-900 px-6 py-12 mt-auto border-t border-gray-800'>
            <div className='max-w-6xl mx-auto'>
                {/* Footer Links */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center md:text-left'>
                    
                    {/* Column 1: Platform (Actual functionality) */}
                    <div>
                        <h4 className='text-lg font-semibold text-white mb-4'>Platform</h4>
                        <div className='space-y-2'>
                            <Link to="/catalog" className='block text-gray-400 hover:text-orange-500 transition-colors'>Browse Catalog</Link>
                            <Link to="/catalog?type=feed" className='block text-gray-400 hover:text-orange-500 transition-colors'>Community Feed</Link>
                            <Link to="/login" className='block text-gray-400 hover:text-orange-500 transition-colors'>Login / Register</Link>
                        </div>
                    </div>

                    {/* Column 2: About the Project */}
                    <div>
                        <h4 className='text-lg font-semibold text-white mb-4'>Project Info</h4>
                        <div className='space-y-2'>
                            <Link to="/about" className='block text-gray-400 hover:text-orange-500 transition-colors'>About BeatHub</Link>
                            {/* Replace this with your actual GitHub link */}
                            <a href="https://github.com/prospi-dev/BeatHub" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-white transition-colors'>
                                <FaGithub /> Source Code
                            </a>
                        </div>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className='text-lg font-semibold text-white mb-4'>Legal</h4>
                        <div className='space-y-2'>
                            <Link to="/privacy" className='block text-gray-400 hover:text-orange-500 transition-colors'>Privacy Policy</Link>
                            <Link to="/terms" className='block text-gray-400 hover:text-orange-500 transition-colors'>Terms of Service</Link>
                        </div>
                    </div>

                </div>

                {/* Spotify Attribution & Copyright */}
                <div className='border-t border-gray-800 pt-8'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                        <div className='mb-6 md:mb-0 flex flex-col items-center md:items-start'>
                            <img src={SpotifyFullLogo} alt="Spotify Logo" className='w-32 mb-4 opacity-80 hover:opacity-100 transition-opacity' />
                            <p className='text-gray-500 text-xs md:text-sm max-w-md text-center md:text-left'>
                                This product uses the Spotify Web API but is not endorsed, certified or otherwise approved by Spotify.
                                Spotify is a trademark of Spotify AB.
                            </p>
                        </div>
                        <div className='text-center md:text-right'>
                            <p className='text-orange-500 font-medium text-sm mb-1'>🚀 Educational Portfolio Project</p>
                            <p className='text-gray-500 text-sm'>© 2025 BeatHub.</p>
                            <p className='text-gray-600 text-xs mt-1'>Made by prospi-dev</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;