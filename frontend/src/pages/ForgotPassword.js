import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authAPI.forgotPassword(email);
            if (response.data.success) {
                setMessage('OTP sent to your email!');
                setStep(2);
            } else {
                setError(response.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.validateOTP({ email, otp });
            if (response.data.success) {
                setMessage('OTP Verified!');
                setStep(3);
            } else {
                setError(response.data.message || 'Verification failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.resetPassword({ email, otp, newPassword });
            if (response.data.success) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-craft-pattern px-4 py-12 font-sans">
            <div className="relative max-w-md w-full">
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-xl"></div>

                <div className="relative bg-white p-10 origami-fold paper-shadow border-2 border-gray-100">
                    {/* Folded corner visual */}
                    <div className="absolute bottom-0 left-0 w-5 h-5 bg-gray-200" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}></div>
                    <div className="absolute bottom-[20px] left-0 w-5 h-5 bg-gray-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>

                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-orange-50 rounded-full mb-4 border-2 border-orange-100 border-dashed">
                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            {step === 1 ? 'Enter your email to receive a code' : step === 2 ? 'Enter the code sent to your email' : 'Create a new password'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 relative paper-shadow">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 relative paper-shadow">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
                            <div className="relative group">
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors duration-200"
                                    placeholder="you@example.com"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border-2 border-orange-500 text-sm font-bold text-orange-600 bg-transparent hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider paper-shadow transform active:translate-y-1 active:shadow-none"
                            >
                                {loading ? 'Sending Code...' : 'Send Reset Code'}
                            </button>

                            <div className="text-center mt-4">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-orange-600">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleVerifyOTP}>
                            <div className="relative group">
                                <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                    Enter 6-Digit Code
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors duration-200 text-center text-2xl tracking-[0.5em] font-mono"
                                    placeholder="000000"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border-2 border-orange-500 text-sm font-bold text-orange-600 bg-transparent hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider paper-shadow transform active:translate-y-1 active:shadow-none"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <div className="text-center mt-4">
                                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-600 hover:text-orange-600">
                                    Change Email
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div className="relative group">
                                <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors duration-200 pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                            </div>

                            <div className="relative group">
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors duration-200"
                                    placeholder="••••••••"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border-2 border-orange-500 text-sm font-bold text-orange-600 bg-transparent hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider paper-shadow transform active:translate-y-1 active:shadow-none"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
