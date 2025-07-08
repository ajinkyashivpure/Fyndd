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
            <div className="max-w-6xl mx-auto p-4">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-xl">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <div className="text-center py-20">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button 
                        onClick={fetchCartItems}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 mr-4"
                    >
                        Retry
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-black hover:text-gray-600 flex items-center"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-center flex-1">My Cart</h1>
                <div className="w-16"></div>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started!</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">
                                    Cart Items ({getTotalItems()})
                                </h2>
                                <button
                                    onClick={handleClearCart}
                                    disabled={clearing}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
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
                                            className={`flex items-center space-x-4 p-4 border rounded-lg ${isRemoving ? 'opacity-50' : ''}`}
                                        >
                                            <img
                                                src={item.imageUrl || '/placeholder-image.jpg'}
                                                alt={item.title || 'Product'}
                                                className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-90"
                                                onClick={() => handleProductClick(item)}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                            
                                            <div className="flex-1">
                                                <h3 
                                                    className="font-semibold text-lg cursor-pointer hover:text-gray-600"
                                                    onClick={() => handleProductClick(item)}
                                                >
                                                    {item.title || 'Unknown Product'}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Quantity: {item.quantity || 1}
                                                </p>
                                                <p className="text-black font-bold">
                                                    ₹{item.price || '0.00'}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <p className="font-bold text-lg">
                                                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => handleRemoveItem(productId)}
                                                    disabled={isRemoving}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                                                    title="Remove item"
                                                >
                                                    {isRemoving ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                    ) : (
                                                        '🗑️'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span>Items ({getTotalItems()})</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mb-3">
                                Proceed to Checkout
                            </button>
                            
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;