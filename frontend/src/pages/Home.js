import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            PictoFold
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Your secure image management platform. Organize, share, and protect your memories with enterprise-grade security.
                    </p>

                    {!isAuthenticated() ? (
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/signup"
                                className="px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 text-lg font-medium text-blue-600 bg-white hover:bg-gray-50 rounded-xl transition-all transform hover:scale-105 shadow-lg border-2 border-blue-600"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to="/profile"
                            className="inline-block px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                        >
                            Go to Profile
                        </Link>
                    )}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Storage</h3>
                        <p className="text-gray-600">
                            Enterprise-grade encryption with JWT authentication and OTP verification.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Organization</h3>
                        <p className="text-gray-600">
                            Organize your images into folders and collections with ease.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                        <p className="text-gray-600">
                            Optimized performance with modern React and Spring Boot architecture.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
