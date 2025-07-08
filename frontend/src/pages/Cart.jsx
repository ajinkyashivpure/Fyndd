// Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removing, setRemoving] = useState(null); // Track which item is being removed
    const [clearing, setClearing] = useState(false); // Track if cart is being cleared

    // Fetch cart items on component mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            
            if (!token) {
                navigate('/login', { 
                    state: { from: '/cart', message: 'Please login to view your cart.' }
                });
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await api.get('/cart', config);
            console.log('Cart response:', response.data);

            const items = Array.isArray(response.data) ? response.data : response.data.items || [];
            setCartItems(items);
            
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                navigate('/login', { 
                    state: { from: '/cart', message: 'Session expired. Please login again.' }
                });
            } else if (err.response?.status === 404) {
                setCartItems([]);
            } else {
                setError('Failed to load cart. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        if (!productId) {
            alert('Product ID is missing!');
            return;
        }

        try {
            setRemoving(productId);

            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await api.delete(`/cart/remove/${productId}`, config);
            await fetchCartItems();
            
        } catch (err) {
            console.error('Failed to remove item:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                navigate('/login', { 
                    state: { from: '/cart', message: 'Session expired. Please login again.' }
                });
            } else if (err.response?.status === 404) {
                alert('Item not found in cart.');
                await fetchCartItems();
            } else {
                alert('Failed to remove item. Please try again.');
            }
        } finally {
            setRemoving(null);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }

        try {
            setClearing(true);

            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await api.delete('/cart/clear', config);
            setCartItems([]);
            alert('Cart cleared successfully');
            
        } catch (err) {
            console.error('Failed to clear cart:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                navigate('/login', { 
                    state: { from: '/cart', message: 'Session expired. Please login again.' }
                });
            } else {
                alert('Failed to clear cart. Please try again.');
            }
        } finally {
            setClearing(false);
        }
    };

    const handleProductClick = (item) => {
        // Handle different possible ID field names
        const productId = item.productId || item.id || item._id || item.product_id;
        if (productId) {
            navigate(`/products/${productId}`, { state: { product: item } });
        }
    };

    // New function to handle Buy Now redirect
    const handleBuyNow = (item) => {
        // Check if the item has a URL from the API
        if (item.url) {
            // If it's a full URL, open it in a new tab
            if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
                window.open(item.url, '_blank');
            } else {
                // If it's a relative URL, navigate within the app
                navigate(item.url);
            }
        } else {
            // Fallback: navigate to the product detail page
            const productId = item.productId || item.id || item._id || item.product_id;
            if (productId) {
                navigate(`/products/${productId}`, { state: { product: item } });
            } else {
                alert('Product URL not available');
            }
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price || 0);
            const quantity = parseInt(item.quantity || 1);
            return total + (price * quantity);
        }, 0).toFixed(2);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => {
            return total + parseInt(item.quantity || 1);
        }, 0);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-4 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12 sm:py-20">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-lg sm:text-xl">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-4 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12 sm:py-20">
                    <p className="text-red-500 text-lg sm:text-xl mb-4">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <button 
                            onClick={fetchCartItems}
                            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                        >
                            Retry
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-black hover:text-gray-600 flex items-center text-sm sm:text-base transition-colors"
                >
                    ← Back
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-center flex-1">My Cart</h1>
                <div className="w-12 sm:w-16"></div>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                    <div className="text-4xl sm:text-6xl mb-4">🛒</div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some products to get started!</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {/* Cart Items */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                            <h2 className="text-lg sm:text-xl font-semibold">
                                Cart Items ({getTotalItems()})
                            </h2>
                            <button
                                onClick={handleClearCart}
                                disabled={clearing}
                                className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 self-start sm:self-auto transition-colors"
                            >
                                {clearing ? 'Clearing...' : 'Clear Cart'}
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {cartItems.map((item, index) => {
                                const productId = item.productId || item.id || item._id || item.product_id;
                                const isRemoving = removing === productId;
                                
                                return (
                                    <div 
                                        key={productId || index} 
                                        className={`flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg ${isRemoving ? 'opacity-50' : ''} transition-opacity`}
                                    >
                                        {/* Product Image and Basic Info */}
                                        <div className="flex items-start space-x-3 sm:space-x-4">
                                            <img
                                                src={item.imageUrl || '/placeholder-image.jpg'}
                                                alt={item.title || 'Product'}
                                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                                                onClick={() => handleProductClick(item)}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                            
                                            <div className="flex-1 min-w-0">
                                                <h3 
                                                    className="font-semibold text-sm sm:text-lg cursor-pointer hover:text-gray-600 line-clamp-2 transition-colors"
                                                    onClick={() => handleProductClick(item)}
                                                >
                                                    {item.title || 'Unknown Product'}
                                                </h3>
                                                <p className="text-gray-600 text-xs sm:text-sm">
                                                    Quantity: {item.quantity || 1}
                                                </p>
                                                <p className="text-black font-bold text-sm sm:text-base">
                                                    ₹{item.price || '0.00'}
                                                </p>
                                                <p className="font-bold text-sm sm:text-lg">
                                                    Total: ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center space-x-3 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleBuyNow(item)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-none"
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(productId)}
                                                disabled={isRemoving}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors flex-shrink-0"
                                                title="Remove item"
                                            >
                                                {isRemoving ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                ) : (
                                                    <span className="text-lg">🗑️</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Cart Summary */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg sm:text-xl font-semibold">Total:</span>
                                <span className="text-lg sm:text-xl font-bold text-green-600">₹{calculateTotal()}</span>
                            </div>
                            <div className="text-center">
                                <button 
                                    onClick={() => navigate('/')}
                                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Padding */}
            <div className="sm:hidden h-4"></div>
        </div>
    );
};

export default Cart;