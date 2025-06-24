import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductsPage.css';
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

                const response = await fetch(`http://localhost:8080/api/products/type/${encodeURIComponent(type)}`);
                
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
                    <div className="products-page">
                        <Header />
                        <div className="loading">Loading products...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="wrapper">
                    <div className="products-page">
                        <Header />
                        <div className="error">Error loading products: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="wrapper">
                <div className="products-page">
                    <Header />
                    <div className="products-header">
                        <h1>{gender === 'men' ? "Men's" : "Women's"} {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
                        <p>Discover our collection</p>
                    </div>
                    
                    {products.length === 0 ? (
                        <div className="no-products">No products found in this category.</div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img src={product.imageUrl} alt={product.title} loading="lazy" />
                                    </div>
                                    <div className="product-content">
                                        <h3>{product.title}</h3>
                                        <p className="product-brand">{product.brand}</p>
                                        <p className="product-price">${product.price}</p>
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