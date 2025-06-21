import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import './HomePage.css';

const carouselImages = [
    "https://fyndd-storage.s3.ap-south-1.amazonaws.com/OldMoney.jpeg",
    "https://images.unsplash.com/photo-1445205170230-053b83016050",
    "https://images.unsplash.com/photo-1485125639709-a60c3a500bf1",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
    "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc",
    "https://images.unsplash.com/photo-1475180098004-ca77a66827be",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
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
                <div className="grid-row grid-row-two">
                    <img src="https://images.unsplash.com/photo-1485125639709-a60c3a500bf1" alt="Fashion 1" />
                    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b" alt="Fashion 2" />
                </div>
                <div className="grid-row grid-row-three">
                    <img src="https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe" alt="Fashion 3" />
                    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="Fashion 4" />
                    <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc" alt="Fashion 5" />
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

        </div>
    );
};

export default HomePage;