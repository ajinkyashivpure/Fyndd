// CategoryPage.jsx
import React from 'react';
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
        <div className="max-w-full overflow-x-hidden">
            <div className="wrapper">
                <div className="w-full p-4 max-w-6xl mx-auto lg:p-8">
                    <Header />
                    
                    <div className="text-center my-6 px-4 md:my-8 lg:my-12">
                        <h1 className="text-3xl text-gray-800 mb-2 lg:text-4xl">
                            {gender === 'men' ? "Men's" : "Women's"} Categories
                        </h1>
                        <p className="text-lg text-gray-600">Find your perfect style</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:gap-8 lg:gap-10">
                        {categories.map(category => (
                            <div 
                                key={category.id} 
                                className="relative rounded-xl overflow-hidden bg-white shadow-lg transition-transform duration-300 ease-in-out cursor-pointer hover:-translate-y-1 group"
                                onClick={() => handleCategoryClick(category.link)}
                            >
                                <div className="w-full h-48 relative overflow-hidden md:h-70 lg:h-90">
                                    <img 
                                        src={category.image} 
                                        alt={category.name} 
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent text-white flex justify-start items-center">
                                    <h2 className="text-2xl m-0 drop-shadow-md lg:text-3xl">
                                        {category.name}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer className="p-6 bg-gray-100 mt-6 md:hidden">
                        <div className="flex flex-col items-center gap-5">
                            <div className="text-center">
                                <h2 className="text-2xl text-red-600 mb-2">FYNDD</h2>
                                <p className="text-sm text-gray-600">Your Ultimate Fashion Destination</p>
                            </div>

                            <div className="flex gap-5 my-4">
                                <a 
                                    href="https://instagram.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-700 text-2xl"
                                >
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a 
                                    href="https://twitter.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-700 text-2xl"
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-700 text-2xl"
                                >
                                    <i className="fab fa-facebook"></i>
                                </a>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4 mb-4">
                                <a href="/about" className="text-gray-600 no-underline text-sm">About Us</a>
                                <a href="/contact" className="text-gray-600 no-underline text-sm">Contact</a>
                                <a href="/terms" className="text-gray-600 no-underline text-sm">Terms & Conditions</a>
                                <a href="/privacy" className="text-gray-600 no-underline text-sm">Privacy Policy</a>
                            </div>

                            <div className="text-center text-gray-500 text-xs pt-4 border-t border-gray-300 w-full">
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