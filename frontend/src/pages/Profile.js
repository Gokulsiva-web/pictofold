import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { protectedAPI } from '../services/api';

function Profile() {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProtectedData();
    }, []);

    const fetchProtectedData = async () => {
        try {
            const response = await protectedAPI.getProfile();
            setMessage(response.data);
        } catch (error) {
            console.error('Error fetching protected data:', error);
            setMessage('Welcome to your profile!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                                <p className="text-blue-100 mt-1">Manage your account settings</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-8 py-8">
                        {loading ? (
                            <div className="text-center text-gray-600">Loading...</div>
                        ) : (
                            <div className="space-y-6">
                                {/* Success Message */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-green-800 text-lg font-medium">
                                                🎉 {message}
                                            </p>
                                            <p className="text-green-600 text-sm mt-1">
                                                You are successfully authenticated with JWT!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-blue-600 text-sm font-medium">Security</p>
                                                <p className="text-2xl font-bold text-blue-900 mt-1">100%</p>
                                            </div>
                                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <p className="text-blue-700 text-xs mt-2">JWT Protected</p>
                                    </div>

                                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-purple-600 text-sm font-medium">Verified</p>
                                                <p className="text-2xl font-bold text-purple-900 mt-1">✓</p>
                                            </div>
                                            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-purple-700 text-xs mt-2">Email Verified</p>
                                    </div>

                                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-pink-600 text-sm font-medium">Status</p>
                                                <p className="text-2xl font-bold text-pink-900 mt-1">Active</p>
                                            </div>
                                            <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-pink-700 text-xs mt-2">Account Active</p>
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div className="mt-8 border-t pt-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-gray-600">Account Type</span>
                                            <span className="font-medium text-gray-900">Premium</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-gray-600">Authentication</span>
                                            <span className="font-medium text-gray-900">JWT + OTP</span>
                                        </div>
                                        <div className="flex justify-between py-3">
                                            <span className="text-gray-600">Security Level</span>
                                            <span className="font-medium text-green-600">High</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
