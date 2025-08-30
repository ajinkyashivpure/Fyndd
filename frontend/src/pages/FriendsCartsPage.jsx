import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const FriendsCartsPage = () => {
    const [friendsCarts, setFriendsCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const [addedToCart, setAddedToCart] = useState(new Set()); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchFriendsCarts();
    }, []);

    // Function to fetch cart items and update addedToCart state
    const fetchCartItems = async () => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) return;

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
            
            // Extract product IDs from cart items with multiple possible field names
            const cartProductIds = cartItems.map(item => {
                return item.productId || 
                       item.product_id || 
                       item.id || 
                       item._id ||
                       item.product?.id ||
                       item.product?._id ||
                       item.product?.productId ||
                       (typeof item === 'string' ? item : null);
            }).filter(Boolean); // Remove null/undefined values
            
            console.log('Extracted cart product IDs:', cartProductIds);
            setAddedToCart(new Set(cartProductIds));
        } catch (err) {
            console.error('Failed to fetch cart items:', err);
            console.error('Error details:', err.response?.data);
            // Don't show error to user as this is background operation
        }
    };

    const fetchFriendsCarts = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch('https://api.fyndd.in/cart/friends', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch friends carts');
            }

            const data = await response.json();
            setFriendsCarts(data);
            
            // Fetch cart items after friends carts are loaded
            await fetchCartItems();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Separate useEffect to fetch cart items when user logs in
    useEffect(() => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (token) {
            fetchCartItems();
        }
    }, []); // Run once on component mount

    const addToMyCart = async (product) => {
        const productId = product.id || product._id || product.productId || product.product_id;
        if (!productId) return alert('Product ID is missing!');

        // Check if already added
        if (addedToCart.has(productId)) {
            return alert('Product is already in your cart!');
        }

        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) {
            return navigate('/login', {
                state: { from: location.pathname, action: 'addToCart', product }
            });
        }

        try {
            console.log("Adding to cart:", productId);
            console.log("Auth token:", token);

            setAddingToCart(productId);

            await api.post(`/cart/add/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the addedToCart state immediately
            setAddedToCart(prev => new Set([...prev, productId]));
            
            // Also store in localStorage as backup
            const currentAddedItems = JSON.parse(localStorage.getItem('addedToCart') || '[]');
            currentAddedItems.push(productId);
            localStorage.setItem('addedToCart', JSON.stringify(currentAddedItems));
            
            alert('Added to cart successfully!');
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
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
            if (status === 404) return alert('Product not found. Please refresh.');
            if (status === 400) return alert('Invalid request.');
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="text-center">
                    <p className="text-xl text-red-500">{error}</p>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6">
                <button 
                    onClick={() => navigate('/profile')}
                    className="text-black hover:text-gray-600 flex items-center text-sm sm:text-base"
                >
                    ← Back to Profile
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-center flex-1">FRIENDS' CARTS</h2>
                <div className="w-16 hidden sm:block"></div>
            </div>

            {/* Friends' Carts */}
            {friendsCarts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                        No Friends' Carts Available
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500">
                        Your friends haven't added any items to their carts yet.
                    </p>
                    <button 
                        onClick={() => navigate('/profile/search-friends')}
                        className="mt-4 bg-black text-white px-5 py-2 rounded hover:bg-gray-800 text-sm sm:text-base"
                    >
                        Add More Friends
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {friendsCarts.map((friendCart) => (
                        <div key={friendCart.friendId} className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            {/* Friend Info */}
                            <div className="flex items-center mb-4 pb-4 border-b">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-lg text-gray-600">👤</span>
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-black">
                                        {friendCart.friendName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {friendCart.cartProducts.length} item{friendCart.cartProducts.length !== 1 ? 's' : ''} in cart
                                    </p>
                                </div>
                            </div>

                            {/* Cart Items */}
                            {friendCart.cartProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">🛒</div>
                                    <p className="text-gray-500">Cart is empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {friendCart.cartProducts.map((product, index) => {
                                        const productId = product.id || product._id || product.productId || product.product_id;
                                        const isAddingToCart = addingToCart === productId;
                                        const isAlreadyAdded = addedToCart.has(productId);
                                        
                                        return (
                                            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                {/* Product Image */}
                                                {product.imageUrl && (
                                                    <img 
                                                        src={product.imageUrl} 
                                                        alt={product.title || 'Product'} 
                                                        className="w-full h-32 sm:h-40 object-cover rounded-md mb-3"
                                                    />
                                                )}

                                                {/* Product Details */}
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-sm sm:text-base text-black line-clamp-2">
                                                        {product.title || 'Product Name'}
                                                    </h4>
                                                    <p className="text-lg font-bold text-black">
                                                        ₹{product.price || '0'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {product.quantity || 1}
                                                    </p>

                                                    {/* Add to My Cart Button */}
                                                    <button
                                                        onClick={() => addToMyCart(product)}
                                                        disabled={isAddingToCart || isAlreadyAdded}
                                                        className={`w-full py-2 px-4 rounded text-sm transition-colors duration-200 ${
                                                            isAlreadyAdded
                                                                ? 'bg-green-500 text-white cursor-not-allowed'
                                                                : isAddingToCart 
                                                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                                    : 'bg-black text-white hover:bg-gray-800'
                                                        }`}
                                                    >
                                                        {isAlreadyAdded ? (
                                                            <div className="flex items-center justify-center">
                                                                <span className="mr-2">✓</span>
                                                                Already Added
                                                            </div>
                                                        ) : isAddingToCart ? (
                                                            <div className="flex items-center justify-center">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Adding...
                                                            </div>
                                                        ) : (
                                                            'Add to My Cart'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsCartsPage;