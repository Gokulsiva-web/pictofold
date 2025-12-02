import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { protectedAPI, imageAPI } from '../services/api';

function Profile() {
    // const { user } = useAuth(); // Reserved for future use
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    // New states for preview workflow
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('none'); // 'none', 'preview', 'uploading', 'uploaded'
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchProtectedData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup preview URL when it changes or on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const fetchProtectedData = async () => {
        try {
            await protectedAPI.getProfile();
            // Profile data loaded successfully
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setErrorMessage('Only JPEG and PNG images are allowed');
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrorMessage('File size must be less than 10MB');
            return;
        }

        // Clear previous preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        // Set new file and preview
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setUploadStatus('preview');
        setErrorMessage('');
    };

    const handleStartUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        setUploading(true);
        setUploadStatus('uploading');
        setErrorMessage('');

        try {
            const response = await imageAPI.upload(formData);
            setUploadedImage(response.data);
            setUploadStatus('uploaded');

            // Clear preview URL after successful upload
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            const errorMsg = error.response?.data?.error || 'Upload failed. Please try again.';
            setErrorMessage(errorMsg);
            setUploadStatus('preview'); // Return to preview state
        } finally {
            setUploading(false);
        }
    };

    const handleChangeImage = () => {
        // Reset states
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setUploadedImage(null);
        setUploadStatus('none');
        setErrorMessage('');

        // Trigger file input
        document.getElementById('fileInput').click();
    };

    return (
        <div className="min-h-screen bg-craft-pattern py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden paper-shadow mb-6 sm:mb-8">
                    <div className="bg-gradient-to-r from-orange-500 to-purple-600 px-6 sm:px-8 py-8 sm:py-12">
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center paper-shadow">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">My Papercraft Workshop</h1>
                                <p className="text-orange-100 mt-1 text-sm sm:text-base">Create amazing 3D papercraft figures from your photos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-600 py-12">Loading your workshop...</div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Create New Section */}
                        <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl p-6 sm:p-8 paper-shadow border-2 border-orange-200">
                            <div className="text-center">
                                <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-lg">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Create New Papercraft</h2>
                                <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Upload a photo to start creating your personalized 3D papercraft figure
                                </p>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                    accept="image/jpeg,image/png"
                                />

                                {/* Error Message */}
                                {errorMessage && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Upload Status: None or Preview */}
                                {uploadStatus === 'none' && (
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 rounded-xl transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide"
                                    >
                                        Choose Photo
                                    </button>
                                )}

                                {/* Preview State */}
                                {uploadStatus === 'preview' && previewUrl && (
                                    <div className="mt-4 animate-fade-in">
                                        <p className="text-gray-700 font-semibold mb-3">Preview:</p>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-xs max-h-64 rounded-lg shadow-lg mx-auto border-4 border-white object-contain"
                                        />
                                        <p className="text-sm text-gray-600 mt-2">{selectedFile?.name}</p>
                                        <p className="text-xs text-gray-500">Size: {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>

                                        <div className="flex gap-4 justify-center mt-4">
                                            <button
                                                onClick={handleStartUpload}
                                                className="px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide"
                                            >
                                                Start Upload
                                            </button>
                                            <button
                                                onClick={handleChangeImage}
                                                className="px-6 py-3 text-base font-bold text-gray-700 bg-white hover:bg-gray-100 rounded-xl transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide border-2 border-gray-300"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Uploading State */}
                                {uploadStatus === 'uploading' && (
                                    <div className="mt-4">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-3"></div>
                                        <p className="text-gray-700 font-semibold">Uploading your image...</p>
                                    </div>
                                )}

                                {/* Uploaded State */}
                                {uploadStatus === 'uploaded' && uploadedImage && (
                                    <div className="mt-6 animate-fade-in">
                                        <p className="text-green-600 font-bold mb-3 text-lg">✓ Upload Successful!</p>
                                        <img
                                            src={uploadedImage.cloudinaryUrl}
                                            alt="Uploaded"
                                            className="max-w-xs max-h-64 rounded-lg shadow-lg mx-auto border-4 border-green-400 object-contain"
                                        />
                                        <div className="mt-3 text-sm text-gray-600">
                                            <p className="font-semibold">{uploadedImage.originalFilename}</p>
                                            <p>Format: {uploadedImage.format?.toUpperCase()}</p>
                                            <p>Size: {(uploadedImage.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                            <p className="text-xs text-gray-500 mt-2">Status: {uploadedImage.processingStatus}</p>
                                        </div>

                                        <button
                                            onClick={handleChangeImage}
                                            className="mt-4 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 rounded-xl transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide"
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                )}

                                <p className="text-xs sm:text-sm text-gray-500 mt-6">
                                    Feature coming soon! We're working on the AI conversion engine.
                                </p>
                            </div>
                        </div>

                        {/* My Creations */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl paper-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">My Creations</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* Placeholder Cards */}
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center hover:border-orange-400 transition-all">
                                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📄</div>
                                        <p className="text-sm sm:text-base text-gray-500">No creations yet</p>
                                        <p className="text-xs text-gray-400 mt-2">Upload a photo to get started</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl paper-shadow">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">How It Works</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Upload Your Photo</h4>
                                        <p className="text-xs sm:text-sm text-gray-600">Choose a clear photo of a person's face</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">AI Processes</h4>
                                        <p className="text-xs sm:text-sm text-gray-600">Photo is converted to cartoon style and mapped to 3D model</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Download & Build</h4>
                                        <p className="text-xs sm:text-sm text-gray-600">Get printable templates with cut and fold marks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg paper-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-600 text-xs sm:text-sm font-medium">Creations</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">0</p>
                                    </div>
                                    <div className="text-3xl sm:text-4xl">🎨</div>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Total papercraft models</p>
                            </div>

                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg paper-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-xs sm:text-sm font-medium">Downloads</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">0</p>
                                    </div>
                                    <div className="text-3xl sm:text-4xl">📥</div>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Templates downloaded</p>
                            </div>

                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg paper-shadow sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-xs sm:text-sm font-medium">Account</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">✓</p>
                                    </div>
                                    <div className="text-3xl sm:text-4xl">🔒</div>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Verified & Secure</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Profile;
