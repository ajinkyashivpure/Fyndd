import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Hamburger Menu Component with proper z-index
const HamburgerMenu = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  
  const handleMenuClick = (path) => {
    const isLoggedIn = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (path === '/login' && isLoggedIn) {
      alert('Already logged in.');
      return;
    }
    navigate(path); 
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.clear();
    alert("You have been logged out.");
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger Button - High z-index to stay above everything */}
      <button 
        onClick={onToggle}
        className="relative p-1 focus:outline-none z-[50]"
        aria-label="Toggle menu"
      >
        <div className="w-4 h-4 flex flex-col justify-center items-center">
          <motion.div
            animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-4 h-0.5 bg-gray-700 mb-1"
          />
          <motion.div
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-4 h-0.5 bg-gray-700 mb-1"
          />
          <motion.div
            animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-4 h-0.5 bg-gray-700"
          />
        </div>
      </button>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[40]"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl flex flex-col z-[50]"
            
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-light text-gray-900 tracking-[0.2em]">FYNDD</h2>
              <p className="text-sm text-gray-500 mt-1">Your Fashion Destination</p>
            </div>

            <div className="flex-1 py-6">
              <div className="space-y-2">
                <button
                  onClick={() => handleMenuClick('/search')}
                  className="w-full flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                >
                  <div className="w-6 h-6 mr-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Search</span>
                </button>

                <button
                  onClick={() => handleMenuClick('/cart')}
                  className="w-full flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                >
                  <div className="w-6 h-6 mr-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Cart</span>
                </button>

                <button
                  onClick={() => handleMenuClick('/profile')}
                  className="w-full flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                >
                  <div className="w-6 h-6 mr-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Profile</span>
                </button>

                <button
                  onClick={() => handleMenuClick('/login')}
                  className="w-full flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                >
                  <div className="w-6 h-6 mr-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L13.67 11H3v2h10.67l-3.58 3.59zM19 3H9v2h10v14H9v2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Login</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                >
                  <div className="w-6 h-6 mr-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M16 13v-2H7.83l2.58-2.59L9 7l-5 5 5 5 1.41-1.41L7.83 13H16zm3-10H5c-1.1 0-2 .9-2 2v6h2V5h14v14H5v-6H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Header Component with proper z-index
const Header = ({ selectedGender, setSelectedGender }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className="bg-white border-b border-gray-100 sticky top-0 w-full z-[30]"
      
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-[0.2em]">FYNDD</h1>
          </div>
          
          <div className="absolute right-4 top-4">
            <HamburgerMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>

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
};

// Bottom Navigation Component
const BottomNavigation = ({ currentPage }) => {
  const navigate = useNavigate();
  
  const navItems = [
    {
      key: 'home',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      label: 'Home',
      path: '/'
    },
    {
      key: 'search',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      label: 'Search',
      path: '/search'
    },
    {
      key: 'cart',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ),
      label: 'Cart',
      path: '/cart'
    },
    {
      key: 'profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      label: 'Profile',
      path: '/profile'
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[20] pb-[env(safe-area-inset-bottom)]"
      
    >
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <button 
            key={item.key}
            className={`flex flex-col items-center justify-center p-2 min-w-0 transition-colors duration-200 ${
              currentPage === item.key 
                ? 'text-red-500' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            onClick={() => navigate(item.path)}
          >
            <div className="w-6 h-6 mb-1">
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const carouselImages = {
    women: [
        { type: "wethnic", name: "TRADITIONAL", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/EthnicWomen.jpeg" },
        { type: "partyWomen", name: "PARTY WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/partyWearWomen.jpg" },
        { type: "sportsWomen", name: "ATHLEISURE", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/athlesiureWomen.jpg" },
        { type: "casualWomen", name: "CASUAL WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/casualsWomen.jpg" },
        { type: "formalWomen", name: "FORMAL WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/corporateWomen.jpg" },
        { type: "beachW", name: "BEACH WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/vacationWomen.jpg" }
    ],
    men: [
        { type: "formalMen", name: "FORMALS", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/partyMen.jpg" },
        { type: "casuals", name: " CASUAL WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/casualsMen.jpg" },
        { type: "shirtsMen", name: "SHIRTS", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/OldMoneyMen.jpg" },
        { type: "sportsMen", name: "ATHLEISURE", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/sportsMen.jpg" },
        { type: "summerMen", name: "SUMMER WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/vacationMen.jpg" }
    ]
};

const categories = {
    women: [
        { name: 'DRESSES', link:'dressesW' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/dresses.jpg' },
        { name: 'TOP', link:'topsWomen' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/tops.jpg' },
        { name: 'SPORTS', link:'sportsWomen' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/sportsw.jpg' },
        { name: 'KURTA', link:'wethnic' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/kurtaW.jpg' },
        { name: 'CORSET', link:'cropTopsWomen' ,image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/corsetW.jpg' },
        { name: 'SHIRTS', link:'formalWomen' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/shirtsW.jpg' },
        { name: 'SKIRT', link:'skirtsWomen' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/skirtW.jpg' },
        { name: 'SUIT', link:'formalWomen' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/suitW.jpg ' },
        { name: 'HOODIES', link:'hoodiesWomen' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/hoodiesW.jpg ' },
        { name: 'BOTTOM', link:'bottomsWomen' ,  image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/bottoms.jpg' },
    ],
    men: [
        { name: 'SHIRTS', link:'shirtsMen' , image: ' https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/shirt.jpg' },
        { name: 'SPORTS', link:'sportsMen' ,image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/sports.jpg' },
        { name: 'TSHIRT', link:'casuals' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/t-shirt.jpg' },
        { name: 'TROUSER', link:'' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/trousers.jpeg' },
        { name: 'KURTA', link:'' ,image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/menCategory/kurtaMen.jpg' },
        { name: 'FORMALS', link:'' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/menCategory/formalMen.jpg' },
        { name: 'PANTS', link:'' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/menCategory/pantsMen.jpg' },
        { name: 'HOODIES', link:'' , image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/hoodiesMen.jpg' },
    ]
};

const brands = [
    { name: 'ZARA', link: 'Zara', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/brands/Zara.jpg' },
    { name: 'H&M', link: 'H&M', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/brands/hm.jpg' },
    { name: 'UNIQLO', link: 'Uniqlo', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/brands/uniqlo.jpg' },
    { name: "LEVI'S", link: "Levi's", image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/brands/levis.jpg' },
    { name: "YEZWE", link: 'Yezwe', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/brands/image-2.jpg' },
    { name: "MissPrint", link: 'MissPrint Jaipur', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/brands/missprint.jpg' },
];

// Main HomePage Component
const HomePage = () => {
    const [selectedGender, setSelectedGender] = useState('women');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage] = useState('home');
    const navigate = useNavigate();
    
    const scrollRef = useRef(null);
    const userInteracted = useRef(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let frameId;
        let scrollSpeed = 1; 

        const animateScroll = () => {
            if (!userInteracted.current) {
                container.scrollLeft += scrollSpeed;
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            frameId = requestAnimationFrame(animateScroll);
        };

        frameId = requestAnimationFrame(animateScroll);

        const handleUserScroll = () => {
            userInteracted.current = true;
            clearTimeout(container._resetTimeout);
            container._resetTimeout = setTimeout(() => {
                userInteracted.current = false;
            }, 3000);
        };

        container.addEventListener('scroll', handleUserScroll);

        return () => {
            cancelAnimationFrame(frameId);
            container.removeEventListener('scroll', handleUserScroll);
        };
    }, []);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedGender]);

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

    const handleBrandClick = (brand) => {
        navigate(`/explore/${brand.link}`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content Container */}
            <div className="w-full">
                {/* Scrollable Content Area */}
                <div className="h-screen overflow-y-auto pb-26" style={{ zIndex: 1 }}>
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Header - Sticky positioned */}
                        <Header selectedGender={selectedGender} setSelectedGender={setSelectedGender} />
                        
                        {/* Hero Section */}
                        <section 
                          className="flex flex-col items-start mx-auto max-w-7xl bg-white w-full box-border"
                          style={{ zIndex: 10 }}
                        >
                            <div className="relative w-full mb-6" {...handlers}>
                                <button 
                                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 border border-gray-200 rounded-full w-10 h-10 text-gray-700 cursor-pointer flex items-center justify-center transition-all duration-300 ease-out hover:shadow-lg hover:scale-110 active:scale-95"
                                    style={{ zIndex: 20 }}
                                    onClick={previousImage}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                
                                <div 
                                  className="w-full cursor-pointer" 
                                  onClick={() => navigate(`/explore/${carouselImages[selectedGender][currentImageIndex].type}`)}
                                  style={{ zIndex: 15 }}
                                >
                                    <motion.img
                                      key={carouselImages[selectedGender][currentImageIndex].image}
                                      initial={{ opacity: 0, scale: 1.05 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.7, ease: "easeOut" }}
                                      src={carouselImages[selectedGender][currentImageIndex].image}
                                      alt={`${selectedGender} fashion item ${currentImageIndex + 1}`}
                                      onLoad={handleImageLoad}
                                      className="w-full h-80 md:h-96 lg:h-96 object-cover rounded-md shadow-md"
                                    />
                                </div>
                                
                                <button 
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 border border-gray-200 rounded-full w-10 h-10 text-gray-700 cursor-pointer flex items-center justify-center transition-all duration-300 ease-out hover:shadow-lg hover:scale-110 active:scale-95"
                                    style={{ zIndex: 20 }}
                                    onClick={nextImage}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </section>

                        {/* Dynamic Categories Section */}
                        <section className="p-4 md:p-6" style={{ zIndex: 10 }}>
                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
                                {selectedGender.toUpperCase()}'S CATEGORIES
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                                {categories[selectedGender].map((category, index) => (
                                  <motion.div 
                                    key={index}
                                    onClick={() => navigate(`/explore/${category.link}`)}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, rotateX: 3, rotateY: -3 }}
                                    className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-white transition-all duration-300 ease-out"
                                    style={{ zIndex: 15 }}
                                  >
                                    <img 
                                      src={category.image}
                                      alt={category.name}
                                      className="w-full h-60 md:h-50 object-cover rounded-t-xl"
                                    />
                                    <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
                                      <h3 className="text-white text-xl font-semibold tracking-wide">{category.name}</h3>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Brands Section */}
                        <section className="w-full py-4 md:py-6 bg-white px-4 md:px-0" style={{ zIndex: 10 }}>
                            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Popular Brands</h2>

                            <div className="overflow-hidden">
                                <div
                                  ref={scrollRef}
                                  className="flex overflow-x-scroll no-scrollbar space-x-6 px-1"
                                  style={{ scrollBehavior: 'smooth', zIndex: 15 }}
                                >
                                  {[...brands, ...brands].map((brand, index) => (
                                    <motion.div
                                      key={index}
                                      className="flex-shrink-0 w-40 md:w-48 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
                                      whileHover={{ scale: 1.05 }}
                                      onClick={() => handleBrandClick(brand)}
                                      style={{ zIndex: 15 }}
                                    >
                                      <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="w-full h-35 md:h-32 object-cover"
                                      />
                                      <h3 className="p-2 text-center font-medium text-sm md:text-base">{brand.name}</h3>
                                    </motion.div>
                                  ))}
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="bg-gray-50 py-6 md:py-8 px-4 border-t border-gray-200" style={{ zIndex: 10 }}>
                            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-[0.2em]">FYNDD</h2>
                                    <p className="text-gray-600 text-sm">Your Ultimate Fashion Destination</p>
                                </div>

                                <div className="flex flex-col gap-3 text-center md:text-right">
                                    <a href="/about" className="text-gray-600 text-sm hover:text-gray-800">About Us</a>
                                    <a href="/contact" className="text-gray-600 text-sm hover:text-gray-800">Contact</a>
                                    <a href="/terms" className="text-gray-600 text-sm hover:text-gray-800">Terms & Conditions</a>
                                    <a href="/privacy" className="text-gray-600 text-sm hover:text-gray-800">Privacy Policy</a>
                                </div>
                            </div>
                            
                            <div className="text-center text-gray-500 text-xs mt-6 pt-4 border-t border-gray-200">
                                <p>&copy; 2025 FYNDD. All rights reserved.</p>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            </div>
                
            {/* Fixed Bottom Navigation - Always on top */}
            <BottomNavigation currentPage={currentPage} />

            {/* Custom Styles */}
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
                
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                /* Ensure proper scrolling behavior */
                html, body {
                    height: 100%;
                    overflow: hidden;
                }
                
                /* Custom scrollbar for the main content */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.7);
                }
            `}</style>
        </div>
    );
};

export default HomePage;