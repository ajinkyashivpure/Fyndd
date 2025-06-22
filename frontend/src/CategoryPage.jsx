// CategoryPage.jsx
import React from 'react';
import './CategoryPage.css';
import { useParams } from 'react-router-dom';
import Header from "./Header.jsx";


const CategoryPage = () => {

    const { gender } = useParams();

    const menCategories = [
        {
            id: 1,
            name: "T-Shirts",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/t-shirt.jpg",
            link: "/men/t-shirts"
        },
        {
            id: 2,
            name: "Shirts",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/shirt.jpg",
            link: "/men/shirts"
        },
        {
            id: 3,
            name: "Trousers",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/trousers.jpeg",
            link: "/men/trousers"
        },
        {
            id: 4,
            name: "Sports",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/sports.jpg",
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
                    <Header />{

                }
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