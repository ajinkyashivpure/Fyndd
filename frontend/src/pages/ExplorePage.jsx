import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header.jsx";

const ExplorePage = () => {
    const navigate = useNavigate();

    const handleGenderClick = (gender) => {
        navigate(`/categories/${gender}`);
    };

    return (
        <div className="max-w-full overflow-x-hidden">
            <div className="w-full overflow-x-hidden">
                <div className="explore-page">
                    <div className="explore-container">
                        <Header />
                        
                        {/* Shop Gender Section */}
                        <div className="px-4 py-6 border-b border-gray-200 w-full">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-8 max-w-6xl mx-auto">
                                <div className="flex-1 min-w-0 order-1 px-2 lg:px-0">
                                    <h2 className="text-xl lg:text-3xl font-semibold mb-2 lg:mb-3 leading-tight">Shop Gender</h2>
                                    <p className="text-sm lg:text-lg mb-3 lg:mb-5 leading-relaxed">Something for everyone</p>
                                    <div className="flex gap-3 lg:gap-4 mb-4 lg:mb-2">
                                        <button 
                                            className="bg-red-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-md text-sm lg:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 min-w-fit whitespace-nowrap active:scale-95 lg:active:scale-100"
                                            onClick={() => handleGenderClick('men')}
                                        >
                                            Men
                                        </button>
                                        <button 
                                            className="bg-red-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-md text-sm lg:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 min-w-fit whitespace-nowrap active:scale-95 lg:active:scale-100"
                                            onClick={() => handleGenderClick('women')}
                                        >
                                            Women
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-full lg:max-w-lg order-2 mx-0">
                                    <img
                                        src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/mw.jpg"
                                        alt="Shop by Gender"
                                        loading="lazy"
                                        className="w-full h-70 lg:h-72 object-cover rounded-none lg:rounded-xl transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shop Aesthetics Section */}
                        <div className="px-4 py-6 border-b border-gray-200 w-full">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-8 max-w-6xl mx-auto">
                                <div className="flex-1 max-w-full lg:max-w-lg order-1 lg:order-1 mx-0 mb-6 lg:mb-0">
                                    <img
                                        src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/399fa4ee6b48d782ab3d32af424b7a03-2.jpg"
                                        alt="Shop Aesthetics"
                                        loading="lazy"
                                        className="w-full h-45 lg:h-72 object-cover rounded-lg lg:rounded-xl transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 order-2 lg:order-2 px-2 lg:px-0">
                                    <h2 className="text-xl lg:text-3xl font-semibold mb-2 lg:mb-3 leading-tight">Shop Aesthetics</h2>
                                    <p className="text-sm lg:text-lg mb-3 lg:mb-5 leading-relaxed">What era are you looking for</p>
                                    <button 
                                        className="bg-gray-800 text-white px-8 py-3 rounded-md text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:-translate-y-0.5 active:scale-95 lg:active:scale-100"
                                        onClick={() => navigate('/aesthetics')}
                                    >
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Shop by Brands Section */}
                        <div className="px-4 py-6 border-b border-gray-200 w-full">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-8 max-w-6xl mx-auto">
                                <div className="flex-1 min-w-0 order-1 px-2 lg:px-0">
                                    <h2 className="text-xl lg:text-3xl font-semibold mb-2 lg:mb-3 leading-tight">Shop by Brands</h2>
                                    <p className="text-sm lg:text-lg mb-3 lg:mb-5 leading-relaxed">Shop from your trusted brands</p>
                                    <button className="bg-gray-800 text-white px-8 py-3 rounded-md text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:-translate-y-0.5 active:scale-95 lg:active:scale-100">
                                        Explore
                                    </button>
                                </div>
                                <div className="flex-1 max-w-full lg:max-w-lg order-2 mx-0">
                                    <img
                                        src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/5155e62c4d651437b2f79fa7c94e2bd5-2.jpg"
                                        alt="Shop Brands"
                                        loading="lazy"
                                        className="w-full h-45 lg:h-72 object-cover rounded-lg lg:rounded-xl transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="bg-gray-50 px-6 lg:px-8 py-6 lg:py-8 flex flex-col items-center gap-5 border-t border-gray-200 mt-6">
                            <div className="flex flex-col items-center gap-5 w-full">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-red-600 mb-2">FYNDD</h2>
                                    <p className="text-sm text-gray-600">Your Ultimate Fashion Destination</p>
                                </div>

                                <div className="flex gap-5 my-4">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 text-2xl hover:text-red-600 transition-colors">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 text-2xl hover:text-red-600 transition-colors">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 text-2xl hover:text-red-600 transition-colors">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 mb-4">
                                    <a href="/about" className="text-gray-600 text-sm hover:text-red-600 transition-colors">About Us</a>
                                    <a href="/contact" className="text-gray-600 text-sm hover:text-red-600 transition-colors">Contact</a>
                                    <a href="/terms" className="text-gray-600 text-sm hover:text-red-600 transition-colors">Terms & Conditions</a>
                                    <a href="/privacy" className="text-gray-600 text-sm hover:text-red-600 transition-colors">Privacy Policy</a>
                                </div>

                                <div className="text-center text-gray-500 text-xs pt-4 border-t border-gray-200 w-full">
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