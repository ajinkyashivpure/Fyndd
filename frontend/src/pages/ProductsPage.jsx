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
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

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

        api.get(`/products/${id}`)
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

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        
        try {
            await api.post('/cart', { 
                productId: product.id, 
                quantity: quantity 
            });
            alert(`Added ${quantity} ${product.title}(s) to cart!`);
        } catch (err) {
            console.error('Add to cart failed:', err);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        // Navigate to checkout with product details
        navigate('/checkout', { 
            state: { 
                items: [{ ...product, quantity }],
                total: product.price * quantity
            } 
        });
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center py-20">
                    <p className="text-xl">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center py-20">
                    <p className="text-red-500 text-xl">{error || 'Product not found'}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                >
                    ← Back
                </button>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image - Left Side */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Additional product images if available */}
                    {product.additionalImages && product.additionalImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.additionalImages.map((img, index) => (
                                <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details - Right Side */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        {product.brand && (
                            <p className="text-gray-600 text-lg">by {product.brand}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <span className="text-3xl font-bold text-black">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">Inclusive of all taxes</p>
                    </div>

                    {/* Product Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {product.description || 'No description available for this product.'}
                        </p>
                    </div>

                    {/* Product Details */}
                    {(product.category || product.material || product.size) && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                            <ul className="space-y-1 text-gray-700">
                                {product.category && <li><strong>Category:</strong> {product.category}</li>}
                                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                                {product.size && <li><strong>Size:</strong> {product.size}</li>}
                                {product.color && <li><strong>Color:</strong> {product.color}</li>}
                            </ul>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= 10}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-full bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? 'Adding to Cart...' : `Add to Cart - ₹${product.price * quantity}`}
                        </button>
                        
                        <button
                            onClick={handleBuyNow}
                            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
                        >
                            Buy Now - ₹{product.price * quantity}
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Delivery & Returns</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Free delivery on orders above ₹500</li>
                            <li>• Easy 30-day returns</li>
                            <li>• Cash on delivery available</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;