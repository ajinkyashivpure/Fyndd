import React from 'react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            {/* Header */}
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
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.17a2 2 0 0 0 1.41-.59l1.83-1.82A2 2 0 0 1 10.83 2h2.34a2 2 0 0 1 1.42.59l1.83 1.82A2 2 0 0 0 17.83 5H21a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} />
                        </label>
                    </div>
                    <span className="icon">♡</span>
                    <span className="icon">🛒</span>
                    <span className="icon">👤</span>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Explore fashion like never before</h1>
                    <p>Redefine your entire shopping experience. AI is changing the world, and that should include your wardrobe.</p>
                    <button className="explore-btn">Start Exploring</button>
                </div>
                <div className="hero-images">
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9" alt="Hero 1" />
                </div>
            </section>

            {/* Image Grid */}
            <section className="image-grid-v2">
                <div className="image-row image-row-middle">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Middle Left" />
                    <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca" alt="Middle Right" />
                </div>
                <div className="image-row image-row-bottom">
                    <img className="bottom-left" src="https://images.unsplash.com/photo-1517841905240-472988babdf9" alt="Bottom Left" />
                    <div className="bottom-right-stack">
                        <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" alt="Bottom Right Top" />
                        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2" alt="Bottom Right Bottom" />
                    </div>
                </div>
            </section>

            {/* Trending Aesthetics */}
            <section className="trending-aesthetics">
                <h2>Trending Aesthetics</h2>
                <div className="aesthetics-cards">
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2" alt="Travis Scott Concert" />
                        <h3>Travis Scott Concert</h3>
                        <p>Body text for whatever you'd like to add more to the subheading.</p>
                    </div>
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" alt="Old Money" />
                        <h3>Old Money</h3>
                        <p>Body text for whatever you'd like to expand on the main point.</p>
                    </div>
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308" alt="Y2K" />
                        <h3>Y2K</h3>
                        <p>Body text for whatever you'd like to share more.</p>
                    </div>
                </div>
            </section>

            {/* Popular Brands */}
            <section className="popular-brands">
                <h2>Popular Brands</h2>
                <div className="brands-logos">
                    <div className="brand-logo hm">H&M</div>
                    <div className="brand-logo zara">ZARA</div>
                    <div className="brand-logo freakins">FREAKINS</div>
                </div>
                <div className="brands-names">
                    <span>H&M</span>
                    <span>Zara</span>
                    <span>Freakins</span>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-site">Site name</div>
                <div className="footer-links">
                    <div>
                        <h4>Topic</h4>
                        <p>Page</p>
                        <p>Page</p>
                        <p>Page</p>
                    </div>
                    <div>
                        <h4>Topic</h4>
                        <p>Page</p>
                        <p>Page</p>
                        <p>Page</p>
                    </div>
                    <div>
                        <h4>Topic</h4>
                        <p>Page</p>
                        <p>Page</p>
                        <p>Page</p>
                    </div>
                </div>
                <div className="footer-social">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;