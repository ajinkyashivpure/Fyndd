import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load recent searches from memory
    useEffect(() => {
        setRecentSearches([]);
    }, []);

    // Save recent searches to memory only
    const saveRecentSearch = (query) => {
        if (!query.trim()) return;
        
        try {
            const updated = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
            setRecentSearches(updated);
        } catch (error) {
            console.error('Error saving recent searches:', error);
        }
    };

    // Under maintenance alert function
    const showMaintenanceAlert = () => {
        alert('🔧 Under Maintenance\n\nImage search functionality is currently under maintenance. Please try again later or use text search instead.');
    };

    // Text search function
    const handleTextSearch = async (query = searchQuery) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        saveRecentSearch(query);

        try {
            const response = await api.get(`api/products/hybrid-search`, {
                params: {
                    query: query.trim(),
                    searchType: 'text'
                }
            });

            console.log('Search results:', response.data);
            
            let products = [];
            if (response.data.products) {
                products = response.data.products;
            } else if (Array.isArray(response.data)) {
                products = response.data;
            } else if (response.data.data) {
                products = response.data.data;
            }
            
            console.log('Products:', products);
            setSearchResults(products);
        } catch (err) {
            console.error('Search failed:', err);
            setError(err.response?.data?.message || 'Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle product click - same as ExplorePage
     const handleProductClick = (product) => {
        console.log("Product being clicked:", product);
        
        // Check for different possible ID field names
        const productId = product.id || product._id || product.productId || product.product_id;
        console.log("Product ID:", productId);
        
        if (!productId) {
            console.error("Product has no ID field:", product);
            alert("Product ID is missing!");
            return;
        }
        
        // Navigate to individual product page
        navigate(`/products/${productId}`, { state: { product } });
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

            const response = await api.post('api/products/hybrid-search', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Image search results:', response.data);
            
            let products = [];
            if (response.data.products) {
                products = response.data.products;
            } else if (Array.isArray(response.data)) {
                products = response.data;
            } else if (response.data.data) {
                products = response.data.data;
            }
            
            setSearchResults(products);
        } catch (err) {
            console.error('Image search failed:', err);
            setError(err.response?.data?.message || 'Image search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Start camera with maintenance alert
    const startCamera = async () => {
        showMaintenanceAlert();
        return;
        
        // Original camera code (commented out for maintenance)
        /*
        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', true);
                videoRef.current.setAttribute('webkit-playsinline', true);
            }
            setShowCamera(true);
        } catch (err) {
            console.error('Camera access failed:', err);
            setError('Camera access denied or not available on this device');
        }
        */
    };

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    // Capture photo from camera
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    setSelectedImage(blob);
                    setImagePreview(canvas.toDataURL());
                    stopCamera();
                    handleImageSearch(blob);
                }
            }, 'image/jpeg', 0.8);
        }
    };

    // Handle file upload with maintenance alert
    const handleFileUpload = (event) => {
        showMaintenanceAlert();
        event.target.value = ''; // Clear the file input
        return;
        
        // Original file upload code (commented out for maintenance)
        /*
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Image file too large. Please select an image under 10MB.');
                return;
            }
            
            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            handleImageSearch(file);
        } else {
            setError('Please select a valid image file.');
        }
        
        event.target.value = '';
        */
    };

    // Handle upload button click with maintenance alert
    const handleUploadClick = () => {
        showMaintenanceAlert();
        // Don't trigger file input during maintenance
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setError(null);
    };

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            stopCamera();
        };
    }, [imagePreview]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Mobile Optimized */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    {/* Mobile Layout */}
                    {isMobile ? (
                        <div className="space-y-3">
                            {/* Top Row - Back button and action buttons */}
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition touch-manipulation"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="flex items-center space-x-2">
                                    {/* Camera Button */}
                                    <button
                                        onClick={startCamera}
                                        className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition touch-manipulation active:scale-95"
                                        title="Search with camera"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>

                                    {/* Upload Button */}
                                    <button
                                        onClick={handleUploadClick}
                                        className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition touch-manipulation active:scale-95"
                                        title="Upload image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar Row */}
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                                        placeholder="Search for products..."
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                                    />
                                    
                                    {/* Search Icon */}
                                    <svg 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>

                                    {/* Clear Button */}
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full touch-manipulation"
                                        >
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Search Button */}
                                <button
                                    onClick={() => handleTextSearch()}
                                    disabled={!searchQuery.trim() || loading}
                                    className="px-4 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 text-sm font-medium"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Desktop Layout */
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
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                                
                                <svg 
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

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

                            <button
                                onClick={() => handleTextSearch()}
                                disabled={!searchQuery.trim() || loading}
                                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Search
                            </button>

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

                            <button
                                onClick={handleUploadClick}
                                className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                                title="Upload image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Camera Modal - Mobile Optimized */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Take a Photo</h3>
                            <button 
                                onClick={stopCamera} 
                                className="text-gray-500 hover:text-gray-700 p-1 touch-manipulation"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full rounded-lg mb-4 bg-black"
                            style={{ aspectRatio: '4/3' }}
                        />
                        
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={capturePhoto}
                                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition touch-manipulation active:scale-95 font-medium"
                            >
                                Capture
                            </button>
                            <button
                                onClick={stopCamera}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition touch-manipulation active:scale-95 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Recent Searches */}
                {!loading && searchResults.length === 0 && recentSearches.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-lg font-semibold mb-3 sm:mb-4 px-1">Recent Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchQuery(search);
                                        handleTextSearch(search);
                                    }}
                                    className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition touch-manipulation active:scale-95 text-sm"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-4 sm:mb-6 px-1">
                        <h3 className="text-lg font-semibold mb-2">Searching for similar items:</h3>
                        <div className="flex items-center space-x-4">
                            <img 
                                src={imagePreview} 
                                alt="Search" 
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-gray-200" 
                            />
                            <button
                                onClick={() => {
                                    if (imagePreview.startsWith('blob:')) {
                                        URL.revokeObjectURL(imagePreview);
                                    }
                                    setImagePreview(null);
                                    setSelectedImage(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition touch-manipulation"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-black mx-auto mb-4"></div>
                            <p className="text-gray-600 text-sm sm:text-base">Searching...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6 mx-1">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className="mt-2 text-red-600 underline hover:text-red-800 text-sm touch-manipulation"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results - Mobile Optimized Grid */}
                {!loading && searchResults.length > 0 && (
                    <div className="px-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">
                            Search Results ({searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found)
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                            {searchResults.map((product, index) => (
                                <div
                                    key={product.id || index}
                                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 touch-manipulation active:scale-95"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="relative overflow-hidden bg-gray-50">
                                        <img
                                            src={product.imageUrl || '/api/placeholder/300/300'}
                                            alt={product.title || 'Product'}
                                            className="w-full h-32 sm:h-40 lg:h-48 object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = '/api/placeholder/300/300';
                                            }}
                                            loading="lazy"
                                        />
                                        {product.discount && (
                                            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold">
                                                {product.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-2 sm:p-3 lg:p-4">
                                        <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 line-clamp-2 text-gray-800 min-h-[2rem] sm:min-h-[2.5rem] leading-tight">
                                            {product.title || product.name || 'Untitled Product'}
                                        </h3>
                                        
                                        {product.brand && (
                                            <p className="text-xs text-gray-500 mb-1 sm:mb-2 truncate">{product.brand}</p>
                                        )}
                                        
                                        <div className="flex items-center justify-between mt-2 sm:mt-3">
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <p className="text-sm sm:text-base lg:text-lg font-bold text-black truncate">
                                                    ₹{product.price || 'N/A'}
                                                </p>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <p className="text-xs sm:text-sm text-gray-500 line-through truncate">
                                                        ₹{product.originalPrice}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {product.rating && (
                                                <div className="flex items-center bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ml-2 flex-shrink-0">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-xs text-green-700 ml-0.5 sm:ml-1 font-medium">{product.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {product.category && (
                                            <p className="text-xs text-gray-400 mt-1 sm:mt-2 truncate">{product.category}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && searchResults.length === 0 && (searchQuery || selectedImage) && !error && (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">No products found</h3>
                        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">We couldn't find any products matching your search criteria.</p>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                            <p>• Try different keywords</p>
                            <p>• Check your spelling</p>
                            <p>• Use more general terms</p>
                            {selectedImage && <p>• Try uploading a different image</p>}
                        </div>
                    </div>
                )}

                {/* Default State - Show when no search has been performed */}
                {!loading && searchResults.length === 0 && !searchQuery && !selectedImage && !error && (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">Start your search</h3>
                        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Enter keywords or upload an image to find products</p>
                        
                        {/* Mobile-friendly quick actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-sm mx-auto">
                            <button
                                onClick={startCamera}
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition touch-manipulation active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium">Take Photo</span>
                            </button>
                            
                            <button
                                onClick={handleUploadClick}
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition touch-manipulation active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm font-medium">Upload Image</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;