import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { protectedAPI } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
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
            setMessage('Welcome to your dashboard!');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">PictoFold</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>

                    {loading ? (
                        <div className="text-gray-600">Loading...</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <p className="text-green-800 text-lg font-medium">
                                    🎉 {message}
                                </p>
                                <p className="text-green-600 text-sm mt-2">
                                    You are successfully authenticated with JWT!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure</h3>
                                    <p className="text-blue-700 text-sm">Your session is protected with JWT tokens</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Verified</h3>
                                    <p className="text-purple-700 text-sm">Email verified via OTP</p>
                                </div>
                                <div className="bg-pink-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-pink-900 mb-2">Ready</h3>
                                    <p className="text-pink-700 text-sm">Start building your features!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
