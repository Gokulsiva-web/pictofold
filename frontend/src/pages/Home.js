import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-craft-pattern">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Turn Your Photos Into{' '}
                        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                            Papercraft Magic
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
                        Upload a photo, watch it transform into a stylized cartoon, and get printable templates to create your own 3D papercraft figure. Cut, fold, and bring your creation to life!
                    </p>

                    {!isAuthenticated() ? (
                        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                            <Link
                                to="/signup"
                                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all transform hover:scale-105 shadow-lg paper-shadow"
                            >
                                Start Creating
                            </Link>
                            <Link
                                to="/login"
                                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-orange-600 bg-white hover:bg-gray-50 rounded-xl transition-all transform hover:scale-105 shadow-lg border-2 border-orange-500 paper-shadow"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to="/profile"
                            className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all transform hover:scale-105 shadow-lg paper-shadow"
                        >
                            Go to Workshop
                        </Link>
                    )}
                </div>

                {/* How It Works Section */}
                <div className="mt-16 sm:mt-24">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all paper-shadow origami-fold relative">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold -mt-3 -mr-3 border-2 border-white shadow-md">
                                1
                            </div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Upload Your Photo</h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                Choose a photo of yourself or anyone you'd like to turn into a papercraft figure. Our AI will handle the rest.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all paper-shadow origami-fold relative">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold -mt-3 -mr-3 border-2 border-white shadow-md">
                                2
                            </div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">AI Cartoonifies</h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                Watch as your photo transforms into a stylized cartoon texture, perfectly mapped to a low-poly 3D stick figure model.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all paper-shadow origami-fold relative">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold -mt-3 -mr-3 border-2 border-white shadow-md">
                                3
                            </div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Print & Build</h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                Download printable templates with cut and fold marks. Print, cut, fold, and assemble your unique papercraft creation!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-16 sm:mt-24">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
                        Why PictoFold?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all paper-shadow text-center">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">AI-Powered</h4>
                            <p className="text-sm text-gray-600">Advanced AI converts photos to cartoon style</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all paper-shadow text-center">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📐</div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Auto-Unfold</h4>
                            <p className="text-sm text-gray-600">3D models automatically unfolded for printing</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all paper-shadow text-center">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">✂️</div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Easy Assembly</h4>
                            <p className="text-sm text-gray-600">Clear cut and fold marks for simple building</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all paper-shadow text-center">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎁</div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Unique Gifts</h4>
                            <p className="text-sm text-gray-600">Create personalized papercraft gifts</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                {!isAuthenticated() && (
                    <div className="mt-16 sm:mt-24 text-center bg-gradient-to-r from-orange-50 to-purple-50 rounded-2xl p-8 sm:p-12 paper-shadow">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Ready to Create Your First Papercraft?
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Join PictoFold today and start turning your favorite photos into unique 3D papercraft figures!
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 rounded-xl transition-all transform hover:scale-105 shadow-xl uppercase tracking-wide"
                        >
                            Get Started Free
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
