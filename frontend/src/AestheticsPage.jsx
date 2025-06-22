// src/pages/AestheticsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AestheticsPage.css';
import Header from "./Header.jsx";

const AestheticsPage = () => {
    const navigate = useNavigate();

    const aesthetics = [
        {
            id: 'old-money',
            name: 'Old Money',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/OldMoney.jpeg',
            description: 'Timeless luxury and sophistication'
        },
        {
            id: 'streetwear',
            name: 'Street Wear',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(2).jpeg',
            description: 'Urban and contemporary style'
        },
        {
            id: 'formals',
            name: 'Formals',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(4).jpeg',
            description: 'Professional and polished looks'
        },
        {
            id: 'athleisure',
            name: 'Athleisure',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26.jpeg',
            description: 'Athletic meets leisure wear'
        },
        {
            id: 'y2k',
            name: 'Y2K',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(1).jpeg',
            description: 'Retro futuristic fashion'
        },
        {
            id: 'casual',
            name: 'Casual',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.27+(1).jpeg',
            description: 'Everyday comfort style'
        },
        {
            id: 'beach',
            name: 'Beach',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.27+(2).jpeg',
            description: 'Summer and resort wear'
        },
        {
            id: 'ethnic',
            name: 'Ethnic',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.31.34.jpeg',
            description: 'Traditional and cultural fashion'
        },
        {
            id: 'party',
            name: 'Party Wear',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(3).jpeg',
            description: 'Glamorous evening styles'
        }
    ];

    const handleAestheticClick = (aestheticId) => {
        navigate(`/aesthetic/${aestheticId}`);
    };

    return (
        <div className="container">
            <div className="wrapper">
                <div className="aesthetics-page">
                    <Header />{

                }
                    <div className="aesthetics-container">
                        <div className="aesthetics-header">
                            <h1>Shop by Aesthetics</h1>
                            <p>Find your perfect style</p>
                        </div>
                        <div className="aesthetics-grid">
                            {aesthetics.map((aesthetic) => (
                                <div
                                    key={aesthetic.id}
                                    className="aesthetic-card"
                                    onClick={() => handleAestheticClick(aesthetic.id)}
                                >
                                    <div className="aesthetic-image">
                                        <img
                                            src={aesthetic.image}
                                            alt={aesthetic.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="aesthetic-info">
                                        <h3>{aesthetic.name}</h3>
                                        <p>{aesthetic.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AestheticsPage;