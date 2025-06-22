import React from 'react';
import './ExplorePage.css';
import { useNavigate } from 'react-router-dom';
import Header from "./Header.jsx";




const ExplorePage = () => {
    const navigate = useNavigate();


    const handleGenderClick = (gender) => {
        navigate(`/categories/${gender}`);
    };

    return (
        <div className="container">
            <div className="wrapper">
                <div className="explore-page">
                    <div className="explore-container">
                        <Header />{

                    }
                        {/* Shop Gender Section */}
                        <div className="explore-section">
                            <div className="section-content gender-content">
                                <div className="section-text">
                                    <h2>Shop Gender</h2>
                                    <p>Something for everyone</p>
                                    <div className="gender-buttons">
                                        <button className="gender-btn men-btn" onClick={() => handleGenderClick('men')}>Men</button>
                                        <button className="gender-btn women-btn" onClick={() => handleGenderClick('women')}>Women</button>
                                    </div>
                                </div>
                                <div className="section-image">
                                    <img
                                        src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/gender2.jpeg"
                                        alt="Shop by Gender"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shop Aesthetics Section */}
                        <div className="explore-section">
                            <div className="section-content aesthetics-content">
                                <div className="section-image">
                                    <img
                                        src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/399fa4ee6b48d782ab3d32af424b7a03-2.jpg"
                                        alt="Shop Aesthetics"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="section-text">
                                    <h2>Shop Aesthetics</h2>
                                    <p>What era are you looking for</p>
                                    <button className="explore-btn-2">Explore</button>
                                </div>
                            </div>
                        </div>

                        {/* Shop by Brands Section */}
                        <div className="explore-section">
                            <div className="section-content">
                                <div className="section-text">
                                    <h2>Shop by Brands</h2>
                                    <p>Shop from your trusted brands</p>
                                    <button className="explore-btn-2">Explore</button>
                                </div>
                                <div className="section-image">
                                    <img
                                        src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/5155e62c4d651437b2f79fa7c94e2bd5-2.jpg"
                                        alt="Shop Brands"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
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
        </div>
    );
};

export default ExplorePage;