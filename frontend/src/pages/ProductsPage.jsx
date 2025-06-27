
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "./Header.jsx";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { category, gender } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let type = '';
                if (gender === 'men' && category === 't-shirts') {
                    type = "Men's T-shirts and top";
                }
                // Add more conditions for other categories as needed

                const response = await fetch(`https://api.fyndd.in/api/products/type/${encodeURIComponent(type)}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [gender, category]);

    if (loading) {
        return (
            <div className="container">
                <div className="wrapper">
                    <div className="w-full max-w-6xl mx-auto p-5">
                        <Header />
                        <div className="text-center py-12 text-xl text-gray-600">Loading products...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="wrapper">
                    <div className="w-full max-w-6xl mx-auto p-5">
                        <Header />
                        <div className="text-center py-12 text-xl text-red-600">Error loading products: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="wrapper">
                <div className="w-full max-w-6xl mx-auto p-5">
                    <Header />
                    <div className="text-center mb-10">
                        <h1 className="text-4xl mb-2.5 text-gray-800 md:text-3xl sm:text-3xl">
                            {gender === 'men' ? "Men's" : "Women's"} {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h1>
                        <p className="text-xl text-gray-600">Discover our collection</p>
                    </div>
                    
                    {products.length === 0 ? (
                        <div className="text-center py-12 text-xl text-gray-600">No products found in this category.</div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 mb-12 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-5 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-4">
                            {products.map(product => (
                                <div 
                                    key={product.id} 
                                    className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out bg-white cursor-pointer hover:-translate-y-1 hover:shadow-xl group"
                                >
                                    <div className="w-full h-72 overflow-hidden md:h-64 sm:h-48">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.title} 
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg mb-2 text-gray-800 sm:text-base">{product.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                                        <p className="text-lg font-bold text-gray-900">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <footer className="footer">
                        <div className="footer-content">
                            <div className="footer-brand">
                                <h2>FYNDD</h2>
                                <p>Your Ultimate Fashion Destination</p>
                            </div>

                            <div className="social-links">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook"></i>
                                </a>
                            </div>

                            <div className="footer-links">
                                <a href="/about">About Us</a>
                                <a href="/contact">Contact</a>
                                <a href="/terms">Terms & Conditions</a>
                                <a href="/privacy">Privacy Policy</a>
                            </div>

                            <div className="footer-bottom">
                                <p>&copy; 2024 FYNDD. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;