import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import Header from "./Header.jsx";

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
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleExploreClick = () => {
        navigate('/explore');
    };


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
        <div className="container">
            <div className="wrapper">
                <div className="homepage-container">
                    {/* Header - Keeping exactly the same */}
                   <Header />{

                }
                    {/* Hero Section */}
                    <section className="hero">
                        <div className="hero-text">
                            <h1>Explore fashion like never before</h1>
                            <p>Redefine your entire shopping experience. AI is changing the world, and that should include your wardrobe.</p>
                            <button className="explore-btn" onClick={handleExploreClick}>Start Exploring</button>
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
                        <div className="grid-row-two">
                            <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/grid+2+left.png" alt="Fashion 1" />
                            <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/grid+2+right.png" alt="Fashion 2" />
                        </div>
                        <div className="grid-spacing"></div>
                        <div className="grid-row-three">
                            <div className="grid-left">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/grid+3+left+.png" alt="Fashion 3" />
                            </div>
                            <div className="grid-right">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/grid+3+right+up+.png" alt="Fashion 4" />
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/grid+3+right+down+.png" alt="Fashion 5" />
                            </div>
                        </div>
                    </section>


                    <section className="trending-aesthetics">
                        <div className="aesthetics-cards">
                            <div className="card">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/travis-2.jpg" alt="Trending 1" />
                                <h3>Travis Scott Concert</h3>
                                <p>Utility meets performance.</p>
                            </div>
                            <div className="card">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/urban-2.jpg" alt="Trending 2" />
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
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/Zara.jpg" alt="Zara" />
                                <h3>Zara</h3>
                            </div>
                            <div className="brand-card">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/hm.jpg" alt="H&M" />
                                <h3>H&M</h3>
                            </div>
                            <div className="brand-card">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/uniqlo.jpg" alt="Uniqlo" />
                                <h3>Uniqlo</h3>
                            </div>
                            <div className="brand-card">
                                <img src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/levis.jpg" alt="Levi's" />
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
            </div>
        </div>

    );
};

export default HomePage;