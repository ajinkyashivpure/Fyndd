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
    const { type } = useParams();

    useEffect(() => {
        if (!type) {
            setError('No product type specified');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        api.get(`/products/type/${type}`)
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

    console.log("Selected Type:", type);

    const handleAddToCart = (product) => {
        // Check for authentication token
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
            // Save the current page and action for after login
            navigate('/login', { 
                state: { 
                    from: location.pathname,
                    action: 'addToCart',
                    product: product
                }
            });
            return;
        }

        // Get product ID
        const productId = product.id || product._id || product.productId || product.product_id;
        
        if (!productId) {
            alert('Product ID is missing!');
            return;
        }

        api.post('/cart', { productId })
            .then(() => {
                alert('Added to cart successfully!');
            })
            .catch(err => {
                console.error('Add to cart failed:', err);
                if (err.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('token');
                    navigate('/login', { 
                        state: { 
                            from: location.pathname,
                            message: 'Session expired. Please login again.',
                            action: 'addToCart',
                            product: product
                        }
                    });
                } else {
                    alert('Failed to add to cart. Please try again.');
                }
            });
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
                                        className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        Add to Cart
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