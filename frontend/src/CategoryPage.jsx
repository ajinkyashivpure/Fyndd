// CategoryPage.jsx
import React from 'react';
import './CategoryPage.css';
import { useParams } from 'react-router-dom';


const CategoryPage = () => {

    const { gender } = useParams();

    const menCategories = [
        {
            id: 1,
            name: "T-Shirts",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
            link: "/men/t-shirts"
        },
        {
            id: 2,
            name: "Shirts",
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop",
            link: "/men/shirts"
        },
        {
            id: 3,
            name: "Trousers",
            image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=600&fit=crop",
            link: "/men/trousers"
        },
        {
            id: 4,
            name: "Sports",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=600&fit=crop",
            link: "/men/sports"
        }
    ];

    const womenCategories = [
        {
            id: 1,
            name: "Tops",
            image: "https://images.unsplash.com/photo-1551048632-24e444b48a3e?w=800&h=600&fit=crop",
            link: "/women/tops"
        },
        {
            id: 2,
            name: "Bottoms",
            image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop",
            link: "/women/bottoms"
        },
        {
            id: 3,
            name: "Dresses",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop",
            link: "/women/dresses"
        },
        {
            id: 4,
            name: "Activewear",
            image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop",
            link: "/women/activewear"
        }
    ];

    const categories = gender === 'men' ? menCategories : womenCategories;

    return (
        <div className="container">
            <div className="wrapper">
                <div className="category-page">
                    <header className="header">
                        <div className="header-left">
                            <div className="logo">fynd</div>
                            <nav className="nav">
                                <a href="#">Women</a>
                                <a href="#">Men</a>
                                <a href="#">Trending</a>
                            </nav>
                        </div>
                        <div className="header-right">
                            <div className="search-bar-wrapper">
                                <input type="text" placeholder="Search" className="search-bar" />
                                <label htmlFor="image-upload" className="camera-icon" title="Upload image">
                                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.17a2 2 0 0 0 1.41-.59l1.83-1.82A2 2 0 0 1 10.83 2h2.34a2 2 0 0 1 1.42.59l1.83 1.82A2 2 0 0 0 17.83 5H21a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                    <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} />
                                </label>
                            </div>
                            <span className="icon">♡</span>
                            <span className="icon">🛒</span>
                            <span className="icon">👤</span>
                        </div>
                    </header>
                    <div className="category-header">
                        <h1>{gender === 'men' ? "Men's" : "Women's"} Categories</h1>
                        <p>Find your perfect style</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map(category => (
                            <div key={category.id} className="category-card">
                                <div className="category-image">
                                    <img src={category.image} alt={category.name} loading="lazy" />
                                </div>
                                <div className="category-content">
                                    <h2>{category.name}</h2>
                                    <button className="explore-btn" onClick={() => window.location.href = category.link}>
                                        Explore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

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

export default CategoryPage;