// ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProductPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [currentPage] = useState('products');
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);

    // Bottom Navigation Component
    const BottomNavigation = ({ currentPage }) => {
      const navigate = useNavigate();
      
      const navItems = [
        {
          key: 'home',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          ),
          label: 'Home',
          path: '/'
        },
        {
          key: 'search',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          ),
          label: 'Search',
          path: '/search'
        },
        {
          key: 'cart',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          ),
          label: 'Cart',
          path: '/cart'
        },
        {
          key: 'profile',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          ),
          label: 'Profile',
          path: '/profile'
        }
      ];
    
      return (
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          style={{ 
            zIndex: 9000,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
            {navItems.map((item) => (
              <button 
                key={item.key}
                className={`flex flex-col items-center justify-center p-2 min-w-0 transition-colors duration-200 ${
                  currentPage === item.key 
                    ? 'text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className="w-6 h-6 mb-1">
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      );
    };

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
            <div className="min-h-screen bg-white">
                <div className="w-full">
                    <div className="h-screen overflow-y-auto pb-20" style={{ zIndex: 1 }}>
                        <div className="max-w-7xl mx-auto p-4 px-4 sm:px-6 lg:px-8">
                            <div className="text-center py-20">
                                <p className="text-lg sm:text-xl">Loading product details...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomNavigation currentPage={currentPage} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white">
                <div className="w-full">
                    <div className="h-screen overflow-y-auto pb-20" style={{ zIndex: 1 }}>
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
                    </div>
                </div>
                <BottomNavigation currentPage={currentPage} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content Container */}
            <div className="w-full">
                {/* Scrollable Content Area - Same structure as HomePage */}
                <div className="h-screen overflow-y-auto pb-20" style={{ zIndex: 1 }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {/* Breadcrumb */}
                        <nav className="mb-4 sm:mb-6">
                            <button 
                                onClick={() => navigate(-1)}
                                className="text-black-600 hover:text-black-800 mb-4 flex items-center text-sm sm:text-base transition-colors"
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
                                        <span className="text-2xl sm:text-3xl font-bold text-black">Rs. {product.price}</span>
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
                                        Buy Now 
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
                    </div>
                </div>
            </div>
            
            {/* Fixed Bottom Navigation - Always on top */}
            <BottomNavigation currentPage={currentPage} />

            {/* Custom Styles - Same as HomePage */}
            <style jsx>{`
                /* Ensure proper scrolling behavior */
                html, body {
                    height: 100%;
                    overflow: hidden;
                }
                
                /* Custom scrollbar for the main content */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.7);
                }
            `}</style>
        </div>
    );
};

export default ProductPage;