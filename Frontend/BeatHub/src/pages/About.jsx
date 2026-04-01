import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaServer, FaDatabase } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
            <Header showBackButton={true} onBackClick={() => window.history.back()} />
            
            <main className="flex-grow max-w-4xl mx-auto px-6 py-16">
                
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-500 rounded-full text-sm font-semibold mb-6 border border-orange-500/30">
                        Portfolio Project
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About BeatHub</h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        BeatHub is a full-stack web application built as a personal portfolio project. It demonstrates the integration of modern frontend technologies with a robust backend architecture, utilizing the Spotify Web API.
                    </p>
                </div>

                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">Tech Stack</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                            <FaCode className="text-3xl text-blue-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Frontend</h3>
                            <ul className="text-gray-400 space-y-2 text-sm">
                                <li>• React.js (Vite)</li>
                                <li>• Tailwind CSS</li>
                                <li>• React Router DOM</li>
                                <li>• Axios</li>
                            </ul>
                        </div>
                        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                            <FaServer className="text-3xl text-purple-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Backend</h3>
                            <ul className="text-gray-400 space-y-2 text-sm">
                                <li>• C# & .NET 8 API</li>
                                <li>• Entity Framework Core</li>
                                <li>• JWT Authentication</li>
                                <li>• Spotify API Integration</li>
                            </ul>
                        </div>
                        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-colors">
                            <FaDatabase className="text-3xl text-green-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Infrastructure</h3>
                            <ul className="text-gray-400 space-y-2 text-sm">
                                <li>• SQL Server (Database)</li>
                                <li>• Cloudinary (Image Hosting)</li>
                                <li>• RESTful Architecture</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6">About the Developer</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl">
                            Hi! I'm the developer behind BeatHub. I built this platform to showcase my skills in building scalable, full-stack applications from scratch. If you're a recruiter, a fellow developer, or just someone who liked the app, I'd love to connect!
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="https://github.com/prospi-dev" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-gray-950 hover:bg-black text-white rounded-full transition-colors border border-gray-700"
                            >
                                <FaGithub className="text-xl" /> GitHub
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/manuel-prosperi-664425274" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                            >
                                <FaLinkedin className="text-xl" /> LinkedIn
                            </a>
                            <a 
                                href="mailto:manuprosperi04@gmail.com" 
                                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors border border-gray-600"
                            >
                                <FaEnvelope className="text-xl" /> Contact
                            </a>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default About;