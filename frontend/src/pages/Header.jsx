
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="flex items-center justify-between pt-4 pb-3 px-4 md:pt-[18px] md:pb-3 md:px-8 border-b border-gray-200 w-full box-border flex-wrap md:flex-nowrap gap-2 md:gap-0">
            <div className="flex items-center flex-none md:flex-1 min-w-0 w-auto md:w-full">
                <div className="text-2xl md:text-3xl font-bold tracking-wider mr-0 md:mr-10" style={{ fontFamily: 'Pacifico, cursive' }}>
                    fyndd
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#" className="no-underline text-gray-800 font-medium text-base px-0.5">Women</a>
                    <a href="#" className="no-underline text-gray-800 font-medium text-base px-0.5">Men</a>
                    {/*<a href="#">Trending</a>*/}
                </nav>
            </div>
            <div className="flex-1 md:flex-none flex items-center justify-end gap-3 md:gap-4">
                <div className="relative flex items-center flex-1 md:flex-none max-w-[250px] md:max-w-none mr-2 md:mr-0">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="py-1.5 md:py-2 pl-3 md:pl-5 pr-8 md:pr-12 rounded-full border-2 border-gray-800 text-sm md:text-base font-normal w-full md:w-[420px] md:max-w-[520px] box-border" 
                    />
                    <label htmlFor="image-upload" className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-transparent border-none p-0 flex items-center" title="Upload image">
                        <svg 
                            width="18" 
                            height="18" 
                            className="md:w-[22px] md:h-[22px] block" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.17a2 2 0 0 0 1.41-.59l1.83-1.82A2 2 0 0 1 10.83 2h2.34a2 2 0 0 1 1.42.59l1.83 1.82A2 2 0 0 0 17.83 5H21a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} />
                    </label>
                </div>
                <span className="text-xl md:text-2xl cursor-pointer m-0 px-1 md:px-1">♡</span>
                <span className="text-xl md:text-2xl cursor-pointer m-0 px-1 md:px-1">🛒</span>
                <span className="text-xl md:text-2xl cursor-pointer m-0 px-1 md:px-1">👤</span>
            </div>
        </header>
    );
};

export default Header;