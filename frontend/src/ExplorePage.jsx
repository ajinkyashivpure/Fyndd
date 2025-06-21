import React from 'react';
import './ExplorePage.css';

const ExplorePage = () => {
    return (
        <div className="container">
            <div className="wrapper">
                <div className="explore-page">
                    <div className="explore-container">
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
                        {/* Shop Gender Section */}
                        <div className="explore-section">
                            <div className="section-content gender-content">
                                <div className="section-text">
                                    <h2>Shop Gender</h2>
                                    <p>Something for everyone</p>
                                    <div className="gender-buttons">
                                        <button className="gender-btn men-btn">Men</button>
                                        <button className="gender-btn women-btn">Women</button>
                                    </div>
                                </div>
                                <div className="section-image">
                                    <img
                                        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
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
                                        src="https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&h=300&fit=crop"
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
                                        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
                                        alt="Shop Brands"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="explore-footer">
                            <div className="footer-brand">
                                <h3>Site name</h3>
                            </div>
                            <div className="footer-links-grid">
                                <div className="footer-column">
                                    <h4>Topic</h4>
                                    <a href="#">Page</a>
                                    <a href="#">Page</a>
                                    <a href="#">Page</a>
                                </div>
                                <div className="footer-column">
                                    <h4>Topic</h4>
                                    <a href="#">Page</a>
                                    <a href="#">Page</a>
                                    <a href="#">Page</a>
                                </div>
                                <div className="footer-column">
                                    <h4>Topic</h4>
                                    <a href="#">Page</a>
                                    <a href="#">Page</a>
                                    <a href="#">Page</a>
                                </div>
                            </div>
                            <div className="footer-social">
                                <div className="social-icons">
                                    <span>📘</span>
                                    <span>📷</span>
                                    <span>🐦</span>
                                    <span>📧</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;