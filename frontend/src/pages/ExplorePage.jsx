// ExplorePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate , useParams } from 'react-router-dom';
import api from '../api/axios';

const ExplorePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { type } = useParams();

    useEffect(() => {
    if (!type) return;

    setLoading(true);
    api.get(`/products/type/${type}`)
        .then(res => {
            console.log("API Response:", res.data);
            setProducts(res.data);
        })
        .catch(err => {
            console.error('Failed to fetch products:', err);
        })
        .finally(() => setLoading(false));
}, [type]);

     console.log("Selected Type:", type);

    const handleAddToCart = (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        api.post('/cart', { productId: product.id })
            .then(() => alert('Added to cart!'))
            .catch(err => {
                console.error('Add to cart failed:', err);
                alert('Something went wrong');
            });
    };

    const handleProductClick = (product) => {
    // Navigate to individual product page
    navigate(`/product/${product.id}`, { state: { product } });
};

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">{type?.toUpperCase()}</h2>

            {loading ? (
                <p className="text-center">Loading products...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-64 object-cover cursor-pointer"
                                onClick={() => handleProductClick(product)}
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                                <p className="text-black font-bold mb-4">₹{product.price}</p>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
