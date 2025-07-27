// ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProductPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);

    // Function to fetch cart items and check if current product is already added
    const checkCartStatus = async () => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) {
            // If no token, try to get from localStorage backup
            const localAddedItems = JSON.parse(localStorage.getItem('addedToCart') || '[]');
            const currentProductId = product?.id || product?._id || product?.productId || product?.product_id || id;
            setIsAlreadyAdded(localAddedItems.includes(currentProductId));
            return;
        }

        try {
            // Try multiple possible cart endpoints
            let response;
            try {
                response = await api.get('/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                // Try alternative endpoint
                response = await api.get('/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            console.log('Cart response:', response.data);
            
            // Handle different possible response structures
            let cartItems = [];
            if (response.data.items) {
                cartItems = response.data.items;
            } else if (response.data.cart?.items) {
                cartItems = response.data.cart.items;
            } else if (Array.isArray(response.data)) {
                cartItems = response.data;
            } else if (response.data.data) {
                cartItems = response.data.data;
            }
            
            // Extract product IDs from cart items
            const cartProductIds = cartItems.map(item => {
                return item.productId || 
                       item.product_id || 
                       item.id || 
                       item._id ||
                       item.product?.id ||
                       item.product?._id ||
                       item.product?.productId ||
                       (typeof item === 'string' ? item : null);
            }).filter(Boolean);
            
            console.log('Extracted cart product IDs:', cartProductIds);
            
            // Check if current product is in cart
            const currentProductId = product?.id || product?._id || product?.productId || product?.product_id || id;
            setIsAlreadyAdded(cartProductIds.includes(currentProductId));
            
            // Update localStorage backup
            localStorage.setItem('addedToCart', JSON.stringify(cartProductIds));
        } catch (err) {
            console.error('Failed to fetch cart items:', err);
            
            // Fallback to localStorage backup
            const localAddedItems = JSON.parse(localStorage.getItem('addedToCart') || '[]');
            const currentProductId = product?.id || product?._id || product?.productId || product?.product_id || id;
            setIsAlreadyAdded(localAddedItems.includes(currentProductId));
        }
    };

    useEffect(() => {
        // If product data is passed via state, use it
        if (location.state?.product) {
            setProduct(location.state.product);
            setLoading(false);
            return;
        }
 
        // Otherwise, fetch product by ID
        if (!id) {
            setError('No product ID specified');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        api.get(`/products/getId/${id}`)
            .then(res => {
                console.log("Product API Response:", res.data);
                setProduct(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch product:', err);
                setError('Failed to load product details. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, [id, location.state]);

    // Check cart status when product is loaded
    useEffect(() => {
        if (product) {
            checkCartStatus();
        }
    }, [product]);

    // Also check cart status on component mount (for logged in users)
    useEffect(() => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (token && product) {
            checkCartStatus();
        }
    }, []);

    // Updated handleAddToCart function for ProductPage.jsx
    const handleAddToCart = async (product) => {
        const productId = product?.id || product?._id || product?.productId || product?.product_id;

        if (!productId) {
            alert('Product ID is missing! Cannot add to cart.');
            return;
        }

        // Check if already added
        if (isAlreadyAdded) {
            alert('Product is already in your cart!');
            return;
        }

        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) {
            return navigate('/login', {
                state: { from: location.pathname, action: 'addToCart', product }
            });
        }

        try {
            setAddingToCart(true);
            console.log("Adding to cart:", productId);

            // Send only quantity (NOT the full product object)
            await api.post(`/cart/add/${productId}`, {
                quantity: 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the already added state immediately
            setIsAlreadyAdded(true);
            
            // Also store in localStorage as backup
            const currentAddedItems = JSON.parse(localStorage.getItem('addedToCart') || '[]');
            currentAddedItems.push(productId);
            localStorage.setItem('addedToCart', JSON.stringify(currentAddedItems));

            alert('Added to cart successfully!');
        } catch (err) {
            console.error('Add to cart error:', err);
            const status = err.response?.status;
            const errorMessage = err.response?.data?.message || err.message;

            if (status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                return navigate('/login', {
                    state: {
                        from: location.pathname,
                        message: 'Session expired. Please login again.',
                        action: 'addToCart',
                        product
                    }
                });
            }

            if (status === 404) {
                alert('Product not found. Please refresh the page.');
                return;
            }

            if (status === 400) {
                alert(errorMessage || 'Invalid request.');
                return;
            }

            alert(errorMessage || 'Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login', {
                state: {
                    from: location.pathname,
                    action: 'buyNow',
                    product
                }
            });
            return;
        }

        // Redirect to the external product URL
        if (product?.url) {
            window.location.href = product.url;  // full redirect to external payment/product page
        } else {
            alert("Buy URL not available for this product.");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-20">
                    <p className="text-lg sm:text-xl">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto p-4 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-20">
                    <p className="text-red-500 text-lg sm:text-xl">{error || 'Product not found'}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Breadcrumb */}
            <nav className="mb-4 sm:mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-sm sm:text-base transition-colors"
                >
                    ← Back
                </button>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Product Image - Top on mobile, Left on desktop */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Additional product images if available */}
                    {product.additionalImages && product.additionalImages.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {product.additionalImages.map((img, index) => (
                                <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details - Bottom on mobile, Right on desktop */}
                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.title}</h1>
                        {product.brand && (
                            <p className="text-gray-600 text-base sm:text-lg">by {product.brand}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className="text-2xl sm:text-3xl font-bold text-black">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <>
                                    <span className="text-lg sm:text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">Inclusive of all taxes</p>
                    </div>

                    {/* Product Description */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Description</h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {product.description || 'No description available for this product.'}
                        </p>
                    </div>

                    {/* Product Details */}
                    {(product.category || product.material || product.size) && (
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-2">Product Details</h3>
                            <ul className="space-y-1 text-sm sm:text-base text-gray-700">
                                {product.category && <li><strong>Category:</strong> {product.category}</li>}
                                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                                {product.size && <li><strong>Size:</strong> {product.size}</li>}
                                {product.color && <li><strong>Color:</strong> {product.color}</li>}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 sm:space-y-4">
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart || isAlreadyAdded}
                            className={`w-full px-4 py-3 sm:py-4 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base ${
                                isAlreadyAdded
                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                    : addingToCart 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : 'bg-red-600 text-white hover:bg-gray-800'
                            }`}
                        >
                            {isAlreadyAdded ? (
                                <div className="flex items-center justify-center">
                                    <span className="mr-2">✓</span>
                                    Already Added to Cart
                                </div>
                            ) : addingToCart ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                </div>
                            ) : (
                                'Add to Cart'
                            )}
                        </button>
                        
                        <button
                            onClick={handleBuyNow}
                            className="w-full bg-black text-white py-3 sm:py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base"
                        >
                            Buy Now - ₹{product.price}
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Delivery & Returns</h3>
                        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <li>• Free delivery on orders above ₹500</li>
                            <li>• Easy 30-day returns</li>
                            <li>• Cash on delivery available</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar for Actions (visible only on mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <div className="flex space-x-3">
                    <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart || isAlreadyAdded}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm ${
                            isAlreadyAdded
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : addingToCart
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-yellow-500 text-black hover:bg-yellow-600'
                        }`}
                    >
                        {isAlreadyAdded ? (
                            <div className="flex items-center justify-center">
                                <span className="mr-1">✓</span>
                                Added
                            </div>
                        ) : addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* Add bottom padding to prevent content from being hidden behind sticky bar on mobile */}
            <div className="lg:hidden h-20"></div>
        </div>
    );
};

export default ProductPage;