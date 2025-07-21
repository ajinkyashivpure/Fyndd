// ExplorePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const ExplorePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added
    const { type } = useParams();

    useEffect(() => {
        if (!type) {
            setError('No product type specified');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        api.get(`/api/products/type/${type}`)
            .then(res => {
                console.log("API Response:", res.data);
                setProducts(res.data || []);
            })
            .catch(err => {
                console.error('Failed to fetch products:', err);
                setError(`Failed to load ${type} products. Please try again later.`);
            })
            .finally(() => setLoading(false));
    }, [type]);


    const handleAddToCart = async (product) => {
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

    setAddingToCart(productId);

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
  } finally {
    setAddingToCart(null);
  }
};


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

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-xl">Loading {type} products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center py-20">
                    <p className="text-red-500 text-xl">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-black hover:text-gray-600 flex items-center"
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-bold text-center flex-1">{type?.toUpperCase()}</h2>
                <div className="w-16"></div> {/* Spacer for centering */}
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No {type} products found</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Browse All Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => {
                        const productId = product.id || product._id || product.productId || product.product_id;
                        const isAddingToCart = addingToCart === productId;
                        
                        return (
                            <div key={productId || index} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition"
                                        onClick={() => handleProductClick(product)}
                                    />
                                    {/* Optional: Add wishlist button */}
                                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                                        ♡
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 
                                        className="text-lg font-semibold mb-2 cursor-pointer hover:text-gray-600 line-clamp-2"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        {product.title}
                                    </h3>
                                    <p className="text-black font-bold mb-4">₹{product.price}</p>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={isAddingToCart}
                                        className={`w-full px-4 py-2 rounded transition-colors duration-200 ${
                                            isAddingToCart 
                                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                : 'bg-red-600 text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {isAddingToCart ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Adding...
                                            </div>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;