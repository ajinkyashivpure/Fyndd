// CategoryPage.jsx
import React from 'react';
import './CategoryPage.css';
import { useParams } from 'react-router-dom';
import Header from "./Header.jsx";
import { useNavigate } from 'react-router-dom';


const CategoryPage = () => {

    const navigate = useNavigate();

    const { gender } = useParams();

    const handleCategoryClick = (link) => {
        navigate(link);
    };


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
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/tops.jpg",
            link: "/women/tops"
        },
        {
            id: 2,
            name: "Bottoms",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/bottoms.jpg",
            link: "/women/bottoms"
        },
        {
            id: 3,
            name: "Dresses",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/dresses.jpg",
            link: "/women/dresses"
        },
        {
            id: 4,
            name: "Activewear",
            image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/sportsw.jpg",
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
                            <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.link)}>
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