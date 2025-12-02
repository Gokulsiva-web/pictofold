import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Signup, 2: OTP Verification
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.signup({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                setMessage('OTP sent to your email!');
                setStep(2);
            } else {
                setError(response.data.message || 'Signup failed');
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
            const response = await authAPI.verifyOTP({
                email: formData.email,
                otp: otp,
            });

            if (response.data.success) {
                setMessage('Email verified! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Verification failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authAPI.resendOTP(formData.email);
            if (response.data.success) {
                setMessage('New OTP sent to your email!');
            } else {
                setError(response.data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-craft-pattern px-4 py-12 font-sans">
            <div className="relative max-w-md w-full">
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-200 rounded-full opacity-50 blur-xl"></div>

                <div className="relative bg-white p-10 origami-fold paper-shadow border-2 border-gray-100">
                    {/* Folded corner visual */}
                    <div className="absolute top-0 left-0 w-5 h-5 bg-gray-200" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)', transform: 'rotate(180deg)' }}></div>
                    <div className="absolute top-[20px] left-0 w-5 h-5 bg-gray-300" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)', transform: 'rotate(180deg)' }}></div>

                    {step === 1 ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-block p-3 bg-purple-50 rounded-full mb-4 border-2 border-purple-100 border-dashed">
                                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Join the Fold</h2>
                                <p className="mt-2 text-sm text-gray-500 font-medium">Create your account to start crafting</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSignup}>
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 relative paper-shadow">
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

                                <div className="space-y-5">
                                    <div className="relative group">
                                        <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors duration-200"
                                            placeholder="Your name"
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-focus-within:w-full"></div>
                                    </div>

                                    <div className="relative group">
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors duration-200"
                                            placeholder="you@example.com"
                                        />
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-focus-within:w-full"></div>
                                    </div>

                                    <div className="relative group">
                                        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors duration-200 pr-10"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
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
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-focus-within:w-full"></div>
                                    </div>

                                    <div className="relative group">
                                        <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors duration-200 pr-10"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                            >
                                                {showConfirmPassword ? (
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
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-focus-within:w-full"></div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border-2 border-purple-600 text-sm font-bold text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider paper-shadow transform active:translate-y-1 active:shadow-none"
                                >
                                    {loading ? 'Creating account...' : 'Sign Up'}
                                </button>

                                <div className="text-center mt-6">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link to="/login" className="font-bold text-purple-600 hover:text-purple-500 underline decoration-2 decoration-purple-200 hover:decoration-purple-500 transition-all">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-block p-3 bg-green-50 rounded-full mb-4 border-2 border-green-100 border-dashed">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Verify Email</h2>
                                <p className="mt-2 text-sm text-gray-500 font-medium">
                                    We sent a code to <span className="font-bold text-gray-800">{formData.email}</span>
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleVerifyOTP}>
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 relative paper-shadow">
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
                                    <div className="bg-green-50 border-l-4 border-green-400 p-4 relative paper-shadow">
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

                                <div className="relative group">
                                    <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">
                                        Enter 6-Digit Code
                                    </label>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="block w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors duration-200 text-center text-2xl tracking-[0.5em] font-mono"
                                        placeholder="000000"
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-focus-within:w-full"></div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border-2 border-purple-600 text-sm font-bold text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider paper-shadow transform active:translate-y-1 active:shadow-none"
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-sm text-purple-600 hover:text-purple-500 font-bold underline decoration-2 decoration-purple-200 hover:decoration-purple-500 transition-all"
                                    >
                                        Didn't receive code? Resend
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Signup;
