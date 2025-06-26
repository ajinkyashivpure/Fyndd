// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">fyndd</div>
                <nav className="nav">
                    <a href="#">Women</a>
                    <a href="#">Men</a>
                    {/*<a href="#">Trending</a>*/}
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
    );
};

export default Header;