import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const FriendsCartsPage = () => {
    const [friendsCarts, setFriendsCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFriendsCarts();
    }, []);

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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addToMyCart = async (product) => {
        const productId = product.id || product._id || product.productId || product.product_id;
  if (!productId) return alert('Product ID is missing!');

  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (!token) {
    return navigate('/login', {
      state: { from: location.pathname, action: 'addToCart', product }
    });
  }

  try {
    console.log("Adding to cart:", productId);
    console.log("Auth token:", token);


    await api.post(`/cart/add/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    
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
                                {friendCart.cartProducts.map((product, index) => (
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
                                                className="w-full bg-black text-white py-2 px-4 rounded text-sm hover:bg-gray-800 transition-colors"
                                            >
                                                Add to My Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
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