import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = (query) => {
        if (!query.trim()) return;
        
        const updated = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Text search function
    const handleTextSearch = async (query = searchQuery) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        saveRecentSearch(query);

        try {
            const response = await api.post('https://api.fyndd.in/api/products/hybrid-search', {
                query: query.trim(),
                searchType: 'text'
            });

            console.log('Search results:', response.data);
            setSearchResults(response.data.products || response.data || []);
        } catch (err) {
            console.error('Search failed:', err);
            setError(err.response?.data?.message || 'Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Image search function
    const handleImageSearch = async (imageData) => {
        if (!imageData) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', imageData);
            formData.append('searchType', 'image');

            const response = await api.post('https://api.fyndd.in/api/products/hybrid-search', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Image search results:', response.data);
            setSearchResults(response.data.products || response.data || []);
        } catch (err) {
            console.error('Image search failed:', err);
            setError(err.response?.data?.message || 'Image search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Start camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } // Use back camera on mobile
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setShowCamera(true);
        } catch (err) {
            console.error('Camera access failed:', err);
            alert('Camera access denied or not available');
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    // Capture photo from camera
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Convert to blob
            canvas.toBlob((blob) => {
                setSelectedImage(blob);
                setImagePreview(canvas.toDataURL());
                stopCamera();
                handleImageSearch(blob);
            }, 'image/jpeg', 0.8);
        }
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            handleImageSearch(file);
        }
    };

    // Navigate to product page
    const handleProductClick = (product) => {
        navigate('/products', { 
            state: { 
                product: {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    brand: product.brand,
                    category: product.category,
                    rating: product.rating,
                    originalPrice: product.originalPrice,
                    ...product
                }
            } 
        });
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedImage(null);
        setImagePreview(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        {/* Back Button */}
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                                
                                {/* Search Icon */}
                                <svg 
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                                {/* Clear Button */}
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Camera Button */}
                        <button
                            onClick={startCamera}
                            className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
                            title="Search with camera"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {/* Upload Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                            title="Upload image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Take a Photo</h3>
                            <button onClick={stopCamera} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg mb-4"
                        />
                        
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={capturePhoto}
                                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                                Capture
                            </button>
                            <button
                                onClick={stopCamera}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Recent Searches */}
                {!loading && searchResults.length === 0 && recentSearches.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchQuery(search);
                                        handleTextSearch(search);
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Searching for similar items:</h3>
                        <div className="flex items-center space-x-4">
                            <img src={imagePreview} alt="Search" className="w-24 h-24 object-cover rounded-lg" />
                            <button
                                onClick={() => {
                                    setImagePreview(null);
                                    setSelectedImage(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                            <p className="text-gray-600">Searching...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Search Results */}
                {!loading && searchResults.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Search Results ({searchResults.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults.map((product, index) => (
                                <div
                                    key={product.id || index}
                                    className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    
                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold mb-1 line-clamp-2 text-gray-800">
                                            {product.title}
                                        </h3>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-lg font-bold text-black">₹{product.price}</p>
                                            {product.rating && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && searchResults.length === 0 && (searchQuery || selectedImage) && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-xl text-gray-600 mb-2">No products found</p>
                        <p className="text-gray-500">Try different keywords or upload a different image</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;