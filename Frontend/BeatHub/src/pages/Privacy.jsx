import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-300">
            <Header showBackButton={true} onBackClick={() => window.history.back()} />
            
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="space-y-8 text-lg leading-relaxed">
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p>
                            When you register for BeatHub, we collect basic information such as your email address, username, and encrypted password. We also store the content you generate on our platform, including reviews, ratings, favorites, and your social interactions (following other users).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Integration with Third-Party Services (Spotify)</h2>
                        <p>
                            BeatHub utilizes the <strong>Spotify Web API</strong> to search and retrieve music metadata (artists, albums, and tracks). 
                            We do not connect directly to your personal Spotify account, nor do we access your private Spotify listening history or credentials. The music data displayed is publicly available catalog information provided by Spotify.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p>
                            We use your data to provide a personalized experience, maintain your profile, display your activity feed to your followers, and ensure the security of our platform. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage and Security</h2>
                        <p>
                            Your account information is stored securely on our servers. Passwords are cryptographically hashed. While we cache some music metadata locally for performance, the source of truth for music catalog data remains Spotify.
                        </p>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;