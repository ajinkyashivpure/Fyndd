import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Enhanced Header component with reduced spacing
const Header = ({ selectedGender, setSelectedGender }) => (
  <header className="bg-white border-b border-gray-100">
    <div className="max-w-6xl mx-auto px-4 py-3">
      {/* Logo */}
      <div className="text-center mb-2">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-[0.2em]">FYNDD</h1>
      </div>

      {/* Gender Toggle */}
      <div className="flex justify-center">
        <div className="flex bg-gray-50 rounded-full p-1">
          {["women", "men"].map((gender) => {
            const isSelected = selectedGender === gender;
            const label = gender.charAt(0).toUpperCase() + gender.slice(1);

            return (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out ${
                  isSelected
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </header>
);

const carouselImages = {
    women: [
         { type: "wparty", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/partyWearWomen.jpg" },
        { type: "wathleisure", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/athlesiureWomen.jpg" },
        { type: "wcasuals", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/casualsWomen.jpg" },
        { type: "wcorporate", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/corporateWomen.jpg" },
        { type: "wethnic", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/EthnicWomen.jpeg" },
        { type: "wformal", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/formalWomen.jpg" },
        { type: "wstreetwear", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/streetWearWomen.jpg" },
        { type: "wvacation", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/vacationWomen.jpg" },
        { type: "wy2k", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/y2kWomen.jpg" }
    ],
    men: [
        { type: "party", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/partyMen.jpg" },
        { type: "casuals", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/casualsMen.jpg" },
        { type: "corporate", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/corporateMen.jpg" },
        { type: "ethnic", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/ethnicMen.jpg" },
        { type: "formals", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/formalsMen.jpg" },
        { type: "oldmoney", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/OldMoneyMen.jpg" },
        { type: "sports", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/sportsMen.jpg" },
        { type: "vacation", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/vacationMen.jpg" }
    ]
};

const categories = {
    women: [
        { name: 'BOTTOM', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/bottoms.jpg' },
        { name: 'DRESSES', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/dresses.jpg' },
        { name: 'TOP', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/tops.jpg' },
        { name: 'SPORTS', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/sportsw.jpg' }
    ],
    men: [
        { name: 'SHIRTS', image: ' https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/shirt.jpg' },
        { name: 'SPORTS', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/sports.jpg' },
        { name: 'TSHIRT', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/t-shirt.jpg' },
        { name: 'TROUSER', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/trousers.jpeg' }
    ]
};

const brands = [
    { name: 'Zara', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/Zara.jpg' },
    { name: 'H&M', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/hm.jpg' },
    { name: 'Uniqlo', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/uniqlo.jpg' },
    { name: "Levi's", image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/levis.jpg' },
];

const HomePage = () => {
    const [selectedGender, setSelectedGender] = useState('women');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    // Reset carousel when gender changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedGender]);

    const handleExploreClick = () => {
        console.log('Navigate to explore');
    };

    const nextImage = useCallback(() => {
        setIsLoading(true);
        const images = carouselImages[selectedGender];
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [selectedGender]);

    const previousImage = useCallback(() => {
        setIsLoading(true);
        const images = carouselImages[selectedGender];
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [selectedGender]);

    const handlers = {
        onTouchStart: (e) => {
            const touchStart = e.touches[0].clientX;
            e.currentTarget.touchStartX = touchStart;
        },
        onTouchEnd: (e) => {
            const touchEnd = e.changedTouches[0].clientX;
            const touchStart = e.currentTarget.touchStartX;
            const diff = touchStart - touchEnd;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextImage();
                } else {
                    previousImage();
                }
            }
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };
    
    const handleLogout = () => {
        alert("You have been logged out.");
        navigate('/login'); 
    };

    return (
        <div className="w-full overflow-x-hidden">
            <div className="w-full">
                <div className="overflow-y-auto font-sans bg-white text-gray-800">
                    <Header selectedGender={selectedGender} setSelectedGender={setSelectedGender} />
                    
                    {/* Hero Section with reduced spacing */}
                    <section className="flex flex-col items-start mx-auto max-w-7xl bg-white w-full box-border">
                        
                        {/* Enhanced Carousel with reduced top margin */}
                        <div className="relative w-full mb-6" {...handlers}>
                            {/* Enhanced Left Arrow */}
                            <button 
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 border border-gray-200 rounded-full w-10 h-10 text-gray-700 cursor-pointer flex items-center justify-center z-20 transition-all duration-300 ease-out hover:shadow-lg hover:scale-110 active:scale-95"
                                onClick={previousImage}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            <div className="w-full cursor-pointer" onClick={() =>
                                navigate(`/explore/${carouselImages[selectedGender][currentImageIndex].type}`)
                            }>
                                <img
                                    src={carouselImages[selectedGender][currentImageIndex].image}
                                    alt={`${selectedGender} fashion item ${currentImageIndex + 1}`}
                                    onLoad={handleImageLoad}
                                    className={`w-full h-80 md:h-96 lg:h-96 object-cover block transition-opacity duration-300 ${
                                        isLoading ? 'opacity-50' : 'opacity-100'
                                    }`}
                                />
                            </div>
                            
                            {/* Enhanced Right Arrow */}
                            <button 
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 border border-gray-200 rounded-full w-10 h-10 text-gray-700 cursor-pointer flex items-center justify-center z-20 transition-all duration-300 ease-out hover:shadow-lg hover:scale-110 active:scale-95"
                                onClick={nextImage}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </section>

                    {/* Dynamic Categories Section with reduced spacing */}
                    <section className="p-4 md:p-6">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
                            {selectedGender.toUpperCase()}'S CATEGORIES
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                            {categories[selectedGender].map((category, index) => (
                                <div 
                                    key={index}
                                    onClick={() => navigate(`/explore/${category.name.toLowerCase()}`)} 
                                    className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
                                >
                                    <img 
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center transition-all duration-300 hover:bg-opacity-30">
                                        <h3 className="text-white text-lg md:text-xl font-bold text-center transform transition-all duration-300 hover:scale-110">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Rotating Popular Brands Section with reduced spacing */}
                    <section className="w-full py-4 md:py-6 bg-white px-4 md:px-0 overflow-hidden">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Popular Brands</h2>
                        <div className="relative">
                            <div className="flex animate-scroll space-x-8">
                                {/* First set of brands */}
                                {brands.map((brand, index) => (
                                    <div key={`first-${index}`} className="flex-shrink-0 w-40 md:w-48 bg-white shadow-sm rounded-lg overflow-hidden">
                                        <img 
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-24 md:h-32 object-cover"
                                        />
                                        <h3 className="p-2 text-center font-medium text-sm md:text-base">{brand.name}</h3>
                                    </div>
                                ))}
                                {/* Duplicate set for seamless loop */}
                                {brands.map((brand, index) => (
                                    <div key={`second-${index}`} className="flex-shrink-0 w-40 md:w-48 bg-white shadow-sm rounded-lg overflow-hidden">
                                        <img 
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-24 md:h-32 object-cover"
                                        />
                                        <h3 className="p-2 text-center font-medium text-sm md:text-base">{brand.name}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-gray-50 py-6 md:py-8 px-4 border-t border-gray-200">
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                            <div className="text-center md:text-left">
                                <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-2">FYNDD</h2>
                                <p className="text-gray-600 text-sm">Your Ultimate Fashion Destination</p>
                            </div>

                            <div className="flex justify-center md:justify-center gap-5 text-2xl">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                    <i className="fab fa-facebook"></i>
                                </a>
                            </div>

                            <div className="flex flex-col gap-3 text-center md:text-right">
                                <a href="/about" className="text-gray-600 text-sm hover:text-gray-800">About Us</a>
                                <a href="/contact" className="text-gray-600 text-sm hover:text-gray-800">Contact</a>
                                <a href="/terms" className="text-gray-600 text-sm hover:text-gray-800">Terms & Conditions</a>
                                <a href="/privacy" className="text-gray-600 text-sm hover:text-gray-800">Privacy Policy</a>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                        
                        <div className="text-center text-gray-500 text-xs mt-6 pt-4 border-t border-gray-200">
                            <p>&copy; 2024 FYNDD. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </div>
            
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
                    <button className="flex flex-col items-center justify-center p-2 text-orange-500">
                        <div className="w-6 h-6 mb-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Home</span>
                    </button>
                    
                    <button className="flex flex-col items-center justify-center p-2 text-gray-400 hover:text-blue-500 transition-colors" onClick={() => navigate(`/search`)}>
                        <div className="w-6 h-6 mb-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Search</span>
                    </button>
                    
                    <button className="flex flex-col items-center justify-center p-2 text-gray-400 hover:text-green-500 transition-colors" onClick={() => navigate(`/cart`)}>
                        <div className="w-6 h-6 mb-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Cart</span>
                    </button>
                    
                    <button className="flex flex-col items-center justify-center p-2 text-gray-400 hover:text-purple-500 transition-colors">
                        <div className="w-6 h-6 mb-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Profile</span>
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default HomePage;