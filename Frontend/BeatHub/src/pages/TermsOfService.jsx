import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-300">
            <Header showBackButton={true} onBackClick={() => window.history.back()} />
            
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                <div className="space-y-8 text-lg leading-relaxed">
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By creating an account and using BeatHub, you agree to abide by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. User-Generated Content</h2>
                        <p>
                            You are solely responsible for the reviews, comments, and profile information you post. BeatHub reserves the right to remove any content that is deemed offensive, abusive, spam, or violates the rights of others.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Intellectual Property and Spotify API</h2>
                        <p>
                            BeatHub is an independent platform and is <strong>not endorsed, certified, or otherwise approved by Spotify</strong>. 
                            All music metadata, including album artwork, track names, and artist information, are the intellectual property of Spotify AB and their respective rights holders. You may not scrape, redistribute, or use this data for commercial purposes outside of the BeatHub platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Account Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate these terms or engage in malicious activities affecting the platform's stability.
                        </p>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;