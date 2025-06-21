import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import './HomePage.css';

const carouselImages = [
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/OldMoney.jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(2).jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(1).jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.27+(1).jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26.jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(4).jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(3).jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.31.34.jpeg",
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.27+(2).jpeg"
];

const HomePage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const nextImage = useCallback(() => {
        setIsLoading(true);
        setCurrentImageIndex((prevIndex) =>
            prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
    }, []);

    const previousImage = useCallback(() => {
        setIsLoading(true);
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
        );
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: nextImage,
        onSwipedRight: previousImage,
        preventDefaultTouchmoveEvent: true,
        trackMouse: false
    });

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="homepage-container">
            {/* Header - Keeping exactly the same */}
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

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Explore fashion like never before</h1>
                    <p>Redefine your entire shopping experience. AI is changing the world, and that should include your wardrobe.</p>
                    <button className="explore-btn">Start Exploring</button>
                </div>
                <div className="hero-carousel" {...handlers}>
                    <button className="carousel-arrow left" onClick={previousImage}>
                        &#8249;
                    </button>
                    <div className="hero-images">
                        <img
                            src={carouselImages[currentImageIndex]}
                            alt={`Fashion item ${currentImageIndex + 1}`}
                            onLoad={handleImageLoad}
                            style={{ opacity: isLoading ? 0.5 : 1 }}
                        />
                    </div>
                    <button className="carousel-arrow right" onClick={nextImage}>
                        &#8250;
                    </button>
                    <div className="carousel-dots">
                        {carouselImages.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="image-grid">
                {/* Two images right below carousel */}
                <div className="grid-row-two">
                    <img src="https://images.unsplash.com/photo-1485125639709-a60c3a500bf1" alt="Fashion 1" />
                    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b" alt="Fashion 2" />
                </div>

                {/* White space separator */}
                <div className="grid-spacing"></div>

                {/* Three image asymmetric grid */}
                <div className="grid-row-three">
                    <div className="grid-left">
                        <img src="https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe" alt="Fashion 3" />
                    </div>
                    <div className="grid-right">
                        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="Fashion 4" />
                        <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc" alt="Fashion 5" />
                    </div>
                </div>
            </section>


            <section className="trending-aesthetics">
                <h2>Trending Aesthetics</h2>
                <div className="aesthetics-cards">
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1475180098004-ca77a66827be" alt="Trending 1" />
                        <h3>Summer Vibes</h3>
                        <p>Explore the latest summer collection</p>
                    </div>
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" alt="Trending 2" />
                        <h3>Urban Style</h3>
                        <p>Street fashion at its best</p>
                    </div>
                    <div className="card">
                        <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/OldMoney.jpeg" alt="Old Money" />
                        <h3>Old Money</h3>
                        <p>Timeless elegance and sophistication</p>
                    </div>

                </div>
            </section>

            <section className="popular-brands">
                <h2>Popular Brands</h2>
                <div className="brands-grid">
                    <div className="brand-card">
                        <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/Zara.jpeg" alt="Zara" />
                        <h3>Zara</h3>
                    </div>
                    <div className="brand-card">
                        <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/HM.jpeg" alt="H&M" />
                        <h3>H&M</h3>
                    </div>
                    <div className="brand-card">
                        <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/Uniqlo.jpeg" alt="Uniqlo" />
                        <h3>Uniqlo</h3>
                    </div>
                    <div className="brand-card">
                        <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/Levis.jpeg" alt="Levi's" />
                        <h3>Levi's</h3>
                    </div>
                </div>
            </section>

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
    );
};

export default HomePage;